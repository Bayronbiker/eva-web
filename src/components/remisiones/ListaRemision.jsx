import React from 'react';
import { PackageCheck, Plus, Truck, ArrowRight } from 'lucide-react';

const primaryGreen = '#2E7D32';
const darkGreen = '#1B5E20';
const lightGreen = '#E8F5E9';

const ListaRemision = ({ remisiones = [], onSeleccionar, onNueva }) => {

  const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n ?? 0);
  const descPrimera = (r) => r.items?.[0]?.descripcion || '—';
  const totalRemision = (r) => {
    if (typeof r.total === 'number') return r.total;
    return (r.items || []).reduce((acc, it) => acc + (Number(it.total) || 0), 0);
  };

  const estadoColor = (estado) => {
    if (estado === 'entregada') return { bg: lightGreen, color: darkGreen };
    if (estado === 'anulada') return { bg: '#FFEBEE', color: '#C62828' };
    return { bg: '#FFF8E1', color: '#E65100' };
  };

  if (!remisiones.length) {
    return (
      <div style={{ maxWidth: '780px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ background: '#fff', borderRadius: '24px', border: '1.5px solid #f0f0f0', overflow: 'hidden' }}>
          <div style={{ background: primaryGreen, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PackageCheck size={20} color="#fff" />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#fff' }}>Remisiones</h1>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Sin entregas aún</p>
              </div>
            </div>
            <button type="button" onClick={onNueva}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#fff', color: primaryGreen, fontWeight: '800', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
              <Plus size={16} /> Nueva
            </button>
          </div>
          <div style={{ padding: '64px 32px', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: lightGreen, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={32} color={primaryGreen} />
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>Sin remisiones creadas</h2>
            <p style={{ margin: '0 0 28px', fontSize: '14px', color: '#9e9e9e', maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
              Crea tu primera remisión y aparecerá aquí. Se sincronizan con la app móvil.
            </p>
            <button type="button" onClick={onNueva}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '12px', border: 'none', background: primaryGreen, color: '#fff', fontWeight: '800', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
              <Plus size={18} /> Crear primera remisión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <div style={{ background: primaryGreen, borderRadius: '20px', padding: '24px 28px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PackageCheck size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#fff' }}>Remisiones</h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{remisiones.length} entrega{remisiones.length !== 1 ? 's' : ''} registrada{remisiones.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button type="button" onClick={onNueva}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#fff', color: primaryGreen, fontWeight: '800', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={16} /> Nueva remisión
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {remisiones.map((r) => {
          const est = estadoColor(r.estado);
          return (
            <button key={r._id || r.id} type="button" onClick={() => onSeleccionar(r)}
              style={{ width: '100%', textAlign: 'left', background: '#fff', borderRadius: '16px', border: '1.5px solid #f0f0f0', padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '20px', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = primaryGreen}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: lightGreen, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Truck size={20} color={primaryGreen} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#1a1a1a' }}>{r.clienteNombre}</span>
                  {r.estado && (
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px', background: est.bg, color: est.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {r.estado}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#9e9e9e', fontWeight: '600' }}>{r.numero}</span>
                  <span style={{ fontSize: '12px', color: '#bdbdbd' }}>·</span>
                  <span style={{ fontSize: '12px', color: '#9e9e9e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px' }}>{descPrimera(r)}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: primaryGreen }}>{fmt(totalRemision(r))}</div>
              </div>
              <ArrowRight size={18} color="#e0e0e0" style={{ flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ListaRemision;