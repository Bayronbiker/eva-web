import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, User, FileText, Hash, Tag, Printer } from 'lucide-react';
import { imprimirDocumento } from '../utils/ImprimirDocumento';

const primaryGreen = '#2E7D32';
const darkGreen = '#1B5E20';
const lightGreen = '#E8F5E9';
const midGreen = '#4CAF50';

const CrearFactura = ({ facturaAEditar, onBack, onSave, onDelete, listaDeClientes = [], onNuevoCliente }) => {
  const isEditMode = !!facturaAEditar;

  const [cliente, setCliente] = useState('');
  const [vendedor, setVendedor] = useState('');
  const [formaDePago, setFormaDePago] = useState('Contado');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [costoPorUnidad, setCostoPorUnidad] = useState('');
  const [descuentoPorcentual, setDescuentoPorcentual] = useState('');
  const [ivaPorcentual, setIvaPorcentual] = useState('19');

  useEffect(() => {
    if (!facturaAEditar) {
      setCliente(''); setVendedor(''); setFormaDePago('Contado');
      setDescripcion(''); setCantidad('1'); setCostoPorUnidad('');
      setDescuentoPorcentual(''); setIvaPorcentual('19');
      return;
    }
    const item = facturaAEditar.items?.[0] || {};
    const sub = facturaAEditar.subtotal || 0;
    const ivaAmt = facturaAEditar.iva || 0;
    const ivaPct = sub > 0 ? Math.round((ivaAmt / sub) * 1000) / 10 : 19;
    setCliente(facturaAEditar.clienteNombre || '');
    setVendedor(''); setFormaDePago('Contado');
    setDescripcion(item.descripcion || '');
    setCantidad(String(item.cantidad ?? 1));
    setCostoPorUnidad(item.precioUnitario != null ? String(item.precioUnitario) : '');
    setDescuentoPorcentual('');
    setIvaPorcentual(String(ivaPct));
  }, [facturaAEditar]);

  const calculos = useMemo(() => {
    const costo = parseFloat(costoPorUnidad) || 0;
    const cant = parseFloat(cantidad) || 0;
    const descPorc = parseFloat(descuentoPorcentual) || 0;
    const ivaPorc = parseFloat(ivaPorcentual) || 0;
    const totalBruto = costo * cant;
    const valorDescuento = totalBruto * (descPorc / 100);
    const subtotal = totalBruto - valorDescuento;
    const valorIva = subtotal * (ivaPorc / 100);
    const valorNeto = subtotal + valorIva;
    return { totalBruto, valorDescuento, subtotal, valorIva, valorNeto, descPorc, ivaPorc };
  }, [costoPorUnidad, cantidad, descuentoPorcentual, ivaPorcentual]);

  const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

  const buildPayload = () => ({
    ...calculos, cliente, vendedor, formaDePago, descripcion,
    _id: facturaAEditar?._id, numero: facturaAEditar?.numero,
  });

  const handleImprimir = () => {
    const datosDoc = {
      numero: facturaAEditar?.numero || 'FAC-BORRADOR',
      clienteNombre: cliente,
      clienteId: facturaAEditar?.clienteId,
      subtotal: calculos.subtotal,
      iva: calculos.ivaPorc,
      total: calculos.valorNeto,
      items: [{ descripcion: descripcion || 'Servicio / Producto', cantidad: parseFloat(cantidad) || 1, precioUnitario: parseFloat(costoPorUnidad) || 0, total: calculos.totalBruto }],
    };
    const empresa = JSON.parse(localStorage.getItem('empresaConfig') || '{}');
    imprimirDocumento('factura', datosDoc, empresa);
  };

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e0e0e0', fontSize: '15px', fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', color: '#757575', marginBottom: '6px', display: 'block' };
  const sectionStyle = { background: '#fff', borderRadius: '16px', border: '1.5px solid #f0f0f0', marginBottom: '16px', overflow: 'hidden' };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <button type="button" onClick={onBack}
          style={{ width: '44px', height: '44px', borderRadius: '12px', border: '1.5px solid #e0e0e0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={20} color="#424242" />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isEditMode ? '#FF9800' : primaryGreen }} />
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1a1a1a' }}>
              {isEditMode ? 'Editar factura' : 'Nueva factura'}
            </h1>
          </div>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#9e9e9e' }}>Gestion de documentos tributarios</p>
        </div>
        {isEditMode && (
          <button type="button" onClick={handleImprimir}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 16px', borderRadius: '12px', border: '1.5px solid #e0e0e0', background: '#fff', color: '#424242', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
            <Printer size={16} /> Imprimir
          </button>
        )}
        {isEditMode && facturaAEditar?.numero && (
          <div style={{ background: lightGreen, color: darkGreen, padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
            {facturaAEditar.numero}
          </div>
        )}
      </div>

      <div style={sectionStyle}>
        <div style={{ background: primaryGreen, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={16} color="rgba(255,255,255,0.8)" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Partes del documento</span>
        </div>
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Vendedor</label>
            <input type="text" placeholder="Nombre del responsable" value={vendedor} onChange={e => setVendedor(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Cliente</label>
            <select value={cliente} onChange={e => e.target.value === 'nuevo' ? onNuevoCliente?.() : setCliente(e.target.value)}
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
              <option value="">Seleccionar cliente...</option>
              <option value="nuevo" style={{ color: primaryGreen, fontWeight: '700' }}>+ Crear nuevo cliente</option>
              {listaDeClientes.map((c, i) => <option key={i} value={c.nombre}>{c.nombre}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ ...sectionStyle, padding: '20px 24px' }}>
        <label style={labelStyle}>Forma de pago</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['Contado', 'Credito'].map(op => (
            <button key={op} type="button" onClick={() => setFormaDePago(op)}
              style={{ padding: '10px 24px', borderRadius: '10px', border: '1.5px solid', borderColor: formaDePago === op ? primaryGreen : '#e0e0e0', background: formaDePago === op ? lightGreen : '#fff', color: formaDePago === op ? darkGreen : '#757575', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
              {op}
            </button>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={{ background: '#F5F5F5', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} color="#757575" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#757575', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Detalle del servicio / producto</span>
        </div>
        <div style={{ padding: '24px' }}>
          <textarea rows="3" placeholder="Describe el producto o servicio..." value={descripcion} onChange={e => setDescripcion(e.target.value)}
            style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }} />
        </div>
      </div>

      <div style={{ ...sectionStyle, padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>Cantidad</label>
          <input type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} style={{ ...inputStyle, fontSize: '18px', fontWeight: '700' }} />
        </div>
        <div>
          <label style={labelStyle}>Costo unitario</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9e9e9e', fontSize: '15px', fontWeight: '700' }}>$</span>
            <input type="number" value={costoPorUnidad} onChange={e => setCostoPorUnidad(e.target.value)} style={{ ...inputStyle, paddingLeft: '32px', fontSize: '18px', fontWeight: '700' }} />
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={{ background: primaryGreen, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tag size={16} color="rgba(255,255,255,0.8)" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Ajustes fiscales</span>
        </div>
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Descuento (%)</label>
            <div style={{ position: 'relative' }}>
              <input type="number" placeholder="0" value={descuentoPorcentual} onChange={e => setDescuentoPorcentual(e.target.value)} style={{ ...inputStyle, paddingRight: '44px' }} />
              <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9e9e9e', fontWeight: '700' }}>%</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>IVA (%)</label>
            <div style={{ position: 'relative' }}>
              <input type="number" value={ivaPorcentual} onChange={e => setIvaPorcentual(e.target.value)} style={{ ...inputStyle, paddingRight: '44px' }} />
              <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9e9e9e', fontWeight: '700' }}>%</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#1a1a1a', borderRadius: '20px', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Resumen</span>
        </div>
        {[
          { label: 'Total bruto', value: fmt(calculos.totalBruto), color: 'rgba(255,255,255,0.7)' },
          { label: 'Descuento (' + calculos.descPorc + '%)', value: '-' + fmt(calculos.valorDescuento), color: '#ef9a9a' },
          { label: 'Subtotal', value: fmt(calculos.subtotal), color: 'rgba(255,255,255,0.7)' },
          { label: 'IVA (' + calculos.ivaPorc + '%)', value: fmt(calculos.valorIva), color: 'rgba(255,255,255,0.7)' },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}>{row.label}</span>
            <span style={{ fontSize: '15px', fontWeight: '600', color: row.color }}>{row.value}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Valor neto</span>
          <span style={{ fontSize: '28px', fontWeight: '900', color: midGreen }}>{fmt(calculos.valorNeto)}</span>
        </div>
      </div>

      {isEditMode ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <button type="button" onClick={() => onSave?.(buildPayload())}
            style={{ padding: '16px', borderRadius: '14px', border: 'none', background: primaryGreen, color: '#fff', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit' }}>
            <Save size={20} /> Guardar cambios
          </button>
          <button type="button" onClick={() => facturaAEditar?._id && onDelete?.(facturaAEditar._id)}
            style={{ padding: '16px', borderRadius: '14px', border: '1.5px solid #ef5350', background: '#fff', color: '#ef5350', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit' }}>
            <Trash2 size={20} /> Eliminar
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => onSave?.(buildPayload())}
          style={{ width: '100%', padding: '18px', borderRadius: '14px', border: 'none', background: primaryGreen, color: '#fff', fontWeight: '800', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontFamily: 'inherit' }}>
          <Save size={22} /> Crear factura
        </button>
      )}

      {!isEditMode && (
        <button type="button" onClick={handleImprimir}
          style={{ width: '100%', marginTop: '10px', padding: '14px', borderRadius: '14px', border: '1.5px solid #e0e0e0', background: '#fff', color: '#424242', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit' }}>
          <Printer size={18} /> Imprimir / Guardar PDF
        </button>
      )}
    </div>
  );
};

export default CrearFactura;