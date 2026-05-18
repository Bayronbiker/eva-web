import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Camera, Loader2, AlertCircle } from 'lucide-react';
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
      const img = new Image();
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
 * Botón que abre la cámara/galería, comprime la imagen y llama a la API de IA.
 * Props:
 *   onResultado(datos)  → callback con el JSON extraído
 *   label               → texto del botón (opcional)
 *   style               → estilos extra (opcional)
 */
export default function EscanearFactura({ onResultado, label = 'Escanear factura con IA', style = {} }) {
  const inputRef = useRef(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleArchivo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    setCargando(true);
    try {
      const imagen = await comprimirImagen(file);
      const { data } = await axios.post(
        `${BASE_URL}/analizar-factura`,
        { imagen },
        { ...axiosAuth(), timeout: 60000 } // 60s para la IA
      );
      onResultado(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error analizando la imagen. Intenta con una foto más clara.');
    } finally {
      setCargando(false);
      // Reset input para permitir volver a seleccionar el mismo archivo
      e.target.value = '';
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleArchivo}
      />
      <button
        type="button"
        disabled={cargando}
        onClick={() => inputRef.current?.click()}
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
      {error && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 8, padding: '8px 12px', background: '#FFEBEE', borderRadius: 8, border: '1px solid #FFCDD2' }}>
          <AlertCircle size={14} color="#C62828" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12, color: '#C62828', lineHeight: 1.5 }}>{error}</span>
        </div>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
