import React, { useState } from 'react';
import axios from 'axios';
import {
  Package, Truck, CheckCircle, Circle, ChevronDown, ChevronUp,
  AlertTriangle, Info, X, Loader2, ShieldAlert, ShieldCheck
} from 'lucide-react';
import config from '../../config';

const BASE_URL = config.API_URL;
const axiosAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const G   = '#2E7D32';
const GL  = '#E8F5E9';
const AZ  = '#1565C0';
const AZL = '#E3F2FD';

const fmtCOP = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(n) || 0);

/* ── MEJORA #7: Normalización para comparar proveedores ─────────────────── */
const normTexto = (s) =>
  (s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')           // quitar tildes
    .replace(/\b(s\.?a\.?s\.?|s\.?a\.?|ltda\.?|e\.?u\.?|inc\.?|s\.?a\.?c\.?)\b/g, '') // quitar razón social
    .replace(/\s+/g, ' ').trim();

const normNIT = (n) =>
  String(n || '').replace(/[^0-9]/g, '').replace(/-\d$/, ''); // quitar dígito verificador

/* ── MEJORA #1: Cálculo de confianza del resultado ─────────────────────── */
const calcularConfianza = (proveedor, productos, totalFactura) => {
  const advertencias = [];
  if (!proveedor?.nombre?.trim())
    advertencias.push('No se detectó el nombre del proveedor');
  if (!totalFactura || totalFactura === 0)
    advertencias.push('No se detectó el total de la factura');
  if (!productos || productos.length === 0)
    advertencias.push('No se detectaron productos en la factura');
  else {
    if (productos.some(p => !p.nombre?.trim()))
      advertencias.push('Hay productos sin nombre — revisa manualmente');
    if (productos.some(p => !p.precioUnitario || p.precioUnitario === 0))
      advertencias.push('Hay productos con precio $0 — pueden requerir ajuste');
  }
  const nivel = advertencias.length === 0 ? 'alta' : advertencias.length <= 2 ? 'media' : 'baja';
  return { nivel, advertencias };
};

export default function ResultadoFactura({ resultado, proveedores = [], onConfirmar, onCerrar }) {
  const { proveedor, productos = [], totalFactura, fechaFactura, numeroFactura } = resultado;

  /* ── MEJORA #1: Confianza ───────────────────────────────────────────── */
  const confianza = calcularConfianza(proveedor, productos, totalFactura);
  const [ivaDescartado, setIvaDescartado] = useState(false);

  /* ── Productos ──────────────────────────────────────────────────────── */
  const [selProductos, setSelProductos] = useState(productos.map((_, i) => i));
  const [editProductos, setEditProductos] = useState(
    productos.map(p => ({
      nombre:       p.nombre          || '',
      cantidad:     p.cantidad        || 1,
      precioCompra: p.precioUnitario  || 0,
      precioVenta:  Math.ceil((p.precioUnitario || 0) * 1.3),
    }))
  );

  /* ── Proveedor ──────────────────────────────────────────────────────── */
  const [agregarProveedor,    setAgregarProveedor]    = useState(!!proveedor?.nombre);
  const [agregarCuentaPagar,  setAgregarCuentaPagar]  = useState(!!totalFactura);
  const [proveedorAbierto,    setProveedorAbierto]    = useState(true);
  const [editProveedor, setEditProveedor] = useState({
    nombre:             proveedor?.nombre             || '',
    nit:                proveedor?.nit                || '',
    ciudad:             proveedor?.ciudad             || '',
    telefono:           proveedor?.telefono           || '',
    email:              proveedor?.email              || '',
    direccion:          proveedor?.direccion          || '',
    actividadEconomica: proveedor?.actividadEconomica || '',
  });

  /* ── MEJORA #7: Detección de duplicados mejorada ────────────────────── */
  const provExistente = proveedores.find(p => {
    const nombreA = normTexto(p.nombre);
    const nombreB = normTexto(editProveedor.nombre);
    const nitA    = normNIT(p.nit);
    const nitB    = normNIT(editProveedor.nit);
    const nameMatch = nombreA && nombreB && (
      nombreA === nombreB ||
      nombreA.includes(nombreB) ||
      nombreB.includes(nombreA)
    );
    const nitMatch = nitA && nitB && nitA === nitB;
    return nameMatch || nitMatch;
  });

  const [guardando, setGuardando] = useState(false);
  const [guardado,  setGuardado]  = useState(false);

  const toggleProducto   = (i)            => setSelProductos(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  const updateProducto   = (i, field, v)  => setEditProductos(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: v } : p));

  /* ── Guardar ──────────────────────────────────────────────────────────── */
  const handleConfirmar = async () => {
    setGuardando(true);
    try {
      const cfg = axiosAuth();
      const res = { inventarioAgregados: [], proveedorId: null, cuentaAgregada: false };

      for (const i of selProductos) {
        const p = editProductos[i];
        if (!p.nombre?.trim()) continue;
        const { data } = await axios.post(`${BASE_URL}/inventario`, {
          nombre:       p.nombre,
          cantidad:     Number(p.cantidad)     || 1,
          precioCompra: Number(p.precioCompra) || 0,
          precioVenta:  Number(p.precioVenta)  || 0,
          categoria:    'Otros',
        }, cfg);
        res.inventarioAgregados.push(data);
      }

      if (agregarProveedor && editProveedor.nombre?.trim()) {
        if (provExistente) {
          await axios.put(`${BASE_URL}/proveedores/${provExistente._id}`, editProveedor, cfg);
          res.proveedorId = provExistente._id;
        } else {
          const { data: prov } = await axios.post(`${BASE_URL}/proveedores`, editProveedor, cfg);
          res.proveedorId = prov._id;
        }
        if (agregarCuentaPagar && totalFactura > 0 && res.proveedorId) {
          await axios.post(`${BASE_URL}/proveedores/${res.proveedorId}/cuentas-pagar`, {
            descripcion: numeroFactura ? `Factura ${numeroFactura}` : 'Factura escaneada',
            montoTotal:  totalFactura,
            fecha:       fechaFactura || new Date().toISOString().slice(0, 10),
          }, cfg);
          res.cuentaAgregada = true;
        }
      }

      setGuardado(true);
      setTimeout(() => onConfirmar(res), 800);
    } catch (err) {
      alert('Error guardando: ' + (err.response?.data?.message || err.message));
    } finally {
      setGuardando(false);
    }
  };

  const puedeConfirmar = !guardando && !guardado && (selProductos.length > 0 || agregarProveedor);

  const inputSt = {
    width: '100%', padding: '8px 10px', borderRadius: 8,
    border: '1.5px solid #e0e0e0', fontSize: 13,
    fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box',
  };

  /* ────────────────────────────────────────────────────────────────────── */
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '24px 16px' }}>
      <div style={{ background: '#F8FAFB', borderRadius: 20, width: '100%', maxWidth: 680, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* Header */}
        <div style={{ background: AZ, borderRadius: '20px 20px 0 0', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>✨ Factura analizada por IA</h2>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>Revisa y confirma los datos antes de guardar</p>
          </div>
          <button onClick={onCerrar} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* ── MEJORA #1: Indicador de confianza ────────────────────── */}
          {confianza.nivel !== 'alta' && (
            <div style={{
              borderRadius: 12, padding: '12px 16px',
              background: confianza.nivel === 'media' ? '#FFF8E1' : '#FFEBEE',
              border: `1.5px solid ${confianza.nivel === 'media' ? '#FFE082' : '#FFCDD2'}`,
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <ShieldAlert size={18} color={confianza.nivel === 'media' ? '#F57F17' : '#C62828'} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: confianza.nivel === 'media' ? '#E65100' : '#B71C1C' }}>
                  {confianza.nivel === 'media' ? '⚠️ Confianza media — revisa los datos' : '🔴 Confianza baja — varios datos no se detectaron'}
                </p>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {confianza.advertencias.map((w, i) => (
                    <li key={i} style={{ fontSize: 12, color: '#5D4037', lineHeight: 1.6 }}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {confianza.nivel === 'alta' && (
            <div style={{ borderRadius: 12, padding: '10px 14px', background: GL, border: '1.5px solid #A5D6A7', display: 'flex', gap: 8, alignItems: 'center' }}>
              <ShieldCheck size={16} color={G} />
              <span style={{ fontSize: 13, fontWeight: 700, color: G }}>✅ Confianza alta — todos los campos detectados correctamente</span>
            </div>
          )}

          {/* Resumen factura */}
          {(totalFactura > 0 || fechaFactura || numeroFactura) && (
            <div style={{ background: AZL, borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {numeroFactura && <div><span style={{ fontSize: 11, color: AZ, fontWeight: 700 }}>FACTURA #</span><p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1a1a1a' }}>{numeroFactura}</p></div>}
              {fechaFactura  && <div><span style={{ fontSize: 11, color: AZ, fontWeight: 700 }}>FECHA</span><p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1a1a1a' }}>{fechaFactura}</p></div>}
              {totalFactura > 0 && <div><span style={{ fontSize: 11, color: AZ, fontWeight: 700 }}>TOTAL</span><p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: AZ }}>{fmtCOP(totalFactura)}</p></div>}
            </div>
          )}

          {/* ── Productos ───────────────────────────────────────────────── */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #f0f0f0', overflow: 'hidden' }}>
            <div style={{ background: G, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Package size={15} color="rgba(255,255,255,0.85)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: 0.7, textTransform: 'uppercase' }}>
                Productos detectados ({selProductos.length}/{productos.length} seleccionados → irán al inventario)
              </span>
            </div>

            {/* ── MEJORA #3: Aviso IVA ──────────────────────────────────── */}
            {!ivaDescartado && productos.length > 0 && (
              <div style={{ margin: '10px 14px 0', padding: '9px 13px', background: '#FFF3E0', borderRadius: 10, border: '1px solid #FFE0B2', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Info size={14} color="#E65100" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 12, color: '#BF360C', lineHeight: 1.5, flex: 1 }}>
                  <strong>¿Los precios incluyen IVA?</strong> Si la factura tiene IVA (19%), el precio de compra real es el valor antes del impuesto. Ajusta los precios si es necesario.
                </span>
                <button type="button" onClick={() => setIvaDescartado(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E65100', flexShrink: 0, padding: 0 }}>
                  <X size={13} />
                </button>
              </div>
            )}

            {productos.length === 0 ? (
              <p style={{ padding: '16px 18px', margin: 0, color: '#9e9e9e', fontSize: 13 }}>No se detectaron productos en esta factura.</p>
            ) : (
              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {editProductos.map((p, i) => (
                  <div key={i}
                    style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 10, background: selProductos.includes(i) ? GL : '#F5F5F5', border: `1.5px solid ${selProductos.includes(i) ? G : '#e0e0e0'}`, cursor: 'pointer' }}
                    onClick={() => toggleProducto(i)}
                  >
                    <div style={{ marginTop: 2, flexShrink: 0 }}>
                      {selProductos.includes(i) ? <CheckCircle size={18} color={G} /> : <Circle size={18} color="#bdbdbd" />}
                    </div>
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8 }} onClick={e => e.stopPropagation()}>
                      {[
                        { key: 'nombre',       label: 'Nombre',        type: 'text'   },
                        { key: 'cantidad',     label: 'Cantidad',      type: 'number' },
                        { key: 'precioCompra', label: 'Precio compra', type: 'number' },
                        { key: 'precioVenta',  label: 'Precio venta',  type: 'number' },
                      ].map(({ key, label, type }) => (
                        <div key={key}>
                          <label style={{ fontSize: 10, color: '#9e9e9e', fontWeight: 700, textTransform: 'uppercase' }}>{label}</label>
                          <input type={type} value={p[key]} onChange={e => updateProducto(i, key, e.target.value)} style={inputSt} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Proveedor ───────────────────────────────────────────────── */}
          {proveedor?.nombre && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #f0f0f0', overflow: 'hidden' }}>
              <div style={{ background: '#F5F5F5', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setProveedorAbierto(v => !v)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Truck size={15} color="#757575" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#757575', letterSpacing: 0.7, textTransform: 'uppercase' }}>Proveedor detectado</span>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, padding: '10px 14px', background: agregarProveedor ? GL : '#F5F5F5', borderRadius: 10, cursor: 'pointer', border: `1.5px solid ${agregarProveedor ? G : 'transparent'}` }}
                    onClick={() => setAgregarProveedor(v => !v)}>
                    {agregarProveedor ? <CheckCircle size={18} color={G} /> : <Circle size={18} color="#bdbdbd" />}
                    <span style={{ fontSize: 13, fontWeight: 700, color: agregarProveedor ? G : '#9e9e9e' }}>
                      {provExistente ? 'Actualizar datos del proveedor existente' : 'Crear este proveedor en mi lista'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { key: 'nombre',             label: 'Nombre' },
                      { key: 'nit',                label: 'NIT' },
                      { key: 'ciudad',             label: 'Ciudad' },
                      { key: 'actividadEconomica', label: 'Actividad económica' },
                      { key: 'telefono',           label: 'Teléfono' },
                      { key: 'email',              label: 'Email' },
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

                  {totalFactura > 0 && (
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: agregarCuentaPagar ? '#FFF3E0' : '#F5F5F5', borderRadius: 10, cursor: 'pointer', border: `1.5px solid ${agregarCuentaPagar ? '#FF9800' : 'transparent'}` }}
                      onClick={() => setAgregarCuentaPagar(v => !v)}>
                      {agregarCuentaPagar ? <CheckCircle size={18} color="#E65100" /> : <Circle size={18} color="#bdbdbd" />}
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: agregarCuentaPagar ? '#E65100' : '#9e9e9e' }}>Registrar como cuenta por pagar</span>
                        <p style={{ margin: 0, fontSize: 12, color: '#9e9e9e' }}>Total: {fmtCOP(totalFactura)}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── MEJORA #5: Recordatorio de revisión ──────────────────── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', background: '#F3F4F6', borderRadius: 10, border: '1px solid #E5E7EB' }}>
            <AlertTriangle size={14} color="#6B7280" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>
              La IA puede cometer errores. <strong>Verifica los precios y el NIT</strong> antes de confirmar. Los campos son editables.
            </p>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={onCerrar} style={{ flex: 1, padding: '13px', borderRadius: 12, border: '1.5px solid #e0e0e0', background: '#fff', color: '#9e9e9e', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              disabled={!puedeConfirmar}
              style={{
                flex: 2, padding: '13px', borderRadius: 12, border: 'none',
                background: guardado ? G : AZ,
                color: '#fff', fontWeight: 800, fontSize: 14,
                cursor: puedeConfirmar ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: puedeConfirmar ? 1 : 0.5,
              }}
            >
              {guardando ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Guardando...</>
               : guardado ? <>✅ ¡Guardado!</>
               : '✓ Confirmar y guardar'}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
