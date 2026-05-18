import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Image, FileText, Loader2, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import config from '../../config';

const BASE_URL = config.API_URL;
const axiosAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

/* ── Compresión de imagen ────────────────────────────────────────────────── */
const comprimirImagen = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX = 1400;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
          else { width = Math.round((width * MAX) / height); height = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

/* ── MEJORA #4: Conversión PDF → imagen (primera página) ────────────────── */
const cargarPdfJs = () =>
  new Promise((resolve) => {
    if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    document.head.appendChild(script);
  });

const convertirPDFaImagen = async (file) => {
  const pdfjs  = await cargarPdfJs();
  const buffer = await file.arrayBuffer();
  const pdf    = await pdfjs.getDocument({ data: buffer }).promise;
  const page   = await pdf.getPage(1);
  const vp     = page.getViewport({ scale: 2.0 });
  const canvas = document.createElement('canvas');
  canvas.width = vp.width; canvas.height = vp.height;
  await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
  return canvas.toDataURL('image/jpeg', 0.85);
};

/* ── Pasos de progreso ───────────────────────────────────────────────────── */
const PASOS = {
  comprimiendo: '⚙️  Comprimiendo imagen...',
  convirtiendo: '📄  Convirtiendo PDF...',
  enviando:     '📡  Enviando a la IA...',
  analizando:   '🔍  Analizando factura',
};

/**
 * Botón con menú: Tomar foto · Elegir de galería · Seleccionar PDF
 * MEJORAS: #4 PDF, #8 progreso con timer
 */
export default function EscanearFactura({ onResultado, label = 'Escanear factura con IA', style = {} }) {
  const inputCamRef    = useRef(null);
  const inputGalRef    = useRef(null);
  const inputPdfRef    = useRef(null);
  const timerRef       = useRef(null);

  const [cargando,     setCargando]     = useState(false);
  const [paso,         setPaso]         = useState('');
  const [segundos,     setSegundos]     = useState(0);
  const [error,        setError]        = useState('');
  const [menuAbierto,  setMenuAbierto]  = useState(false);

  /* Limpiar timer al desmontar */
  useEffect(() => () => clearInterval(timerRef.current), []);

  const iniciarTimer = () => {
    setSegundos(0);
    timerRef.current = setInterval(() => setSegundos(s => s + 1), 1000);
  };
  const pararTimer = () => { clearInterval(timerRef.current); timerRef.current = null; };

  /* ── Procesamiento principal ─────────────────────────────────────────── */
  const procesarArchivo = async (e, esPdf = false) => {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    setMenuAbierto(false);
    setCargando(true);

    try {
      let imagen;

      if (esPdf) {
        setPaso('convirtiendo');
        imagen = await convertirPDFaImagen(file);
      } else {
        setPaso('comprimiendo');
        imagen = await comprimirImagen(file);
      }

      setPaso('enviando');
      await new Promise(r => setTimeout(r, 300)); // pequeña pausa UX

      setPaso('analizando');
      iniciarTimer();

      const { data } = await axios.post(
        `${BASE_URL}/analizar-factura`,
        { imagen },
        { ...axiosAuth(), timeout: 120000 }
      );

      pararTimer();
      onResultado(data);
    } catch (err) {
      pararTimer();
      const msg = err.response?.data?.message;
      setError(msg || 'Error analizando la imagen. Intenta con una foto más clara y bien iluminada.');
    } finally {
      setCargando(false);
      setPaso('');
      e.target.value = '';
    }
  };

  /* ── Texto del botón según paso ─────────────────────────────────────── */
  const textoBotón = () => {
    if (!cargando) return <><Camera size={16} /> {label}</>;
    if (paso === 'analizando')
      return <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> {PASOS.analizando} ({segundos}s)</>;
    return <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> {PASOS[paso] || 'Procesando...'}</>;
  };

  /* ── Ítem del menú ──────────────────────────────────────────────────── */
  const MenuItem = ({ onClick, icono: Icono, bgColor, iconColor, titulo, subtitulo, borde = true }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', padding: '14px 18px',
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        borderBottom: borde ? '1px solid #f0f0f0' : 'none',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#f5f9ff'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      <span style={{ width: 36, height: 36, borderRadius: 10, background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icono size={18} color={iconColor} />
      </span>
      <span>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>{titulo}</div>
        <div style={{ fontSize: 11, color: '#9e9e9e', marginTop: 1 }}>{subtitulo}</div>
      </span>
    </button>
  );

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Inputs ocultos */}
      <input ref={inputCamRef} type="file" accept="image/*" capture="environment"   style={{ display: 'none' }} onChange={e => procesarArchivo(e, false)} />
      <input ref={inputGalRef} type="file" accept="image/*"                         style={{ display: 'none' }} onChange={e => procesarArchivo(e, false)} />
      <input ref={inputPdfRef} type="file" accept="application/pdf"                 style={{ display: 'none' }} onChange={e => procesarArchivo(e, true)}  />

      {/* Botón principal */}
      <button
        type="button"
        disabled={cargando}
        onClick={() => !cargando && setMenuAbierto(v => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '11px 20px', borderRadius: 10,
          background: cargando ? '#e0e0e0' : 'linear-gradient(135deg,#1565C0,#1976D2)',
          color: '#fff', border: 'none',
          cursor: cargando ? 'not-allowed' : 'pointer',
          fontSize: 14, fontWeight: 700,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          transition: 'opacity 0.2s', opacity: cargando ? 0.85 : 1,
          minWidth: 220, justifyContent: 'center',
          ...style,
        }}
      >
        {textoBotón()}
      </button>

      {/* Barra de progreso animada */}
      {cargando && (
        <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: '#e0e0e0', overflow: 'hidden', width: '100%' }}>
          <div style={{ height: '100%', background: '#1565C0', borderRadius: 2, animation: 'progreso 2s ease-in-out infinite' }} />
        </div>
      )}

      {/* Menú desplegable */}
      {menuAbierto && !cargando && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setMenuAbierto(false)} />
          <div style={{
            position: 'absolute', top: '110%', left: 0, zIndex: 1000,
            background: '#fff', borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            border: '1px solid #e8e8e8', minWidth: 240, overflow: 'hidden',
          }}>
            <MenuItem onClick={() => { setMenuAbierto(false); inputCamRef.current?.click(); }}
              icono={Camera} bgColor="#E3F2FD" iconColor="#1565C0"
              titulo="Tomar foto" subtitulo="Abrir cámara ahora" />
            <MenuItem onClick={() => { setMenuAbierto(false); inputGalRef.current?.click(); }}
              icono={Image} bgColor="#E8F5E9" iconColor="#2E7D32"
              titulo="Elegir de galería" subtitulo="Seleccionar foto existente" />
            <MenuItem onClick={() => { setMenuAbierto(false); inputPdfRef.current?.click(); }}
              icono={FileText} bgColor="#FFF3E0" iconColor="#E65100"
              titulo="Seleccionar PDF" subtitulo="Convierte la 1ª página automáticamente" borde={false} />
          </div>
        </>
      )}

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 8, padding: '8px 12px', background: '#FFEBEE', borderRadius: 8, border: '1px solid #FFCDD2', maxWidth: 320 }}>
          <AlertCircle size={14} color="#C62828" style={{ flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: 12, color: '#C62828', lineHeight: 1.5, flex: 1 }}>{error}</span>
          <button type="button" onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#C62828', flexShrink: 0 }}>
            <X size={12} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin     { from{transform:rotate(0deg)}  to{transform:rotate(360deg)} }
        @keyframes progreso { 0%{width:0%;margin-left:0} 50%{width:60%;margin-left:20%} 100%{width:0%;margin-left:100%} }
      `}</style>
    </div>
  );
}
