import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, LogOut, Loader2, FileText, ClipboardList,
  PackageCheck, Users, BarChart3, Bell, Settings, ChevronRight,
  Contact, HelpCircle, Phone, ExternalLink, Menu, X, Plus,
  Activity, Shield, ArrowUpCircle, ArrowDownCircle, Package,
  Wallet, TrendingUp
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import CrearFactura from './facturas/CrearFactura';
import CrearCotizacion from './cotizaciones/CrearCotizacion';
import CrearRemision from './remisiones/CrearRemision';
import ListaFactura from './facturas/ListaFactura';
import ListaCotizacion from './cotizaciones/ListaCotizacion';
import ListaRemision from './remisiones/ListaRemision';
import CrearCliente from './clientes/CrearCliente';
import ListaClientes from './clientes/ListaClientes';
import CrearGasto from './movimientos/CrearGasto';
import CrearIngreso from './movimientos/CrearIngreso';
import Inventario from './inventario/Inventario';
import Balance from './balance/Balance';
import Configuracion from './configuracion/Configuracion';
import Notificaciones from './notificaciones/Notificaciones';
import config from '../config';
import { jwtDecode } from 'jwt-decode';

const G = '#2E7D32';
const G2 = '#1B5E20';
const G3 = '#4CAF50';
const GL = '#E8F5E9';

const Home = () => {
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('dashboard');
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [userData, setUserData] = useState({ name: 'Usuario', role: 'Administrador' });
  const [movimientos, setMovimientos] = useState([]);
  const [resumen, setResumen] = useState({ saldo: 0, ingresos: 0, gastos: 0 });
  const [facturas, setFacturas] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [remisiones, setRemisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [vistaFactura, setVistaFactura] = useState('lista');
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [vistaCotizacion, setVistaCotizacion] = useState('lista');
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);
  const [vistaRemision, setVistaRemision] = useState('lista');
  const [remisionSeleccionada, setRemisionSeleccionada] = useState(null);
  const [vistaCliente, setVistaCliente] = useState('lista');

  const BASE_URL = config.API_URL;

  const getUserId = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded.id || decoded._id || decoded.sub;
    } catch {
      const userObj = JSON.parse(localStorage.getItem('user') || '{}');
      return userObj?._id || userObj?.id || null;
    }
  }, []);

  const axiosAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: 'Bearer ' + token } };
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      const cfg = axiosAuth();
      const [resMov, resResumen, resFacturas, resClientes, resCotiz, resRem] = await Promise.all([
        axios.get(BASE_URL + '/movimientos', cfg).catch(() => ({ data: [] })),
        axios.get(BASE_URL + '/resumen', cfg).catch(() => ({ data: { saldo: 0, ingresos: 0, gastos: 0 } })),
        axios.get(BASE_URL + '/facturas', cfg).catch(() => ({ data: [] })),
        axios.get(BASE_URL + '/clientes', cfg).catch(() => ({ data: [] })),
        axios.get(BASE_URL + '/cotizaciones', cfg).catch(() => ({ data: [] })),
        axios.get(BASE_URL + '/remisiones', cfg).catch(() => ({ data: [] })),
      ]);
      setMovimientos(resMov.data);
      setResumen(resResumen.data);
      setFacturas(resFacturas.data);
      setClientes(resClientes.data);
      setCotizaciones(resCotiz.data);
      setRemisiones(resRem.data);
      try {
        const decoded = jwtDecode(token);
        if (decoded.nombre || decoded.username) {
          setUserData({ name: decoded.nombre || decoded.username, role: decoded.role || 'Administrador' });
        }
      } catch {}
      setVistaCliente('lista'); setVistaFactura('lista'); setVistaCotizacion('lista'); setVistaRemision('lista');
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const banners = [
    { title: 'Facturacion inteligente', desc: 'Crea y gestiona facturas con estandares legales automaticos y calculo de IVA en tiempo real.', icon: FileText, img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800' },
    { title: 'Control financiero total', desc: 'Monitorea ingresos, gastos y flujo de caja desde un solo panel centralizado y sincronizado.', icon: BarChart3, img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800' },
    { title: 'Seguridad empresarial', desc: 'Tus datos cifrados en servidores propios. Acceso desde web y app movil con sesion segura.', icon: Shield, img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800' },
  ];

  useEffect(() => {
    fetchData();
    const int = setInterval(() => setCurrentBanner(p => (p + 1) % banners.length), 5000);
    return () => clearInterval(int);
  }, []);

  const buildChartData = () => {
    const hoy = new Date();
    const lunes = new Date(hoy);
    const diaSemana = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1;
    lunes.setDate(hoy.getDate() - diaSemana);
    lunes.setHours(0, 0, 0, 0);

    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return days.map((d, i) => {
      const diaInicio = new Date(lunes);
      diaInicio.setDate(lunes.getDate() + i);
      const diaFin = new Date(diaInicio);
      diaFin.setDate(diaInicio.getDate() + 1);

      const dayMovs = movimientos.filter(m => {
        const f = new Date(m.fecha || m.createdAt);
        return f >= diaInicio && f < diaFin;
      });
      const ing = dayMovs.filter(m => m.tipo === 'ingreso').reduce((a, m) => a + (m.monto || 0), 0);
      const gas = dayMovs.filter(m => m.tipo !== 'ingreso').reduce((a, m) => a + (m.monto || 0), 0);
      return { d, ingresos: ing, gastos: gas };
    });
  };
  const chartData = buildChartData();

  const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0);
  const fmtShort = (n) => {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
    return fmt(n);
  };

  const MENU_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'facturas', label: 'Facturacion', icon: FileText },
    { id: 'cotizaciones', label: 'Cotizaciones', icon: ClipboardList },
    { id: 'remisiones', label: 'Remisiones', icon: PackageCheck },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'inventario', label: 'Inventario', icon: Package },
    { id: 'balance', label: 'Balance', icon: Wallet },
    { id: 'estadisticas', label: 'Estadisticas', icon: BarChart3 },
    { id: 'contactos', label: 'Contactos', icon: Contact },
    { id: 'ayuda', label: 'Ayuda', icon: HelpCircle },
    { id: 'logout', label: 'Salir', icon: LogOut, action: () => { localStorage.clear(); window.location.href = '/login'; } },
  ];

  const handleMenuNav = (item) => {
    setSeccionActiva(item.id);
    setSidebarAbierto(false);
    if (item.id === 'facturas') setVistaFactura('lista');
    if (item.id === 'cotizaciones') setVistaCotizacion('lista');
    if (item.id === 'remisiones') setVistaRemision('lista');
  };

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos dias' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

  const handleSaveMovimiento = async (datos) => {
    try {
      const userId = getUserId();
      const cfg = axiosAuth();
      await axios.post(BASE_URL + '/movimientos', { ...datos, userId }, cfg);
      alert((datos.tipo === 'ingreso' ? 'Ingreso' : 'Gasto') + ' registrado correctamente');
      await fetchData();
      setSeccionActiva('balance');
    } catch (e) { alert('Error al registrar: ' + (e.response?.data?.message || e.message)); }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '12px 16px' }}>
          <p style={{ color: '#9e9e9e', fontSize: '12px', margin: '0 0 6px' }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, fontSize: '13px', fontWeight: '700', margin: '2px 0' }}>
              {p.name}: {fmtShort(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: '#F8FAFB' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <img src="/logo.png" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
          </div>
          <Loader2 size={28} style={{ color: G }} className="animate-spin" />
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#1a1a1a' }}>{saludo}, {userData.name.split(' ')[0]} 👋</h1>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#9e9e9e' }}>Resumen financiero de tu negocio</p>
      </div>

      <div className="dash-top-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '24px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(46,125,50,0.15)' }} />
          <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700', color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: '1px' }}>Balance Total</p>
          <h2 style={{ margin: '0 0 16px', fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>{fmtShort(resumen.saldo)}</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#9e9e9e', textTransform: 'uppercase' }}>Ingresos</p>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: G3 }}>{fmtShort(resumen.ingresos)}</p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#9e9e9e', textTransform: 'uppercase' }}>Gastos</p>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#ef5350' }}>{fmtShort(resumen.gastos)}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => setSeccionActiva('ingresos')}
              style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: G, color: '#fff', fontWeight: '800', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontFamily: 'inherit' }}>
              <Plus size={12} /> Ingreso
            </button>
            <button type="button" onClick={() => setSeccionActiva('gastos')}
              style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#ef5350', color: '#fff', fontWeight: '800', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontFamily: 'inherit' }}>
              <Plus size={12} /> Gasto
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'Facturas emitidas', value: facturas.length, total: fmt(facturas.reduce((a, f) => a + (f.total || 0), 0)), icon: FileText, color: G, bg: GL },
            { label: 'Cotizaciones', value: cotizaciones.length, total: fmt(cotizaciones.reduce((a, c) => a + (c.total || 0), 0)), icon: ClipboardList, color: '#1565C0', bg: '#E3F2FD' },
            { label: 'Clientes activos', value: clientes.length, total: remisiones.length + ' remisiones', icon: Users, color: '#6A1B9A', bg: '#F3E5F5' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '12px 16px', border: '1.5px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={16} color={s.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 1px', fontSize: '11px', color: '#9e9e9e', fontWeight: '600' }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#757575', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.total}</p>
              </div>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a1a' }}>{s.value}</span>
            </div>
          ))}
        </div>

        <div style={{ borderRadius: '20px', overflow: 'hidden', position: 'relative', minHeight: '200px' }}>
          {banners.map((b, i) => (
            <div key={i} style={{
              position: 'absolute', inset: 0, transition: 'opacity 0.8s', opacity: i === currentBanner ? 1 : 0,
              backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.75)), url(' + b.img + ')',
              backgroundSize: 'cover', backgroundPosition: 'center',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px',
            }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '800', color: '#fff', lineHeight: '1.2' }}>{b.title}</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.5' }}>{b.desc}</p>
            </div>
          ))}
          <div style={{ position: 'absolute', bottom: '12px', right: '14px', display: 'flex', gap: '5px', zIndex: 10 }}>
            {banners.map((_, i) => (
              <button key={i} type="button" onClick={() => setCurrentBanner(i)}
                style={{ width: i === currentBanner ? '18px' : '6px', height: '6px', borderRadius: '3px', border: 'none', background: i === currentBanner ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
            ))}
          </div>
        </div>
      </div>

      <div className="dash-mid-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '22px', border: '1.5px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1a1a1a' }}>Flujo semanal</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9e9e9e' }}>Ingresos vs gastos</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[{ label: 'Ingresos', color: G }, { label: 'Gastos', color: '#ef5350' }].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: l.color }} />
                  <span style={{ fontSize: '11px', color: '#9e9e9e' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 11, fill: '#9e9e9e' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9e9e9e' }} axisLine={false} tickLine={false} tickFormatter={fmtShort} width={50} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="ingresos" name="Ingresos" fill={G} radius={[5, 5, 0, 0]} barSize={16} />
                <Bar dataKey="gastos" name="Gastos" fill="#ef5350" radius={[5, 5, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '800', color: '#1a1a1a' }}>Acciones rapidas</h3>
          {[
            { label: 'Nueva factura', desc: 'Emitir documento', icon: FileText, color: G, action: () => { setSeccionActiva('facturas'); setFacturaSeleccionada(null); setVistaFactura('crear'); } },
            { label: 'Nueva cotizacion', desc: 'Crear propuesta', icon: ClipboardList, color: '#1565C0', action: () => { setSeccionActiva('cotizaciones'); setCotizacionSeleccionada(null); setVistaCotizacion('crear'); } },
            { label: 'Nuevo ingreso', desc: 'Registrar entrada', icon: ArrowUpCircle, color: G, action: () => setSeccionActiva('ingresos') },
            { label: 'Nuevo gasto', desc: 'Registrar egreso', icon: ArrowDownCircle, color: '#ef5350', action: () => setSeccionActiva('gastos') },
          ].map((a, i) => (
            <button key={i} type="button" onClick={a.action}
              style={{ background: '#fff', border: '1.5px solid #f0f0f0', borderRadius: '14px', padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', fontFamily: 'inherit' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: a.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <a.icon size={16} color={a.color} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#1a1a1a' }}>{a.label}</p>
                <p style={{ margin: 0, fontSize: '10px', color: '#9e9e9e' }}>{a.desc}</p>
              </div>
              <ChevronRight size={14} color="#e0e0e0" />
            </button>
          ))}
        </div>
      </div>

      <div className="dash-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '22px', border: '1.5px solid #f0f0f0' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1a1a1a' }}>Tendencia ingresos</h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9e9e9e' }}>Esta semana</p>
          </div>
          <div style={{ height: '150px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={G} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={G} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 11, fill: '#9e9e9e' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9e9e9e' }} axisLine={false} tickLine={false} tickFormatter={fmtShort} width={50} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke={G} strokeWidth={2.5} fill="url(#gfill)" dot={{ fill: G, strokeWidth: 0, r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '20px', padding: '22px', border: '1.5px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1a1a1a' }}>Actividad reciente</h3>
            <Activity size={15} color="#9e9e9e" />
          </div>
          {movimientos.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {movimientos.slice(0, 5).map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: '#F9FAFB', borderRadius: '11px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: m.tipo === 'ingreso' ? GL : '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {m.tipo === 'ingreso' ? <ArrowUpCircle size={14} color={G} /> : <ArrowDownCircle size={14} color="#ef5350" />}
                  </div>
                  <span style={{ flex: 1, fontSize: '12px', color: '#424242', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.descripcion || m.categoria || (m.tipo === 'ingreso' ? 'Ingreso' : 'Gasto')}</span>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: m.tipo === 'ingreso' ? G : '#ef5350', flexShrink: 0 }}>
                    {m.tipo === 'ingreso' ? '+' : '-'}{fmtShort(m.monto)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <Activity size={28} color="#e0e0e0" />
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#bdbdbd' }}>Sin movimientos registrados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderEstadisticas = () => (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div className="dash-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
        {[
          { label: 'Total facturado', value: fmt(facturas.reduce((a, f) => a + (f.total || 0), 0)), sub: facturas.length + ' documentos', icon: FileText, color: G, bg: GL },
          { label: 'Cotizaciones', value: fmt(cotizaciones.reduce((a, c) => a + (c.total || 0), 0)), sub: cotizaciones.length + ' propuestas', icon: ClipboardList, color: '#1565C0', bg: '#E3F2FD' },
          { label: 'Remisiones', value: remisiones.length, sub: 'Entregas realizadas', icon: PackageCheck, color: '#E65100', bg: '#FFF3E0' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '20px', padding: '22px', border: '1.5px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#9e9e9e' }}>{s.label}</p>
              <p style={{ margin: '0 0 2px', fontSize: '20px', fontWeight: '900', color: '#1a1a1a' }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#bdbdbd' }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '26px', border: '1.5px solid #f0f0f0' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '800', color: '#1a1a1a' }}>Rendimiento comercial</h3>
        <p style={{ margin: '0 0 20px', fontSize: '12px', color: '#9e9e9e' }}>Comparativa de totales</p>
        <div style={{ height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Facturas', valor: facturas.reduce((a, f) => a + (f.total || 0), 0) },
              { name: 'Cotizaciones', valor: cotizaciones.reduce((a, c) => a + (c.total || 0), 0) },
              { name: 'Remisiones', valor: remisiones.length * 100000 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 13, fill: '#9e9e9e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9e9e9e' }} axisLine={false} tickLine={false} tickFormatter={fmtShort} width={60} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="valor" name="Total" fill={G} radius={[10, 10, 0, 0]} barSize={70} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .eva-sidebar { width: 250px; background-color: #1a1a1a; display: flex; flex-direction: column; flex-shrink: 0; z-index: 100; transition: transform 0.3s ease; }
        @media (max-width: 768px) {
          .eva-sidebar { position: fixed !important; top: 0 !important; left: 0 !important; height: 100% !important; width: 280px !important; z-index: 400 !important; transform: translateX(-100%) !important; box-shadow: 4px 0 20px rgba(0,0,0,0.3); }
          .eva-sidebar.open { transform: translateX(0) !important; }
          .eva-hamburger { display: flex !important; }
          .eva-main-content { padding: 14px !important; }
          .dash-top-grid { grid-template-columns: 1fr !important; }
          .dash-mid-grid { grid-template-columns: 1fr !important; }
          .dash-bottom-grid { grid-template-columns: 1fr !important; }
          .dash-stats-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) { .eva-hamburger { display: none !important; } }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#F8FAFB', fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: 'hidden' }}>

        {sidebarAbierto && (
          <div onClick={() => setSidebarAbierto(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300 }} />
        )}

        <aside className={'eva-sidebar' + (sidebarAbierto ? ' open' : '')}>
          <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src="/logo.png" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
            </div>
            <span style={{ fontSize: '20px', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>EVA.</span>
            <button type="button" onClick={() => setSidebarAbierto(false)}
              style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              className="eva-hamburger">
              <X size={16} color="rgba(255,255,255,0.7)" />
            </button>
          </div>
          <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
            {MENU_ITEMS.map(item => {
              const active = seccionActiva === item.id;
              return (
                <button key={item.id} type="button" onClick={item.action ? item.action : () => handleMenuNav(item)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '11px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer', marginBottom: '3px', background: active ? G : 'transparent', fontFamily: 'inherit' }}>
                  <item.icon size={18} style={{ color: active ? '#fff' : 'rgba(255,255,255,0.45)', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: active ? '#fff' : 'rgba(255,255,255,0.55)', marginLeft: '12px' }}>{item.label}</span>
                  {active && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />}
                </button>
              );
            })}
          </nav>
          <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '900', color: '#fff', flexShrink: 0 }}>
                {userData.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userData.name}</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0, textTransform: 'uppercase' }}>{userData.role}</p>
              </div>
            </div>
          </div>
        </aside>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <header style={{ height: '60px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1.5px solid #f0f0f0', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button type="button" onClick={() => setSidebarAbierto(true)} className="eva-hamburger"
                style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#F5F5F5', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                <Menu size={18} color="#424242" />
              </button>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1a1a1a', textTransform: 'capitalize' }}>{seccionActiva}</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => setSeccionActiva('notificaciones')}
                style={{ position: 'relative', width: '34px', height: '34px', background: '#F5F5F5', border: 'none', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Bell size={16} color="#9e9e9e" />
                <div style={{ position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px', borderRadius: '50%', background: '#ef5350', border: '1.5px solid #fff' }} />
              </button>
              <button type="button" onClick={() => setSeccionActiva('configuracion')}
                style={{ width: '34px', height: '34px', background: '#F5F5F5', border: 'none', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Settings size={16} color="#9e9e9e" />
              </button>
            </div>
          </header>

          <main className="eva-main-content" style={{ flex: 1, padding: '24px 28px', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>

            {seccionActiva === 'dashboard' ? renderDashboard()

            : seccionActiva === 'ingresos' ? (
              <CrearIngreso onBack={() => setSeccionActiva('dashboard')} onSave={handleSaveMovimiento} />

            ) : seccionActiva === 'gastos' ? (
              <CrearGasto onBack={() => setSeccionActiva('dashboard')} onSave={handleSaveMovimiento} />

            ) : seccionActiva === 'balance' ? (
              <Balance movimientos={movimientos} resumen={resumen} />

            ) : seccionActiva === 'inventario' ? (
              <Inventario />

            ) : seccionActiva === 'configuracion' ? (
              <Configuracion onBack={() => setSeccionActiva('dashboard')} userData={userData} />

            ) : seccionActiva === 'notificaciones' ? (
              <Notificaciones onBack={() => setSeccionActiva('dashboard')} />

            ) : seccionActiva === 'facturas' ? (
              vistaFactura === 'lista' ? (
                <ListaFactura facturas={facturas} onSeleccionar={f => { setFacturaSeleccionada(f); setVistaFactura('crear'); }} onNueva={() => { setFacturaSeleccionada(null); setVistaFactura('crear'); }} />
              ) : (
                <CrearFactura listaDeClientes={clientes} facturaAEditar={facturaSeleccionada}
                  onNuevoCliente={() => { setSeccionActiva('clientes'); setClienteSeleccionado(null); setVistaCliente('crear'); }}
                  onBack={() => { setFacturaSeleccionada(null); setVistaFactura('lista'); }}
                  onDelete={async id => {
                    if (!window.confirm('Eliminar esta factura?')) return;
                    try { await axios.delete(BASE_URL + '/facturas/' + id, axiosAuth()); alert('Factura eliminada'); setFacturaSeleccionada(null); setVistaFactura('lista'); await fetchData(); }
                    catch (e) { alert('Error: ' + (e.response?.data?.message || e.message)); }
                  }}
                  onSave={async d => {
                    try {
                      const token = localStorage.getItem('token');
                      if (!token) { navigate('/login'); return; }
                      const userId = getUserId(); if (!userId) { alert('Sesion invalida'); return; }
                      const cfg = axiosAuth();
                      const clienteEncontrado = clientes.find(c => c.nombre === d.cliente);
                      const clienteId = clienteEncontrado?._id || clienteEncontrado?.id || null;
                      if (!d.cliente?.trim()) { alert('Selecciona un cliente.'); return; }
                      const costoPorUnidad = Number(d.costoPorUnidad) || 0;
                      const cantidad = Number(d.cantidad) || 1;
                      const descPorc = Number(d.descPorc) || 0;
                      const ivaPorc = Number(d.ivaPorc) || 0;
                      const totalBruto = costoPorUnidad * cantidad;
                      const subtotal = totalBruto - totalBruto * (descPorc / 100);
                      const valorNeto = subtotal + subtotal * (ivaPorc / 100);
                      const itemPayload = { descripcion: d.descripcion || '', cantidad, precioUnitario: costoPorUnidad, total: totalBruto };
                      if (d._id) {
                        await axios.put(BASE_URL + '/facturas/' + d._id, { numero: d.numero || 'FAC-' + Date.now(), clienteId, clienteNombre: d.cliente, subtotal, iva: ivaPorc, total: valorNeto, items: [itemPayload], estado: facturaSeleccionada?.estado || 'pendiente' }, cfg);
                        alert('Factura actualizada');
                      } else {
                        await axios.post(BASE_URL + '/facturas', { numero: 'FAC-' + Date.now(), clienteId, clienteNombre: d.cliente, subtotal, iva: ivaPorc, total: valorNeto, userId, items: [itemPayload], estado: 'pendiente' }, cfg);
                        alert('Factura creada correctamente');
                      }
                      await fetchData(); setFacturaSeleccionada(null); setVistaFactura('lista');
                    } catch (e) { alert('Error: ' + (e.response?.data?.message || e.message)); }
                  }} />
              )

            ) : seccionActiva === 'cotizaciones' ? (
              vistaCotizacion === 'lista' ? (
                <ListaCotizacion cotizaciones={cotizaciones} onSeleccionar={c => { setCotizacionSeleccionada(c); setVistaCotizacion('crear'); }} onNueva={() => { setCotizacionSeleccionada(null); setVistaCotizacion('crear'); }} />
              ) : (
                <CrearCotizacion listaDeClientes={clientes} cotizacionAEditar={cotizacionSeleccionada}
                  onNuevoCliente={() => { setSeccionActiva('clientes'); setClienteSeleccionado(null); setVistaCliente('crear'); }}
                  onBack={() => { setCotizacionSeleccionada(null); setVistaCotizacion('lista'); }}
                  onDelete={async id => { if (!window.confirm('Eliminar?')) return; try { await axios.delete(BASE_URL + '/cotizaciones/' + id, axiosAuth()); alert('Cotizacion eliminada'); setCotizacionSeleccionada(null); setVistaCotizacion('lista'); await fetchData(); } catch (e) { alert('Error'); } }}
                  onSave={async d => {
                    try {
                      const userId = getUserId(); if (!userId) { alert('Sesion invalida'); return; }
                      const cfg = axiosAuth();
                      const clienteEncontrado = clientes.find(c => c.nombre === d.cliente);
                      const clienteId = clienteEncontrado?._id || clienteEncontrado?.id || null;
                      if (!d.cliente?.trim()) { alert('Selecciona un cliente.'); return; }
                      const cant = Number(d.cantidad) || 0; const pu = Number(d.valorUnitario) || 0; const lineTotal = cant * pu;
                      const numero = (d.numeroCotizacion || '').trim() || 'COT-' + Date.now();
                      const itemPayload = { descripcion: d.descripcion, cantidad: cant, precioUnitario: pu, total: lineTotal };
                      if (d._id) { await axios.put(BASE_URL + '/cotizaciones/' + d._id, { numero: (d.numeroCotizacion || '').trim() || d.numero, clienteId, clienteNombre: d.cliente, subtotal: lineTotal, iva: 0, total: lineTotal, items: [itemPayload], estado: cotizacionSeleccionada?.estado || 'pendiente' }, cfg); alert('Cotizacion actualizada'); }
                      else { await axios.post(BASE_URL + '/cotizaciones', { numero, clienteId, clienteNombre: d.cliente, subtotal: lineTotal, iva: 0, total: lineTotal, userId, items: [itemPayload] }, cfg); alert('Cotizacion creada'); }
                      await fetchData(); setCotizacionSeleccionada(null); setVistaCotizacion('lista');
                    } catch (e) { alert('Error: ' + (e.response?.data?.message || e.message)); }
                  }} />
              )

            ) : seccionActiva === 'remisiones' ? (
              vistaRemision === 'lista' ? (
                <ListaRemision remisiones={remisiones} onSeleccionar={r => { setRemisionSeleccionada(r); setVistaRemision('crear'); }} onNueva={() => { setRemisionSeleccionada(null); setVistaRemision('crear'); }} />
              ) : (
                <CrearRemision listaDeClientes={clientes} remisionAEditar={remisionSeleccionada}
                  onNuevoCliente={() => { setSeccionActiva('clientes'); setClienteSeleccionado(null); setVistaCliente('crear'); }}
                  onBack={() => { setRemisionSeleccionada(null); setVistaRemision('lista'); }}
                  onDelete={async id => { if (!window.confirm('Eliminar?')) return; try { await axios.delete(BASE_URL + '/remisiones/' + id, axiosAuth()); alert('Remision eliminada'); setRemisionSeleccionada(null); setVistaRemision('lista'); await fetchData(); } catch (e) { alert('Error'); } }}
                  onSave={async d => {
                    try {
                      const userId = getUserId(); if (!userId) { alert('Sesion invalida'); return; }
                      const cfg = axiosAuth();
                      const clienteEncontrado = clientes.find(c => c.nombre === d.cliente);
                      const clienteId = clienteEncontrado?._id || clienteEncontrado?.id || null;
                      if (!d.cliente?.trim()) { alert('Selecciona un cliente.'); return; }
                      const cant = Number(d.cantidad) || 0; const pu = Number(d.valorUnitario) || 0; const lineTotal = cant * pu;
                      const numero = (d.numeroRemision || '').trim() || 'REM-' + Date.now();
                      const itemPayload = { descripcion: d.descripcion, cantidad: cant, precioUnitario: pu, total: lineTotal };
                      if (d._id) { await axios.put(BASE_URL + '/remisiones/' + d._id, { numero: (d.numeroRemision || '').trim() || d.numero, clienteId, clienteNombre: d.cliente, direccionEntrega: remisionSeleccionada?.direccionEntrega || '', items: [itemPayload], estado: remisionSeleccionada?.estado || 'pendiente' }, cfg); alert('Remision actualizada'); }
                      else { await axios.post(BASE_URL + '/remisiones', { numero, clienteId, clienteNombre: d.cliente, items: [itemPayload], userId }, cfg); alert('Remision creada'); }
                      await fetchData(); setRemisionSeleccionada(null); setVistaRemision('lista');
                    } catch (e) { alert('Error: ' + (e.response?.data?.message || e.message)); }
                  }} />
              )

            ) : seccionActiva === 'clientes' ? (
              vistaCliente === 'lista' ? (
                <ListaClientes clientes={clientes} onNuevo={() => { setClienteSeleccionado(null); setVistaCliente('crear'); }} onEdit={c => { setClienteSeleccionado(c); setVistaCliente('crear'); }} />
              ) : (
                <CrearCliente
                  clienteAEditar={clienteSeleccionado ? { ...clienteSeleccionado, cedulaOrNit: String(clienteSeleccionado.nit ?? clienteSeleccionado.cedulaOrNit ?? '') } : null}
                  onBack={() => { setVistaCliente('lista'); setClienteSeleccionado(null); }}
                  onSave={async datos => {
                    try {
                      const cfg = axiosAuth(); const userId = getUserId();
                      const payload = { nombre: datos.nombre, nit: Number(datos.cedulaOrNit), ciudad: datos.ciudad, actividadEconomica: datos.actividadEconomica, telefono: datos.telefono, email: datos.email, direccion: datos.direccion, tipo: 'natural', userId };
                      if (clienteSeleccionado) { await axios.put(BASE_URL + '/clientes/' + clienteSeleccionado._id, payload, cfg); alert('Cliente actualizado'); }
                      else { await axios.post(BASE_URL + '/clientes', payload, cfg); alert('Cliente guardado'); }
                      await fetchData(); setVistaCliente('lista'); setClienteSeleccionado(null);
                    } catch (e) { alert('Error: ' + (e.response?.data?.message || 'Servidor no responde')); }
                  }}
                  onDelete={async id => {
                    if (window.confirm('Eliminar este cliente?')) {
                      try { await axios.delete(BASE_URL + '/clientes/' + id, axiosAuth()); alert('Cliente eliminado'); await fetchData(); setVistaCliente('lista'); setClienteSeleccionado(null); }
                      catch (e) { alert('Error al eliminar'); }
                    }
                  }} />
              )

            ) : seccionActiva === 'estadisticas' ? renderEstadisticas()

            : seccionActiva === 'contactos' ? (
              <div style={{ maxWidth: '560px', margin: '0 auto' }}>
                <div style={{ background: '#fff', borderRadius: '24px', padding: '40px 32px', border: '1.5px solid #f0f0f0', textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '22px', background: G, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '900', color: '#fff' }}>BZ</div>
                  <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: '800', color: '#1a1a1a' }}>Bayron Zamudio Santafe</h2>
                  <p style={{ margin: '0 0 24px', fontSize: '13px', color: G, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Disenador y Full Stack Developer</p>
                  <div style={{ background: '#F9FAFB', borderRadius: '14px', padding: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: GL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Phone size={17} color={G} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#9e9e9e', fontWeight: '700', textTransform: 'uppercase' }}>WhatsApp / Celular</p>
                      <p style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1a1a1a' }}>322 679 8678</p>
                    </div>
                  </div>
                  <button onClick={() => window.open('https://wa.me/573226798678', '_blank')}
                    style={{ width: '100%', padding: '13px', borderRadius: '13px', border: 'none', background: G, color: '#fff', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit' }}>
                    Hablar por WhatsApp <ExternalLink size={15} />
                  </button>
                </div>
              </div>

            ) : seccionActiva === 'ayuda' ? (
              <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <h2 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: '800', color: '#1a1a1a' }}>Centro de ayuda</h2>
                  <p style={{ margin: 0, fontSize: '14px', color: '#9e9e9e' }}>Como podemos ayudarte con EVA?</p>
                </div>
                <div style={{ background: '#fff', borderRadius: '20px', padding: '26px', border: '1.5px solid #f0f0f0', marginBottom: '14px' }}>
                  <h3 style={{ margin: '0 0 18px', fontSize: '15px', fontWeight: '800', color: '#1a1a1a' }}>Preguntas frecuentes</h3>
                  {[
                    { q: 'Como crear mi primera factura?', a: 'Ve a Facturacion y haz clic en Nueva factura. Asegurate de tener clientes creados primero.' },
                    { q: 'Como registro un gasto?', a: 'Desde el Dashboard, clic en el boton rojo + Gasto, o ve al menu lateral en Balance.' },
                    { q: 'Como sincroniza con la app movil?', a: 'Los datos se sincronizan automaticamente. La app usa el mismo servidor (Railway) y base de datos (MongoDB Atlas).' },
                    { q: 'Puedo imprimir facturas?', a: 'Si. Abre cualquier factura y usa el boton Imprimir. Se genera un documento con formato legal colombiano.' },
                  ].map((item, i, arr) => (
                    <div key={i} style={{ padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                      <p style={{ margin: '0 0 5px', fontSize: '13px', fontWeight: '700', color: '#1a1a1a' }}>{item.q}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#9e9e9e', lineHeight: '1.6' }}>{item.a}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: G, borderRadius: '20px', padding: '26px', textAlign: 'center', color: '#fff' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: '800' }}>Necesitas mas ayuda?</h4>
                  <p style={{ margin: '0 0 18px', fontSize: '13px', opacity: 0.8 }}>Soporte disponible Lunes a Viernes, 8am a 6pm</p>
                  <button onClick={() => setSeccionActiva('contactos')}
                    style={{ background: '#fff', color: G, border: 'none', padding: '11px 26px', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Contactar soporte
                  </button>
                </div>
              </div>

            ) : (
              <div style={{ padding: '60px', textAlign: 'center', color: '#bdbdbd', fontSize: '15px', fontWeight: '700' }}>
                Modulo en desarrollo
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;