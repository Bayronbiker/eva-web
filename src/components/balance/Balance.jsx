import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown, DollarSign, Calendar, Filter } from 'lucide-react';

const G = '#2E7D32';
const GL = '#E8F5E9';

const Balance = ({ movimientos = [], resumen = { saldo: 0, ingresos: 0, gastos: 0 } }) => {
  const [filtro, setFiltro] = useState('todos');
  const [semana, setSemana] = useState(0);

  const dias = ['Lun', 'Mar', 'Mie', 'Jue', 'Hoy', 'Sab', 'Dom'];
  const hoy = new Date().getDay();

  const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0);
  const fmtShort = (n) => {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
    return fmt(n);
  };

  const movsFiltrados = movimientos.filter(m => filtro === 'todos' ? true : m.tipo === filtro);

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Selector de semana */}
      <div style={{ background: GL, borderRadius: '16px', padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: G }}>Esta semana</span>
          <Calendar size={16} color={G} />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {dias.map((d, i) => {
            const esHoy = i === 4;
            return (
              <button key={i} type="button" onClick={() => {}}
                style={{ flex: 1, padding: '8px 4px', borderRadius: '10px', border: 'none', background: esHoy ? G : 'rgba(46,125,50,0.08)', cursor: 'pointer', fontFamily: 'inherit' }}>
                <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: esHoy ? 'rgba(255,255,255,0.7)' : '#9e9e9e', textTransform: 'uppercase' }}>{d}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tarjetas resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: GL, borderRadius: '16px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ArrowUpCircle size={16} color={G} />
            <span style={{ fontSize: '11px', fontWeight: '700', color: G, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ingresos</span>
          </div>
          <p style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: G }}>{fmtShort(resumen.ingresos)}</p>
        </div>
        <div style={{ background: '#FFEBEE', borderRadius: '16px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ArrowDownCircle size={16} color="#ef5350" />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#ef5350', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gastos</span>
          </div>
          <p style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#ef5350' }}>{fmtShort(resumen.gastos)}</p>
        </div>
      </div>

      {/* Balance total */}
      <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
        <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: '700', color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: '1px' }}>Balance Total</p>
        <p style={{ margin: 0, fontSize: '38px', fontWeight: '900', color: resumen.saldo >= 0 ? '#4CAF50' : '#ef5350', letterSpacing: '-1px' }}>{fmt(resumen.saldo)}</p>
      </div>

      {/* Movimientos */}
      <div style={{ background: '#fff', borderRadius: '20px', border: '1.5px solid #f0f0f0', overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1a1a1a' }}>Movimientos</h3>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[{ id: 'todos', label: 'Todos' }, { id: 'ingreso', label: 'Ingresos' }, { id: 'gasto', label: 'Gastos' }].map(f => (
              <button key={f.id} type="button" onClick={() => setFiltro(f.id)}
                style={{ padding: '5px 12px', borderRadius: '20px', border: 'none', background: filtro === f.id ? G : '#F5F5F5', color: filtro === f.id ? '#fff' : '#9e9e9e', fontWeight: '700', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {movsFiltrados.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <DollarSign size={32} color="#e0e0e0" />
            <p style={{ margin: '10px 0 0', fontSize: '13px', color: '#bdbdbd' }}>
              {filtro === 'todos' ? 'No hay movimientos registrados' : filtro === 'ingreso' ? 'No hay ingresos registrados' : 'No hay gastos registrados'}
            </p>
          </div>
        ) : (
          <div>
            {movsFiltrados.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderBottom: i < movsFiltrados.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: m.tipo === 'ingreso' ? GL : '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {m.tipo === 'ingreso' ? <ArrowUpCircle size={17} color={G} /> : <ArrowDownCircle size={17} color="#ef5350" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.descripcion || m.categoria || (m.tipo === 'ingreso' ? 'Ingreso' : 'Gasto')}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#9e9e9e' }}>{m.fecha ? new Date(m.fecha).toLocaleDateString('es-CO') : ''}{m.metodoPago ? ' · ' + m.metodoPago : ''}</p>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '900', color: m.tipo === 'ingreso' ? G : '#ef5350', flexShrink: 0 }}>
                  {m.tipo === 'ingreso' ? '+' : '-'}{fmtShort(m.monto)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Balance;