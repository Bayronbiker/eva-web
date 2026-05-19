import React, { useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowUpCircle, ArrowDownCircle, DollarSign,
  Search, X, Calendar
} from 'lucide-react';

const G   = '#2E7D32';
const GL  = '#E8F5E9';
const R   = '#ef5350';
const RL  = '#FFEBEE';

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0);

const fmtFecha = (f) =>
  new Date(f).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

/**
 * Lista completa de ingresos o gastos, ordenada por fecha descendente.
 * Props:
 *   tipo        → 'ingreso' | 'gasto'
 *   movimientos → array completo de movimientos del usuario
 *   onBack()    → volver a Balance
 */
export default function ListaMovimientos({ tipo, movimientos = [], onBack }) {
  const [busqueda,  setBusqueda]  = useState('');
  const [filtroMes, setFiltroMes] = useState(''); // 'YYYY-MM'

  const esIngreso = tipo === 'ingreso';
  const COLOR  = esIngreso ? G  : R;
  const COLBG  = esIngreso ? GL : RL;
  const Icono  = esIngreso ? ArrowUpCircle : ArrowDownCircle;
  const titulo = esIngreso ? 'Ingresos' : 'Gastos';
  const signo  = esIngreso ? '+' : '-';

  /* ── Filtrado y ordenado ─────────────────────────────────────────────── */
  const lista = useMemo(() => {
    let result = movimientos.filter(m => m.tipo === tipo);

    if (filtroMes) {
      result = result.filter(m => {
        const f = new Date(m.fecha);
        const ym = `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}`;
        return ym === filtroMes;
      });
    }

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      result = result.filter(m =>
        (m.descripcion || '').toLowerCase().includes(q) ||
        (m.categoria   || '').toLowerCase().includes(q) ||
        (m.metodoPago  || '').toLowerCase().includes(q) ||
        String(m.monto || '').includes(q)
      );
    }

    // Ordenar por fecha más reciente primero
    return result.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [movimientos, tipo, busqueda, filtroMes]);

  const total = lista.reduce((s, m) => s + (m.monto || 0), 0);

  /* ── Meses disponibles para el filtro ───────────────────────────────── */
  const mesesDisponibles = useMemo(() => {
    const set = new Set();
    movimientos
      .filter(m => m.tipo === tipo)
      .forEach(m => {
        const f  = new Date(m.fecha);
        const ym = `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}`;
        set.add(ym);
      });
    return Array.from(set).sort((a, b) => b.localeCompare(a)); // desc
  }, [movimientos, tipo]);

  const labelMes = (ym) => {
    const [y, m] = ym.split('-');
    const fecha = new Date(Number(y), Number(m) - 1, 1);
    return fecha.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
  };

  /* ── Agrupar por fecha ───────────────────────────────────────────────── */
  const grupos = useMemo(() => {
    const mapa = {};
    lista.forEach(m => {
      const key = new Date(m.fecha).toDateString();
      if (!mapa[key]) mapa[key] = { label: fmtFecha(m.fecha), items: [] };
      mapa[key].items.push(m);
    });
    return Object.values(mapa);
  }, [lista]);

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
        <button type="button" onClick={onBack}
          style={{ width: '42px', height: '42px', borderRadius: '12px', border: '1.5px solid #e0e0e0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={18} color="#424242" />
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLOR }} />
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>{titulo}</h1>
          </div>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9e9e9e' }}>
            {lista.length} registro{lista.length !== 1 ? 's' : ''} · ordenados por fecha
          </p>
        </div>
      </div>

      {/* ── Tarjeta total ──────────────────────────────────────────────── */}
      <div style={{ background: COLOR, borderRadius: '20px', padding: '22px 24px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icono size={24} color="#fff" />
        </div>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Total {filtroMes ? labelMes(filtroMes) : 'acumulado'}
          </p>
          <p style={{ margin: 0, fontSize: '30px', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>
            {signo}{fmt(total)}
          </p>
        </div>
      </div>

      {/* ── Filtros ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {/* Búsqueda */}
        <div style={{ flex: 1, minWidth: '180px', position: 'relative' }}>
          <Search size={15} color="#9e9e9e" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Buscar por descripción, categoría..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '12px', border: '1.5px solid #e0e0e0', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
          />
          {busqueda && (
            <button type="button" onClick={() => setBusqueda('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <X size={14} color="#9e9e9e" />
            </button>
          )}
        </div>

        {/* Filtro por mes */}
        {mesesDisponibles.length > 1 && (
          <div style={{ position: 'relative' }}>
            <Calendar size={14} color="#9e9e9e" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <select value={filtroMes} onChange={e => setFiltroMes(e.target.value)}
              style={{ padding: '10px 12px 10px 32px', borderRadius: '12px', border: '1.5px solid #e0e0e0', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#fff', cursor: 'pointer', appearance: 'none', paddingRight: '24px' }}>
              <option value="">Todos los meses</option>
              {mesesDisponibles.map(ym => (
                <option key={ym} value={ym}>{labelMes(ym)}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Lista agrupada por fecha ────────────────────────────────────── */}
      {grupos.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '20px', border: '1.5px solid #f0f0f0', padding: '60px 20px', textAlign: 'center' }}>
          <DollarSign size={36} color="#e0e0e0" />
          <p style={{ margin: '12px 0 0', fontSize: '14px', color: '#bdbdbd', fontWeight: '600' }}>
            {busqueda || filtroMes ? 'Sin resultados para este filtro' : `No hay ${titulo.toLowerCase()} registrados`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {grupos.map((grupo, gi) => (
            <div key={gi} style={{ background: '#fff', borderRadius: '16px', border: '1.5px solid #f0f0f0', overflow: 'hidden' }}>
              {/* Encabezado del grupo (fecha) */}
              <div style={{ padding: '10px 16px', background: COLBG, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: COLOR }}>
                  {grupo.label}
                </span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: COLOR }}>
                  {signo}{fmt(grupo.items.reduce((s, m) => s + (m.monto || 0), 0))}
                </span>
              </div>

              {/* Movimientos del día */}
              {grupo.items.map((m, mi) => (
                <div key={mi} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                  borderBottom: mi < grupo.items.length - 1 ? '1px solid #f5f5f5' : 'none',
                }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: COLBG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icono size={17} color={COLOR} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.descripcion || m.categoria || titulo}
                    </p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#9e9e9e' }}>
                      {m.categoria || ''}
                      {m.metodoPago ? (m.categoria ? ' · ' : '') + m.metodoPago : ''}
                    </p>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: '900', color: COLOR, flexShrink: 0 }}>
                    {signo}{fmt(m.monto)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
