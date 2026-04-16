import React from 'react';
import { ArrowLeft, Bell, FileText, DollarSign, Users, CheckCircle, Clock } from 'lucide-react';

const G = '#2E7D32';
const GL = '#E8F5E9';

const NOTIFS_DEMO = [
  { id: 1, tipo: 'factura', titulo: 'Factura creada exitosamente', desc: 'FAC-1775958887053 ha sido registrada para Cristian Gomez', tiempo: 'Hace 2 horas', leida: false, icono: FileText, color: G, bg: GL },
  { id: 2, tipo: 'movimiento', titulo: 'Nuevo ingreso registrado', desc: 'Se registro un ingreso de $150.000 en efectivo', tiempo: 'Hace 5 horas', leida: false, icono: DollarSign, color: G, bg: GL },
  { id: 3, tipo: 'cliente', titulo: 'Cliente agregado', desc: 'Cristian Gomez fue agregado a tu lista de clientes', tiempo: 'Ayer', leida: true, icono: Users, color: '#1565C0', bg: '#E3F2FD' },
  { id: 4, tipo: 'vencimiento', titulo: 'Factura pendiente de cobro', desc: 'La factura FAC-1775858605104 lleva mas de 7 dias pendiente', tiempo: 'Hace 2 dias', leida: true, icono: Clock, color: '#E65100', bg: '#FFF3E0' },
];

const Notificaciones = ({ onBack }) => {
  const [notifs, setNotifs] = React.useState(NOTIFS_DEMO);
  const sinLeer = notifs.filter(n => !n.leida).length;

  const marcarTodas = () => setNotifs(prev => prev.map(n => ({ ...n, leida: true })));

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <button type="button" onClick={onBack}
          style={{ width: '42px', height: '42px', borderRadius: '12px', border: '1.5px solid #e0e0e0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={18} color="#424242" />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>Notificaciones</h1>
            {sinLeer > 0 && (
              <div style={{ background: '#ef5350', color: '#fff', fontSize: '11px', fontWeight: '900', padding: '2px 8px', borderRadius: '20px' }}>{sinLeer}</div>
            )}
          </div>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9e9e9e' }}>Actividad reciente de tu cuenta</p>
        </div>
        {sinLeer > 0 && (
          <button type="button" onClick={marcarTodas}
            style={{ padding: '7px 14px', borderRadius: '10px', border: 'none', background: GL, color: G, fontWeight: '700', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CheckCircle size={13} /> Marcar leidas
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '20px', padding: '60px 32px', border: '1.5px solid #f0f0f0', textAlign: 'center' }}>
          <Bell size={36} color="#e0e0e0" />
          <p style={{ margin: '12px 0 0', fontSize: '14px', color: '#bdbdbd' }}>Sin notificaciones</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notifs.map(n => (
            <div key={n.id} onClick={() => setNotifs(prev => prev.map(p => p.id === n.id ? { ...p, leida: true } : p))}
              style={{ background: n.leida ? '#fff' : GL, borderRadius: '16px', padding: '16px 18px', border: '1.5px solid', borderColor: n.leida ? '#f0f0f0' : G + '40', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start', transition: 'all 0.15s' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <n.icono size={18} color={n.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: n.leida ? '600' : '800', color: '#1a1a1a' }}>{n.titulo}</p>
                  {!n.leida && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: G, flexShrink: 0, marginTop: '4px' }} />}
                </div>
                <p style={{ margin: '0 0 5px', fontSize: '12px', color: '#757575', lineHeight: '1.5' }}>{n.desc}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#bdbdbd' }}>{n.tiempo}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notificaciones;