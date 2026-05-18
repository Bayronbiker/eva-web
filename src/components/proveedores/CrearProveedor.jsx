import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Save, Trash2, Truck, IdCard, MapPin, Phone, Mail, FileText, DollarSign, CheckCircle, Clock } from 'lucide-react';
import EscanearFactura from '../shared/EscanearFactura';
import ResultadoFactura from '../shared/ResultadoFactura';
import config from '../../config';

const primaryGreen = '#2E7D32';
const lightGreen   = '#E8F5E9';
const BASE_URL     = config.API_URL;
const axiosAuth    = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const fmtCOP = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(n) || 0);

const CrearProveedor = ({ onBack, onSave, onDelete, proveedorAEditar, proveedores = [], onRecargar }) => {
  const isEditMode = !!proveedorAEditar;

  const [nombre,             setNombre]             = useState(proveedorAEditar?.nombre             || '');
  const [ciudad,             setCiudad]             = useState(proveedorAEditar?.ciudad             || '');
  const [actividadEconomica, setActividadEconomica] = useState(proveedorAEditar?.actividadEconomica || '');
  const [nit,                setNit]                = useState(proveedorAEditar?.nit?.toString()    || '');
  const [direccion,          setDireccion]          = useState(proveedorAEditar?.direccion          || '');
  const [telefono,           setTelefono]           = useState(proveedorAEditar?.telefono           || '');
  const [email,              setEmail]              = useState(proveedorAEditar?.email              || '');
  const [notas,              setNotas]              = useState(proveedorAEditar?.notas              || '');

  // Cuentas por pagar
  const [cuentas,            setCuentas]            = useState(proveedorAEditar?.cuentasPorPagar || []);
  const [actualizandoCuenta, setActualizandoCuenta] = useState(null);

  // Escaneo IA
  const [resultadoFactura, setResultadoFactura] = useState(null);

  const isValido = nombre.trim() && nit.trim() && email.trim() && ciudad.trim() && actividadEconomica.trim();

  const handleGuardar = () => {
    const data = { nombre, ciudad, actividadEconomica, nit, direccion, telefono, email, notas };
    if (isEditMode) data._id = proveedorAEditar._id;
    onSave(data);
  };

  // Rellenar el formulario con datos del escaneo IA
  const handleResultadoFactura = (datos) => {
    setResultadoFactura(datos);
    // Pre-llenar campos si la IA los detectó
    if (datos.proveedor) {
      const p = datos.proveedor;
      if (p.nombre             && !nombre)             setNombre(p.nombre);
      if (p.nit                && !nit)                setNit(p.nit);
      if (p.ciudad             && !ciudad)             setCiudad(p.ciudad);
      if (p.actividadEconomica && !actividadEconomica) setActividadEconomica(p.actividadEconomica);
      if (p.telefono           && !telefono)           setTelefono(p.telefono);
      if (p.email              && !email)              setEmail(p.email);
      if (p.direccion          && !direccion)          setDireccion(p.direccion);
    }
  };

  const handleConfirmarFactura = async (res) => {
    setResultadoFactura(null);
    if (res.cuentaAgregada && onRecargar) await onRecargar();
    // Recargar cuentas si este proveedor ya existe
    if (isEditMode && res.proveedorId === proveedorAEditar._id) {
      try {
        const { data } = await axios.get(`${BASE_URL}/proveedores`, axiosAuth());
        const prov = data.find(p => p._id === proveedorAEditar._id);
        if (prov) setCuentas(prov.cuentasPorPagar || []);
      } catch { /* silencioso */ }
    }
    const msg = [];
    if (res.inventarioAgregados.length) msg.push(`${res.inventarioAgregados.length} producto(s) al inventario`);
    if (res.cuentaAgregada) msg.push('cuenta por pagar registrada');
    if (msg.length) alert('✅ ' + msg.join(' y '));
  };

  const toggleEstadoCuenta = async (cuentaId, estadoActual) => {
    if (!isEditMode) return;
    setActualizandoCuenta(cuentaId);
    try {
      const nuevoEstado = estadoActual === 'pendiente' ? 'pagada' : 'pendiente';
      const { data } = await axios.put(
        `${BASE_URL}/proveedores/${proveedorAEditar._id}/cuentas-pagar/${cuentaId}`,
        { estado: nuevoEstado },
        axiosAuth()
      );
      setCuentas(data.cuentasPorPagar || []);
    } catch { alert('Error actualizando la cuenta'); }
    finally { setActualizandoCuenta(null); }
  };

  const eliminarCuenta = async (cuentaId) => {
    if (!window.confirm('¿Eliminar esta cuenta por pagar?')) return;
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/proveedores/${proveedorAEditar._id}/cuentas-pagar/${cuentaId}`,
        axiosAuth()
      );
      setCuentas(data.cuentasPorPagar || []);
    } catch { alert('Error eliminando la cuenta'); }
  };

  const totalPendiente = cuentas.filter(c => c.estado === 'pendiente').reduce((s, c) => s + c.montoTotal, 0);
  const totalPagado    = cuentas.filter(c => c.estado === 'pagada').reduce((s, c) => s + c.montoTotal, 0);

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
    background: '#fff', borderRadius: '16px', border: '1.5px solid #f0f0f0',
    marginBottom: '16px', overflow: 'hidden',
  };

  const initials = nombre ? nombre.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Modal resultado IA */}
      {resultadoFactura && (
        <ResultadoFactura
          resultado={resultadoFactura}
          proveedores={proveedores}
          onConfirmar={handleConfirmarFactura}
          onCerrar={() => setResultadoFactura(null)}
        />
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <button type="button" onClick={onBack}
          style={{ width: '44px', height: '44px', borderRadius: '12px', border: '1.5px solid #e0e0e0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={20} color="#424242" />
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isEditMode && (
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: primaryGreen, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', color: '#fff', flexShrink: 0 }}>
              {initials}
            </div>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isEditMode ? '#FF9800' : primaryGreen }} />
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1a1a1a' }}>
                {isEditMode ? 'Editar proveedor' : 'Nuevo proveedor'}
              </h1>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#9e9e9e' }}>Gestión de proveedores comerciales</p>
          </div>
        </div>
      </div>

      {/* Botón escanear factura */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #f0f0f0', padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Escanear factura con IA</p>
          <p style={{ margin: 0, fontSize: 12, color: '#9e9e9e' }}>La IA extrae los datos del proveedor, los productos y el total automáticamente.</p>
        </div>
        <EscanearFactura onResultado={handleResultadoFactura} label="Tomar foto de factura" />
      </div>

      {/* Información principal */}
      <div style={sectionStyle}>
        <div style={{ background: primaryGreen, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={16} color="rgba(255,255,255,0.8)" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Información principal</span>
        </div>
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Nombre del proveedor *</label>
            <input type="text" placeholder="Nombre o razón social" value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Ciudad *</label>
            <input type="text" placeholder="Ej. Medellín" value={ciudad} onChange={e => setCiudad(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Actividad económica *</label>
            <input type="text" placeholder="Ej. Suministro de materiales" value={actividadEconomica} onChange={e => setActividadEconomica(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Cédula o NIT *</label>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Sin puntos ni comas" value={nit} onChange={e => setNit(e.target.value.replace(/\D/g, ''))} style={{ ...inputStyle, paddingLeft: '44px' }} />
              <IdCard size={16} color="#9e9e9e" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div style={sectionStyle}>
        <div style={{ background: '#F5F5F5', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Phone size={16} color="#757575" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#757575', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Información de contacto</span>
        </div>
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Teléfono (opcional)</label>
            <div style={{ position: 'relative' }}>
              <input type="tel" placeholder="Número de contacto" value={telefono} onChange={e => setTelefono(e.target.value)} style={{ ...inputStyle, paddingLeft: '44px' }} />
              <Phone size={16} color="#9e9e9e" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Correo electrónico *</label>
            <div style={{ position: 'relative' }}>
              <input type="email" placeholder="correo@proveedor.com" value={email} onChange={e => setEmail(e.target.value)} style={{ ...inputStyle, paddingLeft: '44px' }} />
              <Mail size={16} color="#9e9e9e" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Dirección (opcional)</label>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Dirección física" value={direccion} onChange={e => setDireccion(e.target.value)} style={{ ...inputStyle, paddingLeft: '44px' }} />
              <MapPin size={16} color="#9e9e9e" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Notas */}
      <div style={sectionStyle}>
        <div style={{ background: '#F5F5F5', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} color="#757575" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#757575', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Notas adicionales</span>
        </div>
        <div style={{ padding: '24px' }}>
          <textarea placeholder="Condiciones de pago, productos que ofrece, observaciones..." value={notas} onChange={e => setNotas(e.target.value)} rows={3}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }} />
        </div>
      </div>

      {/* ── Cuentas por pagar (solo en modo edición) ── */}
      {isEditMode && (
        <div style={sectionStyle}>
          <div style={{ background: '#FFF3E0', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={16} color="#E65100" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#E65100', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Cuentas por pagar</span>
            </div>
            {cuentas.length > 0 && (
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 11, color: '#E65100', fontWeight: 700 }}>
                  Pendiente: {fmtCOP(totalPendiente)} · Pagado: {fmtCOP(totalPagado)}
                </p>
              </div>
            )}
          </div>
          <div style={{ padding: '16px 24px' }}>
            {cuentas.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13, color: '#9e9e9e', textAlign: 'center', padding: '12px 0' }}>
                No hay cuentas por pagar registradas. Escanea una factura para agregarlas.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...cuentas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(cuenta => (
                  <div key={cuenta._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: cuenta.estado === 'pagada' ? '#F5F5F5' : '#FFF8E1', border: `1.5px solid ${cuenta.estado === 'pagada' ? '#e0e0e0' : '#FFE0B2'}` }}>
                    <button
                      onClick={() => toggleEstadoCuenta(cuenta._id, cuenta.estado)}
                      disabled={actualizandoCuenta === cuenta._id}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, display: 'flex', alignItems: 'center' }}
                      title={cuenta.estado === 'pendiente' ? 'Marcar como pagada' : 'Marcar como pendiente'}
                    >
                      {cuenta.estado === 'pagada'
                        ? <CheckCircle size={20} color={primaryGreen} />
                        : <Clock size={20} color="#FF9800" />
                      }
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: cuenta.estado === 'pagada' ? '#9e9e9e' : '#1a1a1a', textDecoration: cuenta.estado === 'pagada' ? 'line-through' : 'none' }}>
                        {cuenta.descripcion}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: '#9e9e9e' }}>
                        {new Date(cuenta.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {' · '}
                        <span style={{ color: cuenta.estado === 'pagada' ? primaryGreen : '#E65100', fontWeight: 700 }}>
                          {cuenta.estado === 'pagada' ? 'Pagada' : 'Pendiente'}
                        </span>
                      </p>
                    </div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: cuenta.estado === 'pagada' ? '#9e9e9e' : '#E65100', flexShrink: 0 }}>
                      {fmtCOP(cuenta.montoTotal)}
                    </p>
                    <button onClick={() => eliminarCuenta(cuenta._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bdbdbd', padding: 4, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botones acción */}
      {isEditMode ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
          <button type="button" onClick={() => onDelete(proveedorAEditar._id)}
            style={{ padding: '16px', borderRadius: '14px', border: '1.5px solid #ef5350', background: '#fff', color: '#ef5350', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit' }}>
            <Trash2 size={20} /> Eliminar
          </button>
          <button type="button" onClick={handleGuardar} disabled={!isValido}
            style={{ padding: '16px', borderRadius: '14px', border: 'none', background: isValido ? primaryGreen : '#e0e0e0', color: '#fff', fontWeight: '800', fontSize: '15px', cursor: isValido ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit' }}>
            <Save size={20} /> Guardar cambios
          </button>
        </div>
      ) : (
        <button type="button" onClick={handleGuardar} disabled={!isValido}
          style={{ width: '100%', padding: '18px', borderRadius: '14px', border: 'none', background: isValido ? primaryGreen : '#e0e0e0', color: '#fff', fontWeight: '800', fontSize: '16px', cursor: isValido ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontFamily: 'inherit' }}>
          <Save size={22} /> Guardar proveedor
        </button>
      )}
    </div>
  );
};

export default CrearProveedor;
