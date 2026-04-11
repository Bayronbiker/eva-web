import React, { useState } from 'react';
import { ArrowLeft, Save, Trash2, UserPlus, Building2, IdCard, MapPin, Phone, Mail } from 'lucide-react';

const primaryGreen = '#2E7D32';
const darkGreen = '#1B5E20';
const lightGreen = '#E8F5E9';

const CrearCliente = ({ onBack, onSave, onDelete, clienteAEditar }) => {
  const isEditMode = !!clienteAEditar;

  const [nombre, setNombre] = useState(clienteAEditar?.nombre || '');
  const [ciudad, setCiudad] = useState(clienteAEditar?.ciudad || '');
  const [actividadEconomica, setActividadEconomica] = useState(clienteAEditar?.actividadEconomica || '');
  const [cedulaOrNit, setCedulaOrNit] = useState(clienteAEditar?.cedulaOrNit?.toString() || '');
  const [direccion, setDireccion] = useState(clienteAEditar?.direccion || '');
  const [telefono, setTelefono] = useState(clienteAEditar?.telefono || '');
  const [email, setEmail] = useState(clienteAEditar?.email || '');

  const isValido = nombre.trim() && cedulaOrNit.trim() && email.trim() && ciudad.trim() && actividadEconomica.trim();

  const handleGuardar = () => {
    const data = { nombre, ciudad, actividadEconomica, cedulaOrNit, direccion, telefono, email };
    if (isEditMode) data._id = clienteAEditar._id;
    onSave(data);
  };

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

  const initials = nombre ? nombre.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
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
                {isEditMode ? 'Editar cliente' : 'Nuevo cliente'}
              </h1>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#9e9e9e' }}>Gestión de contactos comerciales</p>
          </div>
        </div>
      </div>

      {/* Nombre + Ciudad */}
      <div style={sectionStyle}>
        <div style={{ background: primaryGreen, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={16} color="rgba(255,255,255,0.8)" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Información principal</span>
        </div>
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Nombre del cliente *</label>
            <input type="text" placeholder="Nombre completo o empresa" value={nombre}
              onChange={(e) => setNombre(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Ciudad *</label>
            <input type="text" placeholder="Ej. Bogotá" value={ciudad}
              onChange={(e) => setCiudad(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Actividad económica *</label>
            <input type="text" placeholder="Ej. Comercio al por mayor" value={actividadEconomica}
              onChange={(e) => setActividadEconomica(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Cédula o NIT *</label>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Sin puntos ni comas" value={cedulaOrNit}
                onChange={(e) => setCedulaOrNit(e.target.value.replace(/\D/g, ''))}
                style={{ ...inputStyle, paddingLeft: '44px' }} />
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
              <input type="tel" placeholder="Número de contacto" value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '44px' }} />
              <Phone size={16} color="#9e9e9e" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Correo electrónico *</label>
            <div style={{ position: 'relative' }}>
              <input type="email" placeholder="correo@ejemplo.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '44px' }} />
              <Mail size={16} color="#9e9e9e" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Dirección (opcional)</label>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Dirección física" value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '44px' }} />
              <MapPin size={16} color="#9e9e9e" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Botones */}
      {isEditMode ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
          <button type="button" onClick={() => onDelete(clienteAEditar._id)}
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
          <Save size={22} /> Guardar cliente
        </button>
      )}
    </div>
  );
};

export default CrearCliente;