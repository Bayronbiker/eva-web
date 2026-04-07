import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, Wallet, ArrowUpCircle, ArrowDownCircle, Leaf, LogOut,
  Loader2, FileText, ClipboardList, PackageCheck, Users, BarChart3,
  Search, Bell, Settings, ChevronRight, Contact, HelpCircle, Phone, ExternalLink, Menu, X
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, AreaChart, Area } from 'recharts';
import CrearFactura from './facturas/CrearFactura';
import CrearCotizacion from './cotizaciones/CrearCotizacion';
import CrearRemision from './remisiones/CrearRemision';
import ListaFactura from './facturas/ListaFactura';
import ListaCotizacion from './cotizaciones/ListaCotizacion';
import ListaRemision from './remisiones/ListaRemision';
import CrearCliente from './clientes/CrearCliente';
import ListaClientes from './clientes/ListaClientes';
import config from '../config';
import { jwtDecode } from 'jwt-decode';

const Home = () => {
  const primaryGreen = '#2E7D32';
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
    return { headers: { Authorization: `Bearer ${token}` } };
  }, []);

  const banners = [
    {
      id: 1,
      title: 'Análisis Inteligente',
      desc: 'Gráficos de última generación.',
      img: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=1000',
      overlay: 'rgba(27, 94, 32, 0.85)',
    },
    {
      id: 2,
      title: 'Facturación 2026',
      desc: 'Estándares legales automáticos.',
      img: 'https://images.unsplash.com/photo-1454165833767-027ffea9e778?q=80&w=1000',
      overlay: 'rgba(46, 125, 50, 0.85)',
    },
    {
      id: 3,
      title: 'Seguridad Total',
      desc: 'Tus datos en tu propio servidor.',
      img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000',
      overlay: 'rgba(67, 160, 71, 0.85)',
    },
  ];

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const cfg = axiosAuth();
      const [resMov, resResumen, resFacturas, resClientes, resCotiz, resRem] = await Promise.all([
        axios.get(`${BASE_URL}/movimientos`, cfg).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/resumen`, cfg).catch(() => ({ data: { saldo: 0, ingresos: 0, gastos: 0 } })),
        axios.get(`${BASE_URL}/facturas`, cfg).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/clientes`, cfg).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/cotizaciones`, cfg).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/remisiones`, cfg).catch(() => ({ data: [] })),
      ]);
      setMovimientos(resMov.data);
      setResumen(resResumen.data);
      setFacturas(resFacturas.data);
      setClientes(resClientes.data);
      setCotizaciones(resCotiz.data);
      setRemisiones(resRem.data);

      setVistaCliente('lista');
      setVistaFactura('lista');
      setVistaCotizacion('lista');
      setVistaRemision('lista');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const int = setInterval(() => setCurrentBanner((p) => (p + 1) % banners.length), 6000);
    return () => clearInterval(int);
  }, []);

  const dataVentas = [
    { n: 'Lun', v: 400 },
    { n: 'Mar', v: 800 },
    { n: 'Mie', v: 600 },
    { n: 'Jue', v: 1100 },
    { n: 'Vie', v: 900 },
    { n: 'Sab', v: 1600 },
  ];

  const MENU_ITEMS = [
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'facturas', label: 'Facturación', icon: FileText },
    { id: 'cotizaciones', label: 'Cotizaciones', icon: ClipboardList },
    { id: 'remisiones', label: 'Remisiones', icon: PackageCheck },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'contactos', label: 'Contactos', icon: Contact },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
    { id: 'ayuda', label: 'Ayuda', icon: HelpCircle },
    {
      id: 'logout',
      label: 'Salir',
      icon: LogOut,
      action: () => {
        localStorage.clear();
        window.location.href = '/login';
      },
    },
  ];

  const handleMenuNav = (item) => {
    setSeccionActiva(item.id);
    setSidebarAbierto(false); // cerrar sidebar en mobile al navegar
    if (item.id === 'facturas' && facturas.length > 0) setVistaFactura('lista');
    if (item.id === 'cotizaciones' && cotizaciones.length > 0) setVistaCotizacion('lista');
    if (item.id === 'remisiones' && remisiones.length > 0) setVistaRemision('lista');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: primaryGreen }} />
      </div>
    );
  }

  return (
    <>
      {/* Estilos responsive globales */}
      <style>{`
        @media (max-width: 768px) {
          .eva-sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            height: 100vh !important;
            z-index: 200 !important;
            transform: translateX(-100%);
            transition: transform 0.3s ease !important;
            width: 280px !important;
          }
          .eva-sidebar.open {
            transform: translateX(0) !important;
          }
          .eva-overlay {
            display: block !important;
          }
          .eva-hamburger {
            display: flex !important;
          }
          .eva-header-title {
            font-size: 16px !important;
          }
          .eva-main-content {
            padding: 20px 16px !important;
          }
          .eva-dashboard-grid-top {
            grid-template-columns: 1fr !important;
          }
          .eva-dashboard-grid-charts {
            grid-template-columns: 1fr !important;
          }
          .eva-banner {
            height: 200px !important;
          }
          .eva-balance-card {
            min-height: unset !important;
          }
          .eva-balance-h3 {
            font-size: 32px !important;
          }
          .eva-stats-grid {
            grid-template-columns: 1fr !important;
          }
          .eva-ayuda-grid {
            grid-template-columns: 1fr !important;
          }
          .eva-header {
            padding: 0 16px !important;
          }
        }
        @media (min-width: 769px) {
          .eva-hamburger {
            display: none !important;
          }
          .eva-overlay {
            display: none !important;
          }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          background: '#F8FAFB',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* Overlay oscuro para mobile cuando sidebar está abierto */}
        <div
          className="eva-overlay"
          onClick={() => setSidebarAbierto(false)}
          style={{
            display: 'none',
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 150,
          }}
        />

        {/* SIDEBAR */}
        <aside
          className={`eva-sidebar${sidebarAbierto ? ' open' : ''}`}
          style={{
            width: '300px',
            backgroundColor: primaryGreen,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 50,
            transition: '0.3s',
            flexShrink: 0,
          }}
        >
          <div style={{ padding: '35px 30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: '#fff', borderRadius: '12px', color: primaryGreen }}>
              <Leaf size={24} fill={primaryGreen} />
            </div>
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#fff', letterSpacing: '-1.5px' }}>EVA.</span>
          </div>

          <nav style={{ flex: 1, padding: '0 15px', overflowY: 'auto' }}>
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.action ? item.action : () => handleMenuNav(item)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 20px',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: '6px',
                  transition: '0.2s',
                  background: seccionActiva === item.id ? '#fff' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <item.icon size={20} style={{ color: seccionActiva === item.id ? primaryGreen : 'rgba(255,255,255,0.7)' }} />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: seccionActiva === item.id ? '#1A1C1E' : '#fff' }}>{item.label}</span>
                </div>
                {seccionActiva === item.id && <ChevronRight size={16} style={{ color: primaryGreen, marginLeft: 'auto' }} />}
              </button>
            ))}
          </nav>

          <div style={{ padding: '25px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255,255,255,0.1)',
                padding: '12px',
                borderRadius: '16px',
                color: '#fff',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '900',
                  flexShrink: 0,
                }}
              >
                {userData.name.charAt(0)}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '13px', fontWeight: '700', margin: 0 }}>{userData.name}</p>
                <p style={{ fontSize: '10px', opacity: 0.6, textTransform: 'uppercase', margin: 0 }}>{userData.role}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* HEADER */}
          <header
            className="eva-header"
            style={{
              height: '70px',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 40px',
              borderBottom: '1px solid #E5E7EB',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Botón hamburguesa - solo visible en mobile */}
              <button
                className="eva-hamburger"
                type="button"
                onClick={() => setSidebarAbierto(!sidebarAbierto)}
                style={{
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  background: '#F9FAFB',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                }}
              >
                {sidebarAbierto ? <X size={20} color="#1A1C1E" /> : <Menu size={20} color="#1A1C1E" />}
              </button>
              <h2
                className="eva-header-title"
                style={{ fontSize: '20px', fontWeight: '800', color: '#1A1C1E', textTransform: 'capitalize', margin: 0 }}
              >
                {seccionActiva}
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '12px', cursor: 'pointer' }}>
                <Bell size={20} color="#9CA3AF" />
              </div>
              <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '12px', cursor: 'pointer' }}>
                <Settings size={20} color="#9CA3AF" />
              </div>
            </div>
          </header>

          {/* MAIN */}
          <main
            className="eva-main-content"
            style={{ flex: 1, padding: '30px 40px', overflowY: 'auto' }}
          >
            {seccionActiva === 'dashboard' ? (
              <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {/* TOP GRID */}
                <div
                  className="eva-dashboard-grid-top"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px', marginBottom: '30px' }}
                >
                  {/* Balance card */}
                  <div
                    className="eva-balance-card"
                    style={{
                      gridColumn: 'span 5',
                      backgroundColor: '#1A1C1E',
                      padding: '35px',
                      borderRadius: '32px',
                      color: '#fff',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '280px',
                    }}
                  >
                    <div style={{ zIndex: 10 }}>
                      <p style={{ color: '#9CA3AF', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>
                        Balance Actual
                      </p>
                      <h3
                        className="eva-balance-h3"
                        style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}
                      >
                        ${resumen.saldo?.toLocaleString()}
                      </h3>
                    </div>
                    <div style={{ zIndex: 10, display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => { setSeccionActiva('facturas'); setFacturaSeleccionada(null); setVistaFactura('crear'); }}
                        style={{ flex: 1, minWidth: '120px', padding: '12px', backgroundColor: primaryGreen, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '11px', cursor: 'pointer' }}
                      >
                        CREAR FACTURA
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSeccionActiva('clientes'); setClienteSeleccionado(null); setVistaCliente('crear'); }}
                        style={{ flex: 1, minWidth: '100px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '11px', cursor: 'pointer' }}
                      >
                        CLIENTE
                      </button>
                    </div>
                    <Wallet size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.05 }} />
                  </div>

                  {/* Banner */}
                  <div
                    className="eva-banner"
                    style={{ gridColumn: 'span 7', position: 'relative', borderRadius: '32px', overflow: 'hidden', height: '280px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  >
                    {banners.map((b, i) => (
                      <div
                        key={b.id}
                        style={{
                          position: 'absolute', inset: 0, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                          backgroundImage: `linear-gradient(to top, ${b.overlay}, transparent), url(${b.img})`,
                          backgroundSize: 'cover', backgroundPosition: 'center', transition: '0.8s',
                          opacity: i === currentBanner ? 1 : 0,
                          transform: `scale(${i === currentBanner ? 1 : 1.05})`,
                        }}
                      >
                        <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#fff', marginBottom: '5px' }}>{b.title}</h2>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', maxWidth: '300px', margin: 0 }}>{b.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CHARTS */}
                <div
                  className="eva-dashboard-grid-charts"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}
                >
                  <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '32px', border: '1px solid #F1F5F9' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: '#1A1C1E' }}>Ventas Semanales</h3>
                    <div style={{ height: '180px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataVentas}>
                          <Bar dataKey="v" fill={primaryGreen} radius={[6, 6, 0, 0]} barSize={30} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '32px', border: '1px solid #F1F5F9' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: '#1A1C1E' }}>Flujo de Caja</h3>
                    <div style={{ height: '180px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dataVentas}>
                          <Area type="monotone" dataKey="v" stroke={primaryGreen} fill={primaryGreen} fillOpacity={0.1} strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* ACTIVIDAD */}
                <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '32px', border: '1px solid #F1F5F9' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Actividad Reciente</h3>
                  {movimientos.length > 0 ? (
                    movimientos.slice(0, 4).map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', backgroundColor: '#F9FAFB', borderRadius: '20px', marginBottom: '10px', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', minWidth: 0 }}>
                          <div style={{ padding: '10px', backgroundColor: m.tipo === 'ingreso' ? '#E8F5E9' : '#FFEBEE', borderRadius: '12px', color: m.tipo === 'ingreso' ? '#2E7D32' : '#C62828', flexShrink: 0 }}>
                            {m.tipo === 'ingreso' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: '#1A1C1E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.descripcion}</span>
                        </div>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: m.tipo === 'ingreso' ? '#2E7D32' : '#1A1C1E', flexShrink: 0 }}>
                          {m.tipo === 'ingreso' ? '+' : '-'}${m.monto?.toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>No hay movimientos.</p>
                  )}
                </div>
              </div>

            ) : seccionActiva === 'facturas' ? (
              vistaFactura === 'lista' ? (
                <ListaFactura
                  facturas={facturas}
                  onSeleccionar={(f) => { setFacturaSeleccionada(f); setVistaFactura('crear'); }}
                  onNueva={() => { setFacturaSeleccionada(null); setVistaFactura('crear'); }}
                />
              ) : (
                <CrearFactura
                  listaDeClientes={clientes}
                  facturaAEditar={facturaSeleccionada}
                  onNuevoCliente={() => { setSeccionActiva('clientes'); setClienteSeleccionado(null); setVistaCliente('crear'); }}
                  onBack={() => { setFacturaSeleccionada(null); setVistaFactura('lista'); }}
                  onDelete={async (id) => {
                    if (!window.confirm('¿Eliminar esta factura? Esta acción no se puede deshacer.')) return;
                    try {
                      await axios.delete(`${BASE_URL}/facturas/${id}`, axiosAuth());
                      alert('Factura eliminada');
                      setFacturaSeleccionada(null);
                      setVistaFactura('lista');
                      await fetchData();
                    } catch (e) {
                      alert('Error al eliminar: ' + (e.response?.data?.message || e.message));
                    }
                  }}
                  onSave={async (d) => {
                    try {
                      const token = localStorage.getItem('token');
                      if (!token) { navigate('/login'); return; }
                      const userId = getUserId();
                      if (!userId) { alert('Sesión inválida'); return; }
                      const cfg = axiosAuth();

                      const clienteEncontrado = clientes.find((c) => c.nombre === d.cliente);
                      const clienteId = clienteEncontrado?._id || clienteEncontrado?.id || null;

                      if (!d.cliente?.trim()) {
                        alert('Selecciona un cliente.');
                        return;
                      }

                      const costoPorUnidad = Number(d.costoPorUnidad) || 0;
                      const cantidad = Number(d.cantidad) || 1;
                      const descPorc = Number(d.descPorc) || 0;
                      const ivaPorc = Number(d.ivaPorc) || 0;
                      const totalBruto = costoPorUnidad * cantidad;
                      const valorDescuento = totalBruto * (descPorc / 100);
                      const subtotal = totalBruto - valorDescuento;
                      const valorIva = subtotal * (ivaPorc / 100);
                      const valorNeto = subtotal + valorIva;

                      const itemPayload = {
                        descripcion: d.descripcion || '',
                        cantidad,
                        precioUnitario: costoPorUnidad,
                        total: totalBruto,
                      };

                      if (d._id) {
                        await axios.put(
                          `${BASE_URL}/facturas/${d._id}`,
                          {
                            numero: d.numero || `FAC-${Date.now()}`,
                            clienteId,
                            clienteNombre: d.cliente,
                            subtotal,
                            iva: ivaPorc,
                            total: valorNeto,
                            items: [itemPayload],
                            estado: facturaSeleccionada?.estado || 'pendiente',
                          },
                          cfg
                        );
                        alert('Factura actualizada');
                      } else {
                        await axios.post(
                          `${BASE_URL}/facturas`,
                          {
                            numero: `FAC-${Date.now()}`,
                            clienteId,
                            clienteNombre: d.cliente,
                            subtotal,
                            iva: ivaPorc,
                            total: valorNeto,
                            userId,
                            items: [itemPayload],
                            estado: 'pendiente',
                          },
                          cfg
                        );
                        alert('Factura creada correctamente');
                      }
                      await fetchData();
                      setFacturaSeleccionada(null);
                      setVistaFactura('lista');
                    } catch (e) {
                      console.error(e.response?.data || e.message);
                      alert('Error: ' + (e.response?.data?.message || e.message));
                    }
                  }}
                />
              )

            ) : seccionActiva === 'cotizaciones' ? (
              vistaCotizacion === 'lista' ? (
                <ListaCotizacion
                  cotizaciones={cotizaciones}
                  onSeleccionar={(c) => { setCotizacionSeleccionada(c); setVistaCotizacion('crear'); }}
                  onNueva={() => { setCotizacionSeleccionada(null); setVistaCotizacion('crear'); }}
                />
              ) : (
                <CrearCotizacion
                  listaDeClientes={clientes}
                  cotizacionAEditar={cotizacionSeleccionada}
                  onNuevoCliente={() => { setSeccionActiva('clientes'); setClienteSeleccionado(null); setVistaCliente('crear'); }}
                  onBack={() => { setCotizacionSeleccionada(null); setVistaCotizacion('lista'); }}
                  onDelete={async (id) => {
                    if (!window.confirm('¿Eliminar esta cotización?')) return;
                    try {
                      await axios.delete(`${BASE_URL}/cotizaciones/${id}`, axiosAuth());
                      alert('Cotización eliminada');
                      setCotizacionSeleccionada(null);
                      setVistaCotizacion('lista');
                      await fetchData();
                    } catch (e) { alert('Error al eliminar'); }
                  }}
                  onSave={async (d) => {
                    try {
                      const userId = getUserId();
                      if (!userId) { alert('Sesión inválida'); return; }
                      const cfg = axiosAuth();
                      const clienteEncontrado = clientes.find((c) => c.nombre === d.cliente);
                      const clienteId = clienteEncontrado?._id || clienteEncontrado?.id || null;
                      if (!d.cliente?.trim()) { alert('Selecciona un cliente.'); return; }
                      const cant = Number(d.cantidad) || 0;
                      const pu = Number(d.valorUnitario) || 0;
                      const lineTotal = cant * pu;
                      const numero = (d.numeroCotizacion || '').trim() || `COT-${Date.now()}`;
                      const itemPayload = { descripcion: d.descripcion, cantidad: cant, precioUnitario: pu, total: lineTotal };

                      if (d._id) {
                        await axios.put(`${BASE_URL}/cotizaciones/${d._id}`, { numero: (d.numeroCotizacion || '').trim() || d.numero, clienteId, clienteNombre: d.cliente, subtotal: lineTotal, iva: 0, total: lineTotal, items: [itemPayload], estado: cotizacionSeleccionada?.estado || 'pendiente' }, cfg);
                        alert('Cotización actualizada');
                      } else {
                        await axios.post(`${BASE_URL}/cotizaciones`, { numero, clienteId, clienteNombre: d.cliente, subtotal: lineTotal, iva: 0, total: lineTotal, userId, items: [itemPayload] }, cfg);
                        alert('Cotización creada correctamente');
                      }
                      await fetchData();
                      setCotizacionSeleccionada(null);
                      setVistaCotizacion('lista');
                    } catch (e) { alert('Error: ' + (e.response?.data?.message || e.message)); }
                  }}
                />
              )

            ) : seccionActiva === 'remisiones' ? (
              vistaRemision === 'lista' ? (
                <ListaRemision
                  remisiones={remisiones}
                  onSeleccionar={(r) => { setRemisionSeleccionada(r); setVistaRemision('crear'); }}
                  onNueva={() => { setRemisionSeleccionada(null); setVistaRemision('crear'); }}
                />
              ) : (
                <CrearRemision
                  listaDeClientes={clientes}
                  remisionAEditar={remisionSeleccionada}
                  onNuevoCliente={() => { setSeccionActiva('clientes'); setClienteSeleccionado(null); setVistaCliente('crear'); }}
                  onBack={() => { setRemisionSeleccionada(null); setVistaRemision('lista'); }}
                  onDelete={async (id) => {
                    if (!window.confirm('¿Eliminar esta remisión?')) return;
                    try {
                      await axios.delete(`${BASE_URL}/remisiones/${id}`, axiosAuth());
                      alert('Remisión eliminada');
                      setRemisionSeleccionada(null);
                      setVistaRemision('lista');
                      await fetchData();
                    } catch (e) { alert('Error al eliminar'); }
                  }}
                  onSave={async (d) => {
                    try {
                      const userId = getUserId();
                      if (!userId) { alert('Sesión inválida'); return; }
                      const cfg = axiosAuth();
                      const clienteEncontrado = clientes.find((c) => c.nombre === d.cliente);
                      const clienteId = clienteEncontrado?._id || clienteEncontrado?.id || null;
                      if (!d.cliente?.trim()) { alert('Selecciona un cliente.'); return; }
                      const cant = Number(d.cantidad) || 0;
                      const pu = Number(d.valorUnitario) || 0;
                      const lineTotal = cant * pu;
                      const numero = (d.numeroRemision || '').trim() || `REM-${Date.now()}`;
                      const itemPayload = { descripcion: d.descripcion, cantidad: cant, precioUnitario: pu, total: lineTotal };

                      if (d._id) {
                        await axios.put(`${BASE_URL}/remisiones/${d._id}`, { numero: (d.numeroRemision || '').trim() || d.numero, clienteId, clienteNombre: d.cliente, direccionEntrega: remisionSeleccionada?.direccionEntrega || '', items: [itemPayload], estado: remisionSeleccionada?.estado || 'pendiente' }, cfg);
                        alert('Remisión actualizada');
                      } else {
                        await axios.post(`${BASE_URL}/remisiones`, { numero, clienteId, clienteNombre: d.cliente, items: [itemPayload], userId }, cfg);
                        alert('Remisión creada correctamente');
                      }
                      await fetchData();
                      setRemisionSeleccionada(null);
                      setVistaRemision('lista');
                    } catch (e) { alert('Error: ' + (e.response?.data?.message || e.message)); }
                  }}
                />
              )

            ) : seccionActiva === 'clientes' ? (
              vistaCliente === 'lista' ? (
                <ListaClientes
                  clientes={clientes}
                  onNuevo={() => { setClienteSeleccionado(null); setVistaCliente('crear'); }}
                  onEdit={(c) => { setClienteSeleccionado(c); setVistaCliente('crear'); }}
                />
              ) : (
                <CrearCliente
                  clienteAEditar={clienteSeleccionado ? { ...clienteSeleccionado, cedulaOrNit: String(clienteSeleccionado.nit ?? clienteSeleccionado.cedulaOrNit ?? '') } : null}
                  onBack={() => { setVistaCliente('lista'); setClienteSeleccionado(null); }}
                  onSave={async (datos) => {
                    try {
                      const cfg = axiosAuth();
                      const userId = getUserId();
                      const payload = { nombre: datos.nombre, nit: Number(datos.cedulaOrNit), ciudad: datos.ciudad, actividadEconomica: datos.actividadEconomica, telefono: datos.telefono, email: datos.email, direccion: datos.direccion, tipo: 'natural', userId };
                      if (clienteSeleccionado) {
                        await axios.put(`${BASE_URL}/clientes/${clienteSeleccionado._id}`, payload, cfg);
                        alert('Cliente actualizado');
                      } else {
                        await axios.post(`${BASE_URL}/clientes`, payload, cfg);
                        alert('Cliente guardado');
                      }
                      await fetchData();
                      setVistaCliente('lista');
                      setClienteSeleccionado(null);
                    } catch (e) { alert('Error al procesar: ' + (e.response?.data?.message || 'Servidor no responde')); }
                  }}
                  onDelete={async (id) => {
                    if (window.confirm('¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
                      try {
                        await axios.delete(`${BASE_URL}/clientes/${id}`, axiosAuth());
                        alert('Cliente eliminado');
                        await fetchData();
                        setVistaCliente('lista');
                        setClienteSeleccionado(null);
                      } catch (e) { alert('Error al eliminar'); }
                    }
                  }}
                />
              )

            ) : seccionActiva === 'contactos' ? (
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: '#fff', borderRadius: '32px', padding: '50px 30px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '40px', background: primaryGreen, margin: '0 auto 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '48px', fontWeight: '900' }}>JZ</div>
                  <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1A1C1E', marginBottom: '10px' }}>Jhon Zamudio Santafe</h2>
                  <p style={{ fontSize: '16px', color: primaryGreen, fontWeight: '700', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '1px' }}>Diseñador y Full Stack Developer</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', maxWidth: '400px', margin: '0 auto 40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', background: '#F9FAFB', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
                      <div style={{ padding: '10px', background: '#fff', borderRadius: '12px', color: primaryGreen, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', flexShrink: 0 }}><Phone size={20} /></div>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>WhatsApp / Celular</p>
                        <p style={{ fontSize: '16px', fontWeight: '700', color: '#1A1C1E', margin: 0 }}>322 679 8678</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => window.open('https://wa.me/573226798678', '_blank')} style={{ padding: '16px 35px', borderRadius: '18px', border: 'none', background: primaryGreen, color: '#fff', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', margin: '0 auto' }}>
                    Hablar por WhatsApp <ExternalLink size={18} />
                  </button>
                </div>
              </div>

            ) : seccionActiva === 'estadisticas' ? (
              <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div
                  className="eva-stats-grid"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}
                >
                  <div style={{ background: '#fff', padding: '30px', borderRadius: '32px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
                    <div style={{ padding: '15px', background: '#E8F5E9', borderRadius: '22px', color: primaryGreen, width: 'fit-content', margin: '0 auto 20px' }}><FileText size={32} /></div>
                    <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Total Facturado</h3>
                    <p style={{ fontSize: '28px', fontWeight: '900', color: '#1A1C1E', margin: 0 }}>${facturas.reduce((acc, f) => acc + (f.total || 0), 0).toLocaleString()}</p>
                    <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '600' }}>{facturas.length} documentos emitidos</span>
                  </div>
                  <div style={{ background: '#fff', padding: '30px', borderRadius: '32px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
                    <div style={{ padding: '15px', background: '#E3F2FD', borderRadius: '22px', color: '#1E88E5', width: 'fit-content', margin: '0 auto 20px' }}><ClipboardList size={32} /></div>
                    <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Proyectado Cotizaciones</h3>
                    <p style={{ fontSize: '28px', fontWeight: '900', color: '#1A1C1E', margin: 0 }}>${cotizaciones.reduce((acc, c) => acc + (c.total || 0), 0).toLocaleString()}</p>
                    <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '600' }}>{cotizaciones.length} propuestas enviadas</span>
                  </div>
                  <div style={{ background: '#fff', padding: '30px', borderRadius: '32px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
                    <div style={{ padding: '15px', background: '#FFF3E0', borderRadius: '22px', color: '#FB8C00', width: 'fit-content', margin: '0 auto 20px' }}><PackageCheck size={32} /></div>
                    <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Flujo de Remisiones</h3>
                    <p style={{ fontSize: '28px', fontWeight: '900', color: '#1A1C1E', margin: 0 }}>{remisiones.length}</p>
                    <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '600' }}>Entregas y movimientos realizados</span>
                  </div>
                </div>
                <div style={{ background: '#fff', padding: '35px', borderRadius: '32px', border: '1px solid #F1F5F9' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1A1C1E', margin: 0 }}>Rendimiento Comercial</h3>
                  <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '5px 0 25px 0' }}>Comparativa de valores totales</p>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Facturas', valor: facturas.reduce((acc, f) => acc + (f.total || 0), 0) },
                        { name: 'Cotizaciones', valor: cotizaciones.reduce((acc, c) => acc + (c.total || 0), 0) }
                      ]}>
                        <Bar dataKey="valor" fill={primaryGreen} radius={[12, 12, 0, 0]} barSize={80} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

            ) : seccionActiva === 'ayuda' ? (
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1A1C1E' }}>Centro de Ayuda</h2>
                  <p style={{ color: '#9CA3AF', fontSize: '16px' }}>¿En qué podemos ayudarte hoy con EVA?</p>
                </div>
                <div
                  className="eva-ayuda-grid"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' }}
                >
                  <div style={{ background: '#fff', padding: '25px', borderRadius: '24px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer' }}>
                    <div style={{ padding: '12px', background: '#E8F5E9', borderRadius: '16px', color: primaryGreen, flexShrink: 0 }}><Search size={24} /></div>
                    <div><h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Documentación</h4><p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>Guías detalladas de uso</p></div>
                  </div>
                  <div style={{ background: '#fff', padding: '25px', borderRadius: '24px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer' }}>
                    <div style={{ padding: '12px', background: '#E3F2FD', borderRadius: '16px', color: '#1E88E5', flexShrink: 0 }}><Bell size={24} /></div>
                    <div><h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Novedades</h4><p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>Ver qué hay de nuevo en EVA</p></div>
                  </div>
                </div>
                <div style={{ background: '#fff', borderRadius: '32px', padding: '35px', border: '1px solid #F1F5F9' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '25px' }}>Preguntas Frecuentes</h3>
                  {[
                    { q: '¿Cómo crear mi primera factura?', a: "Ve a la sección de Facturación y haz clic en 'Crear Factura'. Asegúrate de tener clientes creados primero." },
                    { q: '¿Puedo exportar mis reportes?', a: 'Sí, en la sección de Estadísticas pronto podrás descargar tus informes en formato PDF y Excel.' },
                    { q: '¿Es seguro almacenar mis datos?', a: 'Totalmente. EVA utiliza encriptación de grado bancario y tus datos se almacenan en servidores locales seguros.' }
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '20px 0', borderBottom: i < 2 ? '1px solid #F8FAFB' : 'none' }}>
                      <p style={{ fontSize: '15px', fontWeight: '700', color: '#1A1C1E', marginBottom: '8px' }}>{item.q}</p>
                      <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6', margin: 0 }}>{item.a}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '40px', padding: '30px', background: primaryGreen, borderRadius: '32px', color: '#fff', textAlign: 'center' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px' }}>¿Aún necesitas ayuda?</h4>
                  <p style={{ opacity: 0.8, fontSize: '14px', marginBottom: '20px' }}>Nuestro equipo de soporte está disponible de Lunes a Viernes (8am - 6pm)</p>
                  <button onClick={() => setSeccionActiva('contactos')} style={{ background: '#fff', color: primaryGreen, border: 'none', padding: '12px 30px', borderRadius: '14px', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
                    CONTACTAR SOPORTE
                  </button>
                </div>
              </div>

            ) : (
              <div style={{ padding: '50px', textAlign: 'center', color: '#9CA3AF', fontSize: '20px', fontWeight: '800' }}>
                MÓDULO EN DESARROLLO
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;