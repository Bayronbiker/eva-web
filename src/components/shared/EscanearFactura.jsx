import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Camera, Image, Loader2, AlertCircle, X } from 'lucide-react';
import config from '../../config';

const BASE_URL = config.API_URL;
const axiosAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

/**
 * Comprime la imagen a máx 1400px y calidad 82% JPEG para no saturar la API.
 */
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
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

/**
 * Botón con dos opciones: tomar foto nueva (cámara) o elegir de galería.
 * Props:
 *   onResultado(datos)  → callback con el JSON extraído
 *   label               → texto del botón principal (opcional)
 *   style               → estilos extra (opcional)
 */
export default function EscanearFactura({ onResultado, label = 'Escanear factura con IA', style = {} }) {
  const inputCamaraRef = useRef(null);
  const inputGaleriaRef = useRef(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);

  const procesarArchivo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    setMenuAbierto(false);
    setCargando(true);
    try {
      const imagen = await comprimirImagen(file);
      const { data } = await axios.post(
        `${BASE_URL}/analizar-factura`,
        { imagen },
        { ...axiosAuth(), timeout: 90000 }
      );
      onResultado(data);
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg || 'Error analizando la imagen. Intenta con una foto más clara y bien iluminada.');
    } finally {
      setCargando(false);
      e.target.value = '';
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Inputs ocultos */}
      <input
        ref={inputCamaraRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={procesarArchivo}
      />
      <input
        ref={inputGaleriaRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={procesarArchivo}
      />

      {/* Botón principal */}
      <button
        type="button"
        disabled={cargando}
        onClick={() => !cargando && setMenuAbierto((v) => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '11px 20px', borderRadius: 10,
          background: cargando ? '#e0e0e0' : 'linear-gradient(135deg, #1565C0, #1976D2)',
          color: '#fff', border: 'none',
          cursor: cargando ? 'not-allowed' : 'pointer',
          fontSize: 14, fontWeight: 700,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          transition: 'opacity 0.2s',
          opacity: cargando ? 0.7 : 1,
          ...style
        }}
      >
        {cargando
          ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analizando factura...</>
          : <><Camera size={16} /> {label}</>
        }
      </button>

      {/* Menú desplegable */}
      {menuAbierto && !cargando && (
        <>
          {/* Capa para cerrar al tocar afuera */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 999 }}
            onClick={() => setMenuAbierto(false)}
          />
          <div style={{
            position: 'absolute', top: '110%', left: 0, zIndex: 1000,
            background: '#fff', borderRadius: 12,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            border: '1px solid #e0e0e0',
            minWidth: 220, overflow: 'hidden',
          }}>
            {/* Opción 1: Tomar foto */}
            <button
              type="button"
              onClick={() => { setMenuAbierto(false); inputCamaraRef.current?.click(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '14px 18px',
                background: 'none', border: 'none',
                cursor: 'pointer', textAlign: 'left',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                borderBottom: '1px solid #f0f0f0',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5f9ff'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <span style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Camera size={18} color="#1565C0" />
              </span>
              <span>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>Tomar foto</div>
                <div style={{ fontSize: 11, color: '#9e9e9e', marginTop: 1 }}>Usar la cámara ahora</div>
              </span>
            </button>

            {/* Opción 2: Seleccionar de galería */}
            <button
              type="button"
              onClick={() => { setMenuAbierto(false); inputGaleriaRef.current?.click(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '14px 18px',
                background: 'none', border: 'none',
                cursor: 'pointer', textAlign: 'left',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5f9ff'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <span style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Image size={18} color="#2E7D32" />
              </span>
              <span>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>Elegir de galería</div>
                <div style={{ fontSize: 11, color: '#9e9e9e', marginTop: 1 }}>Seleccionar foto existente</div>
              </span>
            </button>
          </div>
        </>
      )}

      {/* Error */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 6,
          marginTop: 8, padding: '8px 12px',
          background: '#FFEBEE', borderRadius: 8, border: '1px solid #FFCDD2',
          maxWidth: 320,
        }}>
          <AlertCircle size={14} color="#C62828" style={{ flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: 12, color: '#C62828', lineHeight: 1.5, flex: 1 }}>{error}</span>
          <button
            type="button"
            onClick={() => setError('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#C62828', flexShrink: 0 }}
          >
            <X size={12} />
          </button>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
