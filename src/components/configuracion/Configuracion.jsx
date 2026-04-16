import React, { useState } from 'react';
import { ArrowLeft, User, Bell, Shield, Globe, Palette, Moon, Sun, ChevronRight, Save, Building } from 'lucide-react';

const G = '#2E7D32';
const GL = '#E8F5E9';

const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e0e0e0', fontSize: '14px', fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', color: '#757575', marginBottom: '6px', display: 'block' };

const ToggleSwitch = ({ value, onChange }) => (
  <button type="button" onClick={() => onChange(!value)}
    style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', background: value ? G : '#e0e0e0', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: value ? '23px' : '3px', transition: 'left 0.2s' }} />
  </button>
);

const Configuracion = ({ onBack, userData }) => {
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [nitEmpresa, setNitEmpresa] = useState('');
  const [telefonoEmpresa, setTelefonoEmpresa] = useState('');
  const [direccionEmpresa, setDireccionEmpresa] = useState('');
  const [notifFacturas, setNotifFacturas] = useState(true);
  const [notifMovimientos, setNotifMovimientos] = useState(true);
  const [notifVencimientos, setNotifVencimientos] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const handleGuardar = () => {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  const sectionStyle = { background: '#fff', borderRadius: '16px', border: '1.5px solid #f0f0f0', marginBottom: '14px', overflow: 'hidden' };
  const rowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '1px solid #f5f5f5' };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <button type="button" onClick={onBack}
          style={{ width: '42px', height: '42px', borderRadius: '12px', border: '1.5px solid #e0e0e0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={18} color="#424242" />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>Configuracion</h1>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9e9e9e' }}>Personaliza tu cuenta EVA</p>
        </div>
      </div>

      {/* Perfil */}
      <div style={sectionStyle}>
        <div style={{ background: G, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={15} color="rgba(255,255,255,0.85)" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Perfil de usuario</span>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: GL, borderRadius: '12px', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '900', color: '#fff', flexShrink: 0 }}>
              {(userData?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1a1a1a' }}>{userData?.name || 'Usuario'}</p>
              <p style={{ margin: 0, fontSize: '12px', color: G, fontWeight: '600', textTransform: 'uppercase' }}>{userData?.role || 'Administrador'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empresa */}
      <div style={sectionStyle}>
        <div style={{ background: '#F5F5F5', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building size={15} color="#757575" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#757575', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Datos de la empresa</span>
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Nombre empresa / Razon social</label>
            <input type="text" placeholder="Tu empresa S.A.S." value={nombreEmpresa} onChange={e => setNombreEmpresa(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>NIT</label>
            <input type="text" placeholder="900.000.000-0" value={nitEmpresa} onChange={e => setNitEmpresa(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Telefono</label>
            <input type="tel" placeholder="(601) 000 0000" value={telefonoEmpresa} onChange={e => setTelefonoEmpresa(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Direccion</label>
            <input type="text" placeholder="Calle 00 # 00-00, Ciudad" value={direccionEmpresa} onChange={e => setDireccionEmpresa(e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      <div style={sectionStyle}>
        <div style={{ background: '#F5F5F5', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={15} color="#757575" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#757575', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Notificaciones</span>
        </div>
        {[
          { label: 'Nuevas facturas', desc: 'Alerta cuando se cree una factura', value: notifFacturas, set: setNotifFacturas },
          { label: 'Movimientos de dinero', desc: 'Notificar ingresos y gastos', value: notifMovimientos, set: setNotifMovimientos },
          { label: 'Vencimientos', desc: 'Recordatorio de facturas por vencer', value: notifVencimientos, set: setNotifVencimientos },
        ].map((item, i, arr) => (
          <div key={i} style={{ ...rowStyle, borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: '#1a1a1a' }}>{item.label}</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#9e9e9e' }}>{item.desc}</p>
            </div>
            <ToggleSwitch value={item.value} onChange={item.set} />
          </div>
        ))}
      </div>

      {/* Seguridad */}
      <div style={sectionStyle}>
        <div style={{ background: '#F5F5F5', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={15} color="#757575" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#757575', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Seguridad</span>
        </div>
        {[
          { label: 'Cambiar contrasena', desc: 'Actualiza tu contrasena de acceso' },
          { label: 'Cerrar todas las sesiones', desc: 'Desconectar de todos los dispositivos' },
        ].map((item, i) => (
          <div key={i} style={{ ...rowStyle, cursor: 'pointer', borderBottom: i === 0 ? '1px solid #f5f5f5' : 'none' }}>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: '#1a1a1a' }}>{item.label}</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#9e9e9e' }}>{item.desc}</p>
            </div>
            <ChevronRight size={16} color="#bdbdbd" />
          </div>
        ))}
      </div>

      <button type="button" onClick={handleGuardar}
        style={{ width: '100%', padding: '15px', borderRadius: '14px', border: 'none', background: guardado ? '#4CAF50' : G, color: '#fff', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit', transition: 'background 0.3s' }}>
        <Save size={18} /> {guardado ? 'Guardado correctamente' : 'Guardar configuracion'}
      </button>
    </div>
  );
};

export default Configuracion;