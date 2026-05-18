import React from 'react';
import { Truck, Phone, Mail, Plus, ArrowRight } from 'lucide-react';

const primaryGreen = '#2E7D32';
const darkGreen    = '#1B5E20';
const lightGreen   = '#E8F5E9';

const ListaProveedores = ({ proveedores = [], onNuevo, onEdit }) => {

  const initials = (nombre) =>
    nombre ? nombre.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

  if (!proveedores.length) {
    return (
      <div style={{ maxWidth: '780px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ background: '#fff', borderRadius: '24px', border: '1.5px solid #f0f0f0', overflow: 'hidden' }}>
          <div style={{ background: primaryGreen, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={20} color="#fff" />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#fff' }}>Proveedores</h1>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Sin registros aún</p>
              </div>
            </div>
            <button type="button" onClick={onNuevo}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#fff', color: primaryGreen, fontWeight: '800', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
              <Plus size={16} /> Nuevo
            </button>
          </div>
          <div style={{ padding: '64px 32px', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: lightGreen, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={32} color={primaryGreen} />
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>Sin proveedores registrados</h2>
            <p style={{ margin: '0 0 28px', fontSize: '14px', color: '#9e9e9e', maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
              Registra tus proveedores para llevar el control de tus compras y cuentas por pagar.
            </p>
            <button type="button" onClick={onNuevo}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '12px', border: 'none', background: primaryGreen, color: '#fff', fontWeight: '800', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
              <Plus size={18} /> Crear primer proveedor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ background: primaryGreen, borderRadius: '20px', padding: '24px 28px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#fff' }}>Proveedores</h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
              {proveedores.length} proveedor{proveedores.length !== 1 ? 'es' : ''} registrado{proveedores.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button type="button" onClick={onNuevo}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#fff', color: primaryGreen, fontWeight: '800', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={16} /> Nuevo proveedor
        </button>
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {proveedores.map((prov) => (
          <button key={prov._id} type="button" onClick={() => onEdit(prov)}
            style={{ width: '100%', textAlign: 'left', background: '#fff', borderRadius: '16px', border: '1.5px solid #f0f0f0', padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = primaryGreen}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
          >
            {/* Avatar */}
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: primaryGreen, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '800', color: '#fff', flexShrink: 0 }}>
              {initials(prov.nombre)}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '15px', fontWeight: '800', color: '#1a1a1a' }}>{prov.nombre}</span>
                {prov.ciudad && (
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px', background: lightGreen, color: darkGreen }}>
                    {prov.ciudad}
                  </span>
                )}
                {prov.actividadEconomica && (
                  <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 10px', borderRadius: '20px', background: '#F5F5F5', color: '#757575', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {prov.actividadEconomica}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {prov.telefono && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Phone size={12} color="#9e9e9e" />
                    <span style={{ fontSize: '12px', color: '#9e9e9e' }}>{prov.telefono}</span>
                  </div>
                )}
                {prov.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Mail size={12} color="#9e9e9e" />
                    <span style={{ fontSize: '12px', color: '#9e9e9e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{prov.email}</span>
                  </div>
                )}
              </div>
            </div>

            <ArrowRight size={18} color="#e0e0e0" style={{ flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListaProveedores;
