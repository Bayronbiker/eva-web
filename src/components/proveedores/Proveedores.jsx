import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Truck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import config from '../../config';

const PALETA_CLARA = {
  bg: '#F8FAFB', card: '#FFFFFF', texto: '#1a1a1a', textoMuted: '#9e9e9e',
  borde: '#f0f0f0', bordeInput: '#e0e0e0', verde: '#2E7D32', verdeHover: '#1B5E20',
  verdeBg: '#E8F5E9', rojo: '#ef5350', rojoBg: '#FFEBEE', hover: '#F5F5F5',
};
const PALETA_OSCURA = {
  bg: '#0D1117', card: '#161B22', texto: '#E6EDF3', textoMuted: '#7D8590',
  borde: '#30363D', bordeInput: '#30363D', verde: '#3FB950', verdeHover: '#2EA043',
  verdeBg: '#0D2818', rojo: '#F85149', rojoBg: '#3D1A1A', hover: '#262C36',
};

const inputStyle = (p) => ({
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: `1px solid ${p.bordeInput}`, background: p.bg,
  color: p.texto, fontSize: 14, outline: 'none', boxSizing: 'border-box',
});

const BASE_URL = config.apiUrl;
const axiosAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function Proveedores({ onBack }) {
  const { theme } = useTheme();
  const p = theme === 'dark' ? PALETA_OSCURA : PALETA_CLARA;

  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null); // proveedor en edición o null
  const [form, setForm] = useState({ nombre: '', nit: '', telefono: '', email: '', direccion: '', notas: '' });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const cargar = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/proveedores`, axiosAuth());
      setProveedores(data);
    } catch {
      setError('Error cargando proveedores');
    } finally { setLoading(false); }
  };

  useEffect(() => { cargar(); }, []);

  const abrirNuevo = () => {
    setEditando(null);
    setForm({ nombre: '', nit: '', telefono: '', email: '', direccion: '', notas: '' });
    setMostrarForm(true);
    setError('');
  };

  const abrirEdicion = (prov) => {
    setEditando(prov);
    setForm({ nombre: prov.nombre, nit: prov.nit || '', telefono: prov.telefono || '', email: prov.email || '', direccion: prov.direccion || '', notas: prov.notas || '' });
    setMostrarForm(true);
    setError('');
  };

  const cancelar = () => { setMostrarForm(false); setEditando(null); setError(''); };

  const guardar = async () => {
    if (!form.nombre.trim()) { setError('El nombre es requerido'); return; }
    setGuardando(true);
    setError('');
    try {
      if (editando) {
        await axios.put(`${BASE_URL}/proveedores/${editando._id}`, form, axiosAuth());
      } else {
        await axios.post(`${BASE_URL}/proveedores`, form, axiosAuth());
      }
      await cargar();
      cancelar();
    } catch (e) {
      setError(e.response?.data?.message || 'Error guardando proveedor');
    } finally { setGuardando(false); }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este proveedor?')) return;
    try {
      await axios.delete(`${BASE_URL}/proveedores/${id}`, axiosAuth());
      await cargar();
    } catch { alert('Error eliminando proveedor'); }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 0 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        {onBack && (
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: p.textoMuted, display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={20} />
          </button>
        )}
        <Truck size={22} color={p.verde} />
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: p.texto }}>Proveedores</h2>
        <div style={{ flex: 1 }} />
        <button
          onClick={abrirNuevo}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: p.verde, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
        >
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <div style={{ background: p.card, borderRadius: 12, border: `1px solid ${p.borde}`, padding: 20, marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: p.texto }}>
            {editando ? 'Editar proveedor' : 'Nuevo proveedor'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { key: 'nombre', label: 'Nombre *', placeholder: 'Nombre del proveedor' },
              { key: 'nit', label: 'NIT', placeholder: 'NIT o cédula' },
              { key: 'telefono', label: 'Teléfono', placeholder: '+57 300 000 0000' },
              { key: 'email', label: 'Email', placeholder: 'correo@proveedor.com' },
              { key: 'direccion', label: 'Dirección', placeholder: 'Dirección' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: p.textoMuted, marginBottom: 4, display: 'block' }}>{label}</label>
                <input
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={inputStyle(p)}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, color: p.textoMuted, marginBottom: 4, display: 'block' }}>Notas</label>
              <input value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} placeholder="Notas adicionales" style={inputStyle(p)} />
            </div>
          </div>
          {error && <p style={{ color: p.rojo, fontSize: 13, margin: '10px 0 0' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
            <button onClick={cancelar} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'none', border: `1px solid ${p.borde}`, borderRadius: 8, cursor: 'pointer', color: p.textoMuted, fontSize: 14 }}>
              <X size={14} /> Cancelar
            </button>
            <button onClick={guardar} disabled={guardando} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: p.verde, color: '#fff', border: 'none', borderRadius: 8, cursor: guardando ? 'not-allowed' : 'pointer', opacity: guardando ? 0.7 : 1, fontSize: 14, fontWeight: 600 }}>
              <Save size={14} /> {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <p style={{ textAlign: 'center', color: p.textoMuted, marginTop: 40 }}>Cargando...</p>
      ) : proveedores.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: p.textoMuted }}>
          <Truck size={40} color={p.borde} style={{ marginBottom: 12 }} />
          <p style={{ margin: 0, fontSize: 15 }}>Aún no tienes proveedores registrados.</p>
          <p style={{ margin: '6px 0 0', fontSize: 13 }}>Haz clic en "Nuevo" para agregar uno.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {proveedores.map(prov => (
            <div key={prov._id} style={{ background: p.card, borderRadius: 10, border: `1px solid ${p.borde}`, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: p.texto }}>{prov.nombre}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: p.textoMuted }}>
                  {[prov.nit && `NIT: ${prov.nit}`, prov.telefono, prov.email].filter(Boolean).join(' · ')}
                </p>
              </div>
              <button onClick={() => abrirEdicion(prov)} style={{ background: 'none', border: `1px solid ${p.borde}`, borderRadius: 6, padding: '6px 10px', cursor: 'pointer', color: p.textoMuted, display: 'flex', alignItems: 'center' }}>
                <Edit2 size={15} />
              </button>
              <button onClick={() => eliminar(prov._id)} style={{ background: 'none', border: `1px solid ${p.rojoBg}`, borderRadius: 6, padding: '6px 10px', cursor: 'pointer', color: p.rojo, display: 'flex', alignItems: 'center' }}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
