import React from 'react';
import { ArrowLeft, Bell, FileText, DollarSign, Users, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const G  = '#2E7D32';
const GL = '#E8F5E9';

// ── Catálogo de notificaciones DEMO ─────────────────────────────────────────────
// Exportado para que Home.jsx pueda inicializar su estado global y calcular
// la insignia del icono de campana sin duplicar datos.
export const NOTIFS_DEMO = [
  { id: 1, tipo: 'factura',     titulo: 'Factura creada exitosamente', desc: 'FAC-1775958887053 ha sido registrada para Cristian Gomez', tiempo: 'Hace 2 horas', leida: false, iconoKey: 'FileText',  color: G,          bg: GL },
  { id: 2, tipo: 'movimiento',  titulo: 'Nuevo ingreso registrado',    desc: 'Se registro un ingreso de $150.000 en efectivo',           tiempo: 'Hace 5 horas', leida: false, iconoKey: 'DollarSign', color: G,          bg: GL },
  { id: 3, tipo: 'cliente',     titulo: 'Cliente agregado',            desc: 'Cristian Gomez fue agregado a tu lista de clientes',       tiempo: 'Ayer',          leida: true,  iconoKey: 'Users',      color: '#1565C0', bg: '#E3F2FD' },
  { id: 4, tipo: 'vencimiento', titulo: 'Factura pendiente de cobro',  desc: 'La factura FAC-1775858605104 lleva mas de 7 dias pendiente', tiempo: 'Hace 2 dias',  leida: true,  iconoKey: 'Clock',      color: '#E65100', bg: '#FFF3E0' },
];

const ICONOS = { FileText, DollarSign, Users, Clock };

const Notificaciones = ({ onBack, notifs, onToggleLeida, onMarcarTodas }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const tituloColor    = isDark ? '#E6EDF3' : '#1a1a1a';
  const subtituloColor = isDark ? '#9CA3AF' : '#9e9e9e';
  const cardBg         = isDark ? '#161B22' : '#fff';
  const cardBgUnread   = isDark ? '#0D2818' : GL;
  const cardBorder     = isDark ? '#30363D' : '#f0f0f0';
  const cardBorderUnread = isDark ? '#1F6F3A' : G + '40';
  const textoCard      = isDark ? '#E6EDF3' : '#1a1a1a';
  const descColor      = isDark ? '#9CA3AF' : '#757575';
  const tiempoColor    = isDark ? '#6B7280' : '#bdbdbd';
  const backBtnBg      = isDark ? '#161B22' : '#fff';
  const backBtnBorder  = isDark ? '#30363D' : '#e0e0e0';
  const backBtnIcon    = isDark ? '#E6EDF3' : '#424242';

  const sinLeer = notifs.filter(n => !n.leida).length;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <button type="button" onClick={onBack}
          style={{ width: '42px', height: '42px', borderRadius: '12px', border: `1.5px solid ${backBtnBorder}`, background: backBtnBg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={18} color={backBtnIcon} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: tituloColor }}>Notificaciones</h1>
            {sinLeer > 0 && (
              <div style={{ background: '#ef5350', color: '#fff', fontSize: '11px', fontWeight: '900', padding: '2px 8px', borderRadius: '20px' }}>{sinLeer}</div>
            )}
          </div>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: subtituloColor }}>Actividad reciente de tu cuenta</p>
        </div>
        {sinLeer > 0 && (
          <button type="button" onClick={onMarcarTodas}
            style={{ padding: '7px 14px', borderRadius: '10px', border: 'none', background: GL, color: G, fontWeight: '700', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CheckCircle size={13} /> Marcar leidas
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div style={{ background: cardBg, borderRadius: '20px', padding: '60px 32px', border: `1.5px solid ${cardBorder}`, textAlign: 'center' }}>
          <Bell size={36} color={tiempoColor} />
          <p style={{ margin: '12px 0 0', fontSize: '14px', color: tiempoColor }}>Sin notificaciones</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notifs.map(n => {
            const Icono = ICONOS[n.iconoKey] || Bell;
            return (
              <div key={n.id} onClick={() => onToggleLeida(n.id)}
                style={{
                  background: n.leida ? cardBg : cardBgUnread,
                  borderRadius: '16px', padding: '16px 18px',
                  border: '1.5px solid',
                  borderColor: n.leida ? cardBorder : cardBorderUnread,
                  cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start',
                  transition: 'all 0.15s',
                }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icono size={18} color={n.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: n.leida ? '600' : '800', color: textoCard }}>{n.titulo}</p>
                    {!n.leida && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: G, flexShrink: 0, marginTop: '4px' }} />}
                  </div>
                  <p style={{ margin: '0 0 5px', fontSize: '12px', color: descColor, lineHeight: '1.5' }}>{n.desc}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: tiempoColor }}>{n.tiempo}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notificaciones;
