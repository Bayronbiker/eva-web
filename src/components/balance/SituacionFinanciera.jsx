import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  TrendingUp, DollarSign, CreditCard, Building2, Package,
  Users, Plus, Trash2, Save, ChevronRight, Loader2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import config from '../../config';

const PALETA_CLARA = {
  bg: '#F8FAFB', card: '#FFFFFF', surface: '#F9FAFB', texto: '#1a1a1a',
  textoMuted: '#9e9e9e', borde: '#f0f0f0', bordeInput: '#e0e0e0',
  verde: '#2E7D32', verdeHover: '#1B5E20', verdeBg: '#E8F5E9',
  rojo: '#ef5350', rojoBg: '#FFEBEE', azul: '#1565C0', azulBg: '#E3F2FD',
  morado: '#6A1B9A', moradoBg: '#F3E5F5', hover: '#F5F5F5',
};
const PALETA_OSCURA = {
  bg: '#0D1117', card: '#161B22', surface: '#21262D', texto: '#E6EDF3',
  textoMuted: '#7D8590', borde: '#30363D', bordeInput: '#30363D',
  verde: '#3FB950', verdeHover: '#2EA043', verdeBg: '#0D2818',
  rojo: '#F85149', rojoBg: '#3D1A1A', azul: '#58A6FF', azulBg: '#0D1F35',
  morado: '#BC8CFF', moradoBg: '#1F0D35', hover: '#262C36',
};

const BASE_URL = config.API_URL;
const axiosAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const fmtCOP = (val) => {
  const n = Number(val) || 0;
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
};

const inputStyle = (p) => ({
  width: '100%', padding: '9px 12px', borderRadius: 7,
  border: `1px solid ${p.bordeInput}`, background: p.bg,
  color: p.texto, fontSize: 13, outline: 'none', boxSizing: 'border-box',
});

// ── Sección expandible ────────────────────────────────────────────────────────
function Seccion({ titulo, icono: Icono, colorFondo, colorTexto, total, children }) {
  const [abierto, setAbierto] = useState(true);
  const { theme } = useTheme();
  const p = theme === 'dark' ? PALETA_OSCURA : PALETA_CLARA;
  return (
    <div style={{ background: p.card, borderRadius: 12, border: `1px solid ${p.borde}`, overflow: 'hidden', marginBottom: 16 }}>
      <div
        onClick={() => setAbierto(v => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', cursor: 'pointer', background: colorFondo, userSelect: 'none' }}
      >
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icono size={18} color={colorTexto} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: colorTexto, textTransform: 'uppercase', letterSpacing: 0.5 }}>{titulo}</p>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: colorTexto }}>{fmtCOP(total)}</p>
        </div>
        <ChevronRight size={18} color={colorTexto} style={{ transform: abierto ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </div>
      {abierto && <div style={{ padding: '16px 20px' }}>{children}</div>}
    </div>
  );
}

