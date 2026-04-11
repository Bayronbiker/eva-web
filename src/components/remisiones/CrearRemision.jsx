import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, User, FileText, Hash, Truck } from 'lucide-react';

const primaryGreen = '#2E7D32';
const darkGreen = '#1B5E20';
const lightGreen = '#E8F5E9';
const midGreen = '#4CAF50';

const CrearRemision = ({ remisionAEditar, onBack, onSave, onDelete, listaDeClientes = [], onNuevoCliente }) => {
  const isEditMode = !!remisionAEditar;

  const [cliente, setCliente] = useState('');
  const [numeroRemision, setNumeroRemision] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [descripcion, setDescripcion] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [nombreVendedor, setNombreVendedor] = useState('');
  const [cedulaVendedor, setCedulaVendedor] = useState('');

  useEffect(() => {
    if (!remisionAEditar) {
      setCliente(''); setNumeroRemision(''); setCantidad('1');
      setDescripcion(''); setValorUnitario(''); setNombreVendedor(''); setCedulaVendedor('');
      return;
    }
    const item = remisionAEditar.items?.[0] || {};
    setCliente(remisionAEditar.clienteNombre || '');
    setNumeroRemision(remisionAEditar.numero || '');
    setCantidad(String(item.cantidad ?? 1));
    setDescripcion(item.descripcion || '');
    setValorUnitario(item.precioUnitario != null ? String(item.precioUnitario) : '');
    setNombreVendedor(''); setCedulaVendedor('');
  }, [remisionAEditar]);

  const valorTotal = useMemo(() => (parseFloat(cantidad) || 0) * (parseFloat(valorUnitario) || 0), [cantidad, valorUnitario]);

  const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

  const buildPayload = () => ({ cliente, numeroRemision, cantidad, descripcion, valorUnitario, valorTotal, nombreVendedor, cedulaVendedor, _id: remisionAEditar?._id, numero: remisionAEditar?.numero });

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1.5px solid #e0e0e0', fontSize: '15px', fontFamily: 'inherit',
    background: '#fff', outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px',
    textTransform: 'uppercase', color: '#757575', marginBottom: '6px', display: 'block',
  };

  const sectionStyle = {
    background: '#fff', borderRadius: '16px', border: '1.5px solid #f0f0f0', marginBottom: '16px', overflow: 'hidden',
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <button type="button" onClick={onBack}
          style={{ width: '44px', height: '44px', borderRadius: '12px', border: '1.5px solid #e0e0e0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={20} color="#424242" />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isEditMode ? '#FF9800' : primaryGreen }} />
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1a1a1a' }}>
              {isEditMode ? 'Editar remisión' : 'Nueva remisión'}
            </h1>
          </div>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#9e9e9e' }}>Documento de entrega de mercancía</p>
        </div>
        {isEditMode && remisionAEditar?.numero && (
          <div style={{ background: lightGreen, color: darkGreen, padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
            {remisionAEditar.numero}
          </div>
        )}
      </div>

      {/* Cliente + Número */}
      <div style={sectionStyle}>
        <div style={{ background: primaryGreen, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={16} color="rgba(255,255,255,0.8)" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Partes del documento</span>
        </div>
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Cliente</label>
            <select value={cliente}
              onChange={(e) => e.target.value === 'nuevo' ? onNuevoCliente?.() : setCliente(e.target.value)}
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
              <option value="">Seleccionar cliente...</option>
              <option value="nuevo" style={{ color: primaryGreen, fontWeight: '700' }}>+ Crear nuevo cliente</option>
              {listaDeClientes.map((c, i) => <option key={i} value={c.nombre}>{c.nombre}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Número de remisión</label>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="REM-001" value={numeroRemision}
                onChange={(e) => setNumeroRemision(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '44px' }} />
              <Hash size={16} color="#9e9e9e" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div style={sectionStyle}>
        <div style={{ background: '#F5F5F5', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} color="#757575" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#757575', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Detalle de la entrega</span>
        </div>
        <div style={{ padding: '24px' }}>
          <textarea rows="3" placeholder="Describe el producto o mercancía remitida..." value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }} />
        </div>
      </div>

      {/* Cantidad + Valor */}
      <div style={{ ...sectionStyle }}>
        <div style={{ background: primaryGreen, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Hash size={16} color="rgba(255,255,255,0.8)" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Cantidades y valores</span>
        </div>
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Cantidad</label>
            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)}
              style={{ ...inputStyle, fontSize: '18px', fontWeight: '700' }} />
          </div>
          <div>
            <label style={labelStyle}>Costo unitario</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9e9e9e', fontSize: '15px', fontWeight: '700' }}>$</span>
              <input type="number" value={valorUnitario} onChange={(e) => setValorUnitario(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '32px', fontSize: '18px', fontWeight: '700' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Vendedor */}
      <div style={{ ...sectionStyle, padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>Vendedor responsable</label>
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="Nombre completo" value={nombreVendedor}
              onChange={(e) => setNombreVendedor(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '44px' }} />
            <User size={16} color="#9e9e9e" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Cédula del vendedor</label>
          <input type="text" placeholder="Número de identificación" value={cedulaVendedor}
            onChange={(e) => setCedulaVendedor(e.target.value)} style={inputStyle} />
        </div>
      </div>

      {/* Total */}
      <div style={{ background: '#1a1a1a', borderRadius: '20px', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Valor total remisión</span>
          <span style={{ fontSize: '28px', fontWeight: '900', color: midGreen }}>{fmt(valorTotal)}</span>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '11px', color: '#bdbdbd', marginBottom: '20px', fontStyle: 'italic' }}>
        Este documento ampara la entrega física de mercancía.
      </p>

      {/* Botones */}
      {isEditMode ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button type="button" onClick={() => onSave?.(buildPayload())}
            style={{ padding: '16px', borderRadius: '14px', border: 'none', background: primaryGreen, color: '#fff', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit' }}>
            <Save size={20} /> Guardar cambios
          </button>
          <button type="button" onClick={() => remisionAEditar?._id && onDelete?.(remisionAEditar._id)}
            style={{ padding: '16px', borderRadius: '14px', border: '1.5px solid #ef5350', background: '#fff', color: '#ef5350', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit' }}>
            <Trash2 size={20} /> Eliminar
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => onSave?.(buildPayload())}
          style={{ width: '100%', padding: '18px', borderRadius: '14px', border: 'none', background: primaryGreen, color: '#fff', fontWeight: '800', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontFamily: 'inherit' }}>
          <Save size={22} /> Crear remisión
        </button>
      )}
    </div>
  );
};

export default CrearRemision;