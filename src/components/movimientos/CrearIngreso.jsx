import React, { useState } from 'react';
import { ArrowLeft, Save, Calendar, CreditCard, Smartphone, Banknote, ArrowLeftRight, MoreHorizontal, Building, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const CATEGORIAS_INGRESO = ['Venta de productos', 'Prestacion de servicios', 'Factura cobrada', 'Anticipo', 'Comision', 'Devolucion', 'Otros'];
const CLIENTES_TIPO      = ['Cliente empresa', 'Cliente persona natural', 'Pago en efectivo', 'Otro'];
const METODOS_PAGO       = [
  { id: 'efectivo',      label: 'Efectivo',      icon: Banknote       },
  { id: 'tarjeta',       label: 'Tarjeta',        icon: CreditCard     },
  { id: 'transferencia', label: 'Transferencia',  icon: ArrowLeftRight },
  { id: 'nequi',         label: 'Nequi',          icon: Smartphone     },
  { id: 'daviplata',     label: 'Daviplata',      icon: Building       },
  { id: 'otro',          label: 'Otro',           icon: MoreHorizontal },
];

const inputStyle   = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e0e0e0', fontSize: '15px', fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' };
const labelStyle   = { fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', color: '#757575', marginBottom: '6px', display: 'block' };
const sectionStyle = { background: '#fff', borderRadius: '16px', border: '1.5px solid #f0f0f0', marginBottom: '14px', overflow: 'hidden' };

const G  = '#2E7D32';
const GL = '#E8F5E9';

const CrearIngreso = ({ onBack, onSave }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tituloColor    = isDark ? '#E6EDF3' : '#1a1a1a';
  const subtituloColor = isDark ? '#9CA3AF' : '#9e9e9e';
  const hoy = new Date().toISOString().split('T')[0];
  const [fecha,       setFecha]       = useState(hoy);
  const [categoria,   setCategoria]   = useState('');
  const [valor,       setValor]       = useState('');
  const [cliente,     setCliente]     = useState('');
  const [metodoPago,  setMetodoPago]  = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [guardando,   setGuardando]   = useState(false); // ← FIX: estado de carga

  const isValido = fecha && categoria && valor && metodoPago;

  /* ── FIX: función async + await onSave + estado guardando ─────────────── */
  const handleGuardar = async () => {
    if (!isValido || guardando) return;
    setGuardando(true);
    try {
      await onSave({ fecha, categoria, monto: Number(valor), proveedor: cliente, metodoPago, descripcion, tipo: 'ingreso' });
    } catch {
      // el padre (Home.jsx) ya maneja el error con alert
    } finally {
      setGuardando(false);
    }
  };

  const btnActivo = isValido && !guardando;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <button type="button" onClick={onBack}
          style={{ width: '42px', height: '42px', borderRadius: '12px', border: '1.5px solid #e0e0e0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={18} color="#424242" />
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: G }} />
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: tituloColor }}>Nuevo ingreso</h1>
          </div>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: subtituloColor }}>Registra una entrada de dinero</p>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={{ background: G, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={15} color="rgba(255,255,255,0.85)" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Informacion basica</span>
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Fecha *</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Categoria *</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
              <option value="">Seleccionar...</option>
              {CATEGORIAS_INGRESO.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Valor *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9e9e9e', fontWeight: '700' }}>$</span>
              <input type="number" placeholder="0" value={valor} onChange={e => setValor(e.target.value)} style={{ ...inputStyle, paddingLeft: '28px', fontSize: '17px', fontWeight: '700' }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Cliente / Fuente</label>
            <select value={cliente} onChange={e => setCliente(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
              <option value="">Seleccionar...</option>
              {CLIENTES_TIPO.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={{ background: '#F5F5F5', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CreditCard size={15} color="#757575" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#757575', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Metodo de pago *</span>
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {METODOS_PAGO.map(m => (
            <button key={m.id} type="button" onClick={() => setMetodoPago(m.id)}
              style={{ padding: '14px 10px', borderRadius: '14px', border: '1.5px solid', borderColor: metodoPago === m.id ? G : '#e0e0e0', background: metodoPago === m.id ? GL : '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              <m.icon size={22} color={metodoPago === m.id ? G : '#9e9e9e'} />
              <span style={{ fontSize: '11px', fontWeight: '700', color: metodoPago === m.id ? G : '#757575' }}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...sectionStyle, padding: '20px' }}>
        <label style={labelStyle}>Descripcion</label>
        <textarea rows="3" placeholder="Notas adicionales sobre este ingreso..." value={descripcion} onChange={e => setDescripcion(e.target.value)}
          style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }} />
      </div>

      {/* ── FIX: botón deshabilitado mientras guarda ─────────────────────── */}
      <button type="button" onClick={handleGuardar} disabled={!btnActivo}
        style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: btnActivo ? G : '#e0e0e0', color: '#fff', fontWeight: '800', fontSize: '15px', cursor: btnActivo ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit', transition: 'background 0.2s' }}>
        {guardando
          ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Guardando...</>
          : <><Save size={20} /> Registrar ingreso</>
        }
      </button>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
};

export default CrearIngreso;