// ── Fila de datos simples ─────────────────────────────────────────────────────
function FilaDato({ label, valor, color, p }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${p.borde}` }}>
      <span style={{ fontSize: 14, color: p.textoMuted }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: color || p.texto }}>{fmtCOP(valor)}</span>
    </div>
  );
}

// ── Campo editable inline ─────────────────────────────────────────────────────
function CampoEditable({ label, valor, onChange, p, tipo = 'number', placeholder = '0' }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 12, color: p.textoMuted, display: 'block', marginBottom: 4 }}>{label}</label>
      <input
        type={tipo}
        value={valor}
        onChange={e => onChange(tipo === 'number' ? Number(e.target.value) || 0 : e.target.value)}
        placeholder={placeholder}
        style={inputStyle(p)}
      />
    </div>
  );
}

// ── Principal ─────────────────────────────────────────────────────────────────
export default function SituacionFinanciera({ movimientos, onNavigate }) {
  const { theme } = useTheme();
  const p = theme === 'dark' ? PALETA_OSCURA : PALETA_CLARA;

  // Estado remoto
  const [sf, setSf] = useState({
    efectivo: 0, otrosActivos: 0, activosFijos: [],
    otrosPasivos: 0, obligacionesBancos: [],
  });
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  // Estado local de los formularios de activos fijos y obligaciones
  const [nuevoAF, setNuevoAF] = useState({ nombre: '', descripcion: '', precio: '' });
  const [nuevaOB, setNuevaOB] = useState({ fechaDesembolso: '', nombreBanco: '', valorTotal: '', numeroCuotas: '', valorAPagar: '' });
  const [mostrarFormAF, setMostrarFormAF] = useState(false);
  const [mostrarFormOB, setMostrarFormOB] = useState(false);

  // Cargar desde API
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/situacion-financiera`, axiosAuth());
        setSf({
          efectivo: data.efectivo || 0,
          otrosActivos: data.otrosActivos || 0,
          activosFijos: data.activosFijos || [],
          otrosPasivos: data.otrosPasivos || 0,
          obligacionesBancos: data.obligacionesBancos || [],
        });
      } catch { /* silencioso — usa valores por defecto */ }
      finally { setLoading(false); }
    })();
  }, []);

  // ── Cálculos derivados ──────────────────────────────────────────────────────
  const totalActivosFijos = useMemo(() => sf.activosFijos.reduce((s, af) => s + (Number(af.precio) || 0), 0), [sf.activosFijos]);
  const totalActivos      = useMemo(() => sf.efectivo + totalActivosFijos + sf.otrosActivos, [sf.efectivo, totalActivosFijos, sf.otrosActivos]);
  const totalObligaciones = useMemo(() => sf.obligacionesBancos.reduce((s, ob) => s + (Number(ob.valorAPagar) || 0), 0), [sf.obligacionesBancos]);
  const totalPasivos      = useMemo(() => totalObligaciones + sf.otrosPasivos, [totalObligaciones, sf.otrosPasivos]);
  const capital           = useMemo(() => totalActivos - totalPasivos, [totalActivos, totalPasivos]);

  const hoy = useMemo(() => new Date(), []);
  const inicioAnio = useMemo(() => new Date(hoy.getFullYear(), 0, 1).getTime(), [hoy]);

  const utilidadAcumulada = useMemo(() => {
    return (movimientos || [])
      .filter(m => new Date(m.fecha).getFullYear() === hoy.getFullYear())
      .reduce((s, m) => m.tipo === 'ingreso' ? s + m.monto : s - m.monto, 0);
  }, [movimientos, hoy]);

  const utilidadDiaria = useMemo(() => {
    const hoyStr = hoy.toISOString().slice(0, 10);
    return (movimientos || [])
      .filter(m => new Date(m.fecha).toISOString().slice(0, 10) === hoyStr)
      .reduce((s, m) => m.tipo === 'ingreso' ? s + m.monto : s - m.monto, 0);
  }, [movimientos, hoy]);

  // ── Guardar en API ──────────────────────────────────────────────────────────
  const guardar = async () => {
    setGuardando(true);
    try {
      await axios.put(`${BASE_URL}/situacion-financiera`, sf, axiosAuth());
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2500);
    } catch { alert('Error guardando los datos'); }
    finally { setGuardando(false); }
  };

  // ── Activos fijos — agregar / eliminar ─────────────────────────────────────
  const agregarAF = () => {
    if (!nuevoAF.nombre.trim() || !nuevoAF.precio) return;
    setSf(prev => ({ ...prev, activosFijos: [...prev.activosFijos, { nombre: nuevoAF.nombre, descripcion: nuevoAF.descripcion, precio: Number(nuevoAF.precio) }] }));
    setNuevoAF({ nombre: '', descripcion: '', precio: '' });
    setMostrarFormAF(false);
  };
  const eliminarAF = (idx) => setSf(prev => ({ ...prev, activosFijos: prev.activosFijos.filter((_, i) => i !== idx) }));

  // ── Obligaciones bancarias — agregar / eliminar ────────────────────────────
  const agregarOB = () => {
    if (!nuevaOB.nombreBanco.trim() || !nuevaOB.valorAPagar) return;
    setSf(prev => ({ ...prev, obligacionesBancos: [...prev.obligacionesBancos, { fechaDesembolso: nuevaOB.fechaDesembolso, nombreBanco: nuevaOB.nombreBanco, valorTotal: Number(nuevaOB.valorTotal), numeroCuotas: Number(nuevaOB.numeroCuotas), valorAPagar: Number(nuevaOB.valorAPagar) }] }));
    setNuevaOB({ fechaDesembolso: '', nombreBanco: '', valorTotal: '', numeroCuotas: '', valorAPagar: '' });
    setMostrarFormOB(false);
  };
  const eliminarOB = (idx) => setSf(prev => ({ ...prev, obligacionesBancos: prev.obligacionesBancos.filter((_, i) => i !== idx) }));

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <Loader2 size={32} color={p.verde} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', paddingBottom: 60 }}>

      {/* Resumen Patrimonio en el top */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Activos', valor: totalActivos, bg: p.verdeBg, color: p.verde, icono: TrendingUp },
          { label: 'Total Pasivos', valor: totalPasivos, bg: p.rojoBg, color: p.rojo, icono: CreditCard },
          { label: 'Capital', valor: capital, bg: capital >= 0 ? p.verdeBg : p.rojoBg, color: capital >= 0 ? p.verde : p.rojo, icono: DollarSign },
        ].map(({ label, valor, bg, color, icono: Ic }) => (
          <div key={label} style={{ background: bg, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Ic size={22} color={color} />
            <div>
              <p style={{ margin: 0, fontSize: 12, color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</p>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color }}>{fmtCOP(valor)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── ACTIVOS ─────────────────────────────────────────────────────────── */}
      <Seccion titulo="Activos" icono={TrendingUp} colorFondo={p.verdeBg} colorTexto={p.verde} total={totalActivos}>

        {/* Efectivo */}
        <CampoEditable label="Efectivo (caja menor manual)" valor={sf.efectivo} onChange={v => setSf(prev => ({ ...prev, efectivo: v }))} p={p} placeholder="0" />

        {/* Clientes — link */}
        <div
          onClick={() => onNavigate && onNavigate('clientes')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${p.borde}`, cursor: 'pointer', marginBottom: 8 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={16} color={p.verde} />
            <span style={{ fontSize: 14, color: p.texto }}>Clientes</span>
          </div>
          <ChevronRight size={16} color={p.textoMuted} />
        </div>

        {/* Inventario — link */}
        <div
          onClick={() => onNavigate && onNavigate('inventario')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${p.borde}`, cursor: 'pointer', marginBottom: 12 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package size={16} color={p.verde} />
            <span style={{ fontSize: 14, color: p.texto }}>Inventario</span>
          </div>
          <ChevronRight size={16} color={p.textoMuted} />
        </div>

        {/* Activos Fijos */}
        <p style={{ margin: '12px 0 8px', fontSize: 13, fontWeight: 600, color: p.textoMuted, textTransform: 'uppercase', letterSpacing: 0.4 }}>Activos Fijos</p>
        {sf.activosFijos.map((af, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${p.borde}` }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 14, color: p.texto, fontWeight: 500 }}>{af.nombre}</p>
              {af.descripcion && <p style={{ margin: 0, fontSize: 12, color: p.textoMuted }}>{af.descripcion}</p>}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: p.verde, marginRight: 12 }}>{fmtCOP(af.precio)}</span>
            <button onClick={() => eliminarAF(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: p.rojo, padding: 4, display: 'flex', alignItems: 'center' }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {totalActivosFijos > 0 && <FilaDato label="Subtotal activos fijos" valor={totalActivosFijos} color={p.verde} p={p} />}

        {!mostrarFormAF ? (
          <button onClick={() => setMostrarFormAF(true)} style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: p.verde, background: 'none', border: `1px dashed ${p.verde}`, borderRadius: 7, padding: '7px 14px', cursor: 'pointer' }}>
            <Plus size={14} /> Agregar activo fijo
          </button>
        ) : (
          <div style={{ marginTop: 12, background: p.surface, borderRadius: 8, padding: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 12, color: p.textoMuted, display: 'block', marginBottom: 4 }}>Nombre *</label>
                <input value={nuevoAF.nombre} onChange={e => setNuevoAF(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Computador portátil" style={inputStyle(p)} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: p.textoMuted, display: 'block', marginBottom: 4 }}>Descripción</label>
                <input value={nuevoAF.descripcion} onChange={e => setNuevoAF(p => ({ ...p, descripcion: e.target.value }))} placeholder="Descripción opcional" style={inputStyle(p)} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: p.textoMuted, display: 'block', marginBottom: 4 }}>Precio *</label>
                <input type="number" value={nuevoAF.precio} onChange={e => setNuevoAF(p => ({ ...p, precio: e.target.value }))} placeholder="0" style={inputStyle(p)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button onClick={() => setMostrarFormAF(false)} style={{ flex: 1, padding: '8px', background: 'none', border: `1px solid ${p.borde}`, borderRadius: 7, cursor: 'pointer', color: p.textoMuted, fontSize: 13 }}>Cancelar</button>
              <button onClick={agregarAF} style={{ flex: 1, padding: '8px', background: p.verde, color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Agregar</button>
            </div>
          </div>
        )}

        {/* Otros activos */}
        <div style={{ marginTop: 16 }}>
          <CampoEditable label="Otros activos" valor={sf.otrosActivos} onChange={v => setSf(prev => ({ ...prev, otrosActivos: v }))} p={p} placeholder="0" />
        </div>
      </Seccion>

      {/* ── PASIVOS ─────────────────────────────────────────────────────────── */}
      <Seccion titulo="Pasivos" icono={CreditCard} colorFondo={p.rojoBg} colorTexto={p.rojo} total={totalPasivos}>

        {/* Proveedores — link */}
        <div
          onClick={() => onNavigate && onNavigate('proveedores')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${p.borde}`, cursor: 'pointer', marginBottom: 8 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 size={16} color={p.rojo} />
            <span style={{ fontSize: 14, color: p.texto }}>Proveedores</span>
          </div>
          <ChevronRight size={16} color={p.textoMuted} />
        </div>

        {/* Obligaciones con bancos */}
        <p style={{ margin: '12px 0 8px', fontSize: 13, fontWeight: 600, color: p.textoMuted, textTransform: 'uppercase', letterSpacing: 0.4 }}>Obligaciones con bancos</p>
        {sf.obligacionesBancos.map((ob, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${p.borde}` }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 14, color: p.texto, fontWeight: 500 }}>{ob.nombreBanco}</p>
              <p style={{ margin: 0, fontSize: 12, color: p.textoMuted }}>
                {ob.numeroCuotas} cuotas · Total: {fmtCOP(ob.valorTotal)}
                {ob.fechaDesembolso && ` · ${new Date(ob.fechaDesembolso).toLocaleDateString('es-CO')}`}
              </p>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: p.rojo, marginRight: 12 }}>{fmtCOP(ob.valorAPagar)}</span>
            <button onClick={() => eliminarOB(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: p.rojo, padding: 4, display: 'flex', alignItems: 'center' }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {totalObligaciones > 0 && <FilaDato label="Subtotal obligaciones" valor={totalObligaciones} color={p.rojo} p={p} />}

        {!mostrarFormOB ? (
          <button onClick={() => setMostrarFormOB(true)} style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: p.rojo, background: 'none', border: `1px dashed ${p.rojo}`, borderRadius: 7, padding: '7px 14px', cursor: 'pointer' }}>
            <Plus size={14} /> Agregar obligación bancaria
          </button>
        ) : (
          <div style={{ marginTop: 12, background: p.surface, borderRadius: 8, padding: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, color: p.textoMuted, display: 'block', marginBottom: 4 }}>Nombre del banco *</label>
                <input value={nuevaOB.nombreBanco} onChange={e => setNuevaOB(p => ({ ...p, nombreBanco: e.target.value }))} placeholder="Ej: Bancolombia" style={inputStyle(p)} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: p.textoMuted, display: 'block', marginBottom: 4 }}>Fecha desembolso</label>
                <input type="date" value={nuevaOB.fechaDesembolso} onChange={e => setNuevaOB(p => ({ ...p, fechaDesembolso: e.target.value }))} style={inputStyle(p)} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: p.textoMuted, display: 'block', marginBottom: 4 }}>Valor total crédito *</label>
                <input type="number" value={nuevaOB.valorTotal} onChange={e => setNuevaOB(p => ({ ...p, valorTotal: e.target.value }))} placeholder="0" style={inputStyle(p)} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: p.textoMuted, display: 'block', marginBottom: 4 }}>Número de cuotas *</label>
                <input type="number" value={nuevaOB.numeroCuotas} onChange={e => setNuevaOB(p => ({ ...p, numeroCuotas: e.target.value }))} placeholder="12" style={inputStyle(p)} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 12, color: p.textoMuted, display: 'block', marginBottom: 4 }}>Valor a pagar (cuota mensual) *</label>
                <input type="number" value={nuevaOB.valorAPagar} onChange={e => setNuevaOB(p => ({ ...p, valorAPagar: e.target.value }))} placeholder="0" style={inputStyle(p)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button onClick={() => setMostrarFormOB(false)} style={{ flex: 1, padding: '8px', background: 'none', border: `1px solid ${p.borde}`, borderRadius: 7, cursor: 'pointer', color: p.textoMuted, fontSize: 13 }}>Cancelar</button>
              <button onClick={agregarOB} style={{ flex: 1, padding: '8px', background: p.rojo, color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Agregar</button>
            </div>
          </div>
        )}

        {/* Otros pasivos */}
        <div style={{ marginTop: 16 }}>
          <CampoEditable label="Otros pasivos" valor={sf.otrosPasivos} onChange={v => setSf(prev => ({ ...prev, otrosPasivos: v }))} p={p} placeholder="0" />
        </div>
      </Seccion>

      {/* ── PATRIMONIO ──────────────────────────────────────────────────────── */}
      <Seccion titulo="Patrimonio" icono={DollarSign} colorFondo={p.azulBg} colorTexto={p.azul} total={capital + utilidadAcumulada}>
        <FilaDato label="Capital (Activos − Pasivos)" valor={capital} color={capital >= 0 ? p.verde : p.rojo} p={p} />
        <FilaDato label={`Utilidad acumulada ${new Date().getFullYear()}`} valor={utilidadAcumulada} color={utilidadAcumulada >= 0 ? p.verde : p.rojo} p={p} />
        <FilaDato label="Utilidad del día de hoy" valor={utilidadDiaria} color={utilidadDiaria >= 0 ? p.verde : p.rojo} p={p} />
      </Seccion>

      {/* Botón guardar */}
      <div style={{ textAlign: 'right', marginTop: 8 }}>
        <button
          onClick={guardar}
          disabled={guardando}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', background: guardado ? p.verdeBg : p.verde,
            color: guardado ? p.verde : '#fff', border: guardado ? `1px solid ${p.verde}` : 'none',
            borderRadius: 10, cursor: guardando ? 'not-allowed' : 'pointer',
            opacity: guardando ? 0.7 : 1, fontSize: 15, fontWeight: 600, transition: 'all 0.3s',
          }}
        >
          {guardando ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
          {guardando ? 'Guardando...' : guardado ? '¡Guardado!' : 'Guardar cambios'}
        </button>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
