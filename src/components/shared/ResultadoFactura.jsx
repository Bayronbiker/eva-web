import React, { useState } from 'react';
import axios from 'axios';
import {
  Package, Truck, CheckCircle, Circle, ChevronDown, ChevronUp,
  DollarSign, Hash, MapPin, Phone, Mail, Calendar, X, Loader2
} from 'lucide-react';
import config from '../../config';

const BASE_URL = config.API_URL;
const axiosAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const G  = '#2E7D32';
const GL = '#E8F5E9';
const AZ = '#1565C0';
const AZL= '#E3F2FD';

const fmtCOP = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(n) || 0);

const Field = ({ icon: Icon, label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0' }}>
      <Icon size={14} color="#9e9e9e" style={{ flexShrink: 0, marginTop: 2 }} />
      <div>
        <span style={{ fontSize: 11, color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>{label}: </span>
        <span style={{ fontSize: 13, color: '#1a1a1a' }}>{value}</span>
      </div>
    </div>
  );
};

/**
 * Panel que muestra el resultado del análisis IA de una factura.
 * Permite al usuario confirmar qué agregar:
 *   - Productos al inventario
 *   - Proveedor (crear o actualizar) + cuenta por pagar
 *
 * Props:
 *   resultado        → datos extraídos por la IA { proveedor, productos, totalFactura, fechaFactura, ... }
 *   proveedores      → lista actual de proveedores para detectar duplicados
 *   onConfirmar(res) → callback cuando se confirma la operación
 *   onCerrar()       → callback para cerrar/descartar
 */
export default function ResultadoFactura({ resultado, proveedores = [], onConfirmar, onCerrar }) {
  const { proveedor, productos = [], totalFactura, fechaFactura, numeroFactura } = resultado;

  // ── Selección de productos
  const [selProductos, setSelProductos] = useState(
    productos.map((_, i) => i) // todos seleccionados por defecto
  );
  const [editProductos, setEditProductos] = useState(
    productos.map(p => ({
      nombre: p.nombre || '',
      cantidad: p.cantidad || 1,
      precioCompra: p.precioUnitario || 0,
      precioVenta: Math.ceil((p.precioUnitario || 0) * 1.3), // sugerencia: 30% margen
    }))
  );

  // ── Proveedor
  const [agregarProveedor, setAgregarProveedor] = useState(!!proveedor?.nombre);
  const [agregarCuentaPagar, setAgregarCuentaPagar] = useState(!!totalFactura);
  const [proveedorAbierto, setProveedorAbierto] = useState(true);
  const [editProveedor, setEditProveedor] = useState({
    nombre:             proveedor?.nombre             || '',
    nit:                proveedor?.nit                || '',
    ciudad:             proveedor?.ciudad             || '',
    telefono:           proveedor?.telefono           || '',
    email:              proveedor?.email              || '',
    direccion:          proveedor?.direccion          || '',
    actividadEconomica: proveedor?.actividadEconomica || '',
  });

  // Detectar si ya existe un proveedor con el mismo nombre o NIT
  const provExistente = proveedores.find(p =>
    (editProveedor.nombre && p.nombre?.toLowerCase() === editProveedor.nombre?.toLowerCase()) ||
    (editProveedor.nit && p.nit && p.nit === editProveedor.nit)
  );

  const [guardando, setGuardando] = useState(false);
  const [guardado,  setGuardado]  = useState(false);

  const toggleProducto = (i) => {
    setSelProductos(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  const updateProducto = (i, field, value) => {
    setEditProductos(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  };

  const handleConfirmar = async () => {
    setGuardando(true);
    try {
      const cfg = axiosAuth();
      const resultados = { inventarioAgregados: [], proveedorId: null, cuentaAgregada: false };

      // 1. Agregar productos seleccionados al inventario
      for (const i of selProductos) {
        const p = editProductos[i];
        if (!p.nombre?.trim()) continue;
        const { data } = await axios.post(`${BASE_URL}/inventario`, {
          nombre:      p.nombre,
          cantidad:    Number(p.cantidad) || 1,
          precioCompra:Number(p.precioCompra) || 0,
          precioVenta: Number(p.precioVenta)  || 0,
          categoria:   'Otros',
        }, cfg);
        resultados.inventarioAgregados.push(data);
      }

      // 2. Crear o actualizar proveedor
      if (agregarProveedor && editProveedor.nombre?.trim()) {
        if (provExistente) {
          // Actualizar proveedor existente si hay datos nuevos
          await axios.put(`${BASE_URL}/proveedores/${provExistente._id}`, editProveedor, cfg);
          resultados.proveedorId = provExistente._id;
        } else {
          const { data: prov } = await axios.post(`${BASE_URL}/proveedores`, editProveedor, cfg);
          resultados.proveedorId = prov._id;
        }

        // 3. Agregar cuenta por pagar
        if (agregarCuentaPagar && totalFactura > 0 && resultados.proveedorId) {
          await axios.post(`${BASE_URL}/proveedores/${resultados.proveedorId}/cuentas-pagar`, {
            descripcion: numeroFactura ? `Factura ${numeroFactura}` : 'Factura escaneada',
            montoTotal:  totalFactura,
            fecha:       fechaFactura || new Date().toISOString().slice(0, 10),
          }, cfg);
          resultados.cuentaAgregada = true;
        }
      }

      setGuardado(true);
      setTimeout(() => onConfirmar(resultados), 800);
    } catch (err) {
      alert('Error guardando: ' + (err.response?.data?.message || err.message));
    } finally {
      setGuardando(false);
    }
  };

  const inputSt = {
    width: '100%', padding: '8px 10px', borderRadius: 8,
    border: '1.5px solid #e0e0e0', fontSize: 13,
    fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      overflowY: 'auto', padding: '24px 16px',
    }}>
      <div style={{
        background: '#F8FAFB', borderRadius: 20, width: '100%', maxWidth: 680,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        {/* Header */}
        <div style={{ background: AZ, borderRadius: '20px 20px 0 0', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>✨ Factura analizada por IA</h2>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
              Revisa y confirma los datos antes de guardar
            </p>
          </div>
          <button onClick={onCerrar} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Resumen de la factura */}
          {(totalFactura > 0 || fechaFactura || numeroFactura) && (
            <div style={{ background: AZL, borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {numeroFactura && <div><span style={{ fontSize: 11, color: AZ, fontWeight: 700 }}>FACTURA #</span><p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1a1a1a' }}>{numeroFactura}</p></div>}
              {fechaFactura  && <div><span style={{ fontSize: 11, color: AZ, fontWeight: 700 }}>FECHA</span><p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1a1a1a' }}>{fechaFactura}</p></div>}
              {totalFactura > 0 && <div><span style={{ fontSize: 11, color: AZ, fontWeight: 700 }}>TOTAL</span><p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: AZ }}>{fmtCOP(totalFactura)}</p></div>}
            </div>
          )}

          {/* ── Productos ── */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #f0f0f0', overflow: 'hidden' }}>
            <div style={{ background: G, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Package size={15} color="rgba(255,255,255,0.85)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: 0.7, textTransform: 'uppercase' }}>
                Productos detectados ({selProductos.length}/{productos.length} seleccionados → irán al inventario)
              </span>
            </div>
            {productos.length === 0 ? (
              <p style={{ padding: '16px 18px', margin: 0, color: '#9e9e9e', fontSize: 13 }}>No se detectaron productos en esta factura.</p>
            ) : (
              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {editProductos.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 10, background: selProductos.includes(i) ? GL : '#F5F5F5', border: `1.5px solid ${selProductos.includes(i) ? G : '#e0e0e0'}`, cursor: 'pointer' }} onClick={() => toggleProducto(i)}>
                    <div style={{ marginTop: 2, flexShrink: 0 }}>
                      {selProductos.includes(i)
                        ? <CheckCircle size={18} color={G} />
                        : <Circle size={18} color="#bdbdbd" />
                      }
                    </div>
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8 }} onClick={e => e.stopPropagation()}>
                      <div>
                        <label style={{ fontSize: 10, color: '#9e9e9e', fontWeight: 700, textTransform: 'uppercase' }}>Nombre</label>
                        <input value={p.nombre} onChange={e => updateProducto(i, 'nombre', e.target.value)} style={inputSt} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, color: '#9e9e9e', fontWeight: 700, textTransform: 'uppercase' }}>Cantidad</label>
                        <input type="number" value={p.cantidad} onChange={e => updateProducto(i, 'cantidad', e.target.value)} style={inputSt} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, color: '#9e9e9e', fontWeight: 700, textTransform: 'uppercase' }}>Precio compra</label>
                        <input type="number" value={p.precioCompra} onChange={e => updateProducto(i, 'precioCompra', e.target.value)} style={inputSt} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, color: '#9e9e9e', fontWeight: 700, textTransform: 'uppercase' }}>Precio venta</label>
                        <input type="number" value={p.precioVenta} onChange={e => updateProducto(i, 'precioVenta', e.target.value)} style={inputSt} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Proveedor ── */}
          {proveedor?.nombre && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #f0f0f0', overflow: 'hidden' }}>
              <div
                style={{ background: '#F5F5F5', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => setProveedorAbierto(v => !v)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Truck size={15} color="#757575" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#757575', letterSpacing: 0.7, textTransform: 'uppercase' }}>
                    Proveedor detectado
                  </span>
                  {provExistente && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: '#FFF9C4', color: '#F57F17' }}>
                      YA EXISTE — se actualizará
                    </span>
                  )}
                </div>
                {proveedorAbierto ? <ChevronUp size={16} color="#9e9e9e" /> : <ChevronDown size={16} color="#9e9e9e" />}
              </div>

              {proveedorAbierto && (
                <div style={{ padding: '14px 18px' }}>
                  {/* Toggle agregar proveedor */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, padding: '10px 14px', background: agregarProveedor ? GL : '#F5F5F5', borderRadius: 10, cursor: 'pointer' }}
                    onClick={() => setAgregarProveedor(v => !v)}>
                    {agregarProveedor ? <CheckCircle size={18} color={G} /> : <Circle size={18} color="#bdbdbd" />}
                    <span style={{ fontSize: 13, fontWeight: 700, color: agregarProveedor ? G : '#9e9e9e' }}>
                      {provExistente ? 'Actualizar datos del proveedor existente' : 'Crear este proveedor en mi lista'}
                    </span>
                  </div>

                  {/* Campos editables del proveedor */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { key: 'nombre', label: 'Nombre' },
                      { key: 'nit', label: 'NIT' },
                      { key: 'ciudad', label: 'Ciudad' },
                      { key: 'actividadEconomica', label: 'Actividad económica' },
                      { key: 'telefono', label: 'Teléfono' },
                      { key: 'email', label: 'Email' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label style={{ fontSize: 10, color: '#9e9e9e', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>{label}</label>
                        <input value={editProveedor[key] || ''} onChange={e => setEditProveedor(p => ({ ...p, [key]: e.target.value }))} style={inputSt} />
                      </div>
                    ))}
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{ fontSize: 10, color: '#9e9e9e', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Dirección</label>
                      <input value={editProveedor.direccion || ''} onChange={e => setEditProveedor(p => ({ ...p, direccion: e.target.value }))} style={inputSt} />
                    </div>
                  </div>

                  {/* Cuenta por pagar */}
                  {totalFactura > 0 && (
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: agregarCuentaPagar ? '#FFF3E0' : '#F5F5F5', borderRadius: 10, cursor: 'pointer', border: `1.5px solid ${agregarCuentaPagar ? '#FF9800' : 'transparent'}` }}
                      onClick={() => setAgregarCuentaPagar(v => !v)}>
                      {agregarCuentaPagar ? <CheckCircle size={18} color="#E65100" /> : <Circle size={18} color="#bdbdbd" />}
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: agregarCuentaPagar ? '#E65100' : '#9e9e9e' }}>
                          Registrar como cuenta por pagar
                        </span>
                        <p style={{ margin: 0, fontSize: 12, color: '#9e9e9e' }}>Total: {fmtCOP(totalFactura)}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Botones */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={onCerrar} style={{ flex: 1, padding: '13px', borderRadius: 12, border: '1.5px solid #e0e0e0', background: '#fff', color: '#9e9e9e', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              disabled={guardando || guardado || (selProductos.length === 0 && !agregarProveedor)}
              style={{
                flex: 2, padding: '13px', borderRadius: 12, border: 'none',
                background: guardado ? G : AZ,
                color: '#fff', fontWeight: 800, fontSize: 14,
                cursor: (guardando || guardado) ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: (selProductos.length === 0 && !agregarProveedor) ? 0.5 : 1,
              }}
            >
              {guardando ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Guardando...</>
               : guardado ? <><CheckCircle size={16} /> ¡Guardado!</>
               : '✓ Confirmar y guardar'}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
