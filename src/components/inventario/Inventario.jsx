import React, { useState } from 'react';
import { ArrowLeft, Plus, Package, Save, Trash2, Image, Tag, DollarSign, Hash, FileText, TrendingUp } from 'lucide-react';

const G = '#2E7D32';
const GL = '#E8F5E9';
const G2 = '#1B5E20';

const CATEGORIAS = ['Ropa', 'Electronica', 'Alimentos', 'Herramientas', 'Papeleria', 'Servicios', 'Otros'];

const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e0e0e0', fontSize: '14px', fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', color: '#757575', marginBottom: '6px', display: 'block' };
const sectionStyle = { background: '#fff', borderRadius: '16px', border: '1.5px solid #f0f0f0', marginBottom: '14px', overflow: 'hidden' };

const FormProducto = ({ onBack, onSave, productoAEditar }) => {
  const [nombre, setNombre] = useState(productoAEditar?.nombre || '');
  const [cantidad, setCantidad] = useState(productoAEditar?.cantidad || '');
  const [precioCompra, setPrecioCompra] = useState(productoAEditar?.precioCompra || '');
  const [precioVenta, setPrecioVenta] = useState(productoAEditar?.precioVenta || '');
  const [categoria, setCategoria] = useState(productoAEditar?.categoria || '');
  const [descripcion, setDescripcion] = useState(productoAEditar?.descripcion || '');
  const [fotoPreview, setFotoPreview] = useState(productoAEditar?.foto || null);

  const ganancia = (Number(precioVenta) || 0) - (Number(precioCompra) || 0);
  const margen = precioCompra > 0 ? ((ganancia / Number(precioCompra)) * 100).toFixed(1) : 0;
  const isValido = nombre && cantidad && precioVenta;

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleGuardar = () => {
    if (!isValido) { alert('Nombre, cantidad y precio de venta son obligatorios.'); return; }
    onSave({ nombre, cantidad: Number(cantidad), precioCompra: Number(precioCompra), precioVenta: Number(precioVenta), categoria, descripcion, foto: fotoPreview, _id: productoAEditar?._id });
  };

  const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0);

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <button type="button" onClick={onBack}
          style={{ width: '42px', height: '42px', borderRadius: '12px', border: '1.5px solid #e0e0e0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={18} color="#424242" />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>{productoAEditar ? 'Editar producto' : 'Nuevo producto'}</h1>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9e9e9e' }}>Gestion de inventario</p>
        </div>
      </div>

      {/* Foto */}
      <div style={{ ...sectionStyle, padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <label htmlFor="foto-input" style={{ cursor: 'pointer', flexShrink: 0 }}>
          {fotoPreview ? (
            <img src={fotoPreview} alt="producto" style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover', border: '2px solid ' + G }} />
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: GL, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed ' + G, gap: '4px' }}>
              <Image size={22} color={G} />
              <span style={{ fontSize: '9px', fontWeight: '700', color: G, textAlign: 'center' }}>FOTO</span>
            </div>
          )}
        </label>
        <input id="foto-input" type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>Foto del producto</p>
          <p style={{ margin: 0, fontSize: '12px', color: '#9e9e9e' }}>Toca la imagen para cambiarla. Acepta fotos de camara o galeria.</p>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={{ background: G, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={15} color="rgba(255,255,255,0.85)" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Informacion del producto</span>
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Nombre del producto *</label>
            <input type="text" placeholder="Nombre del articulo" value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Cantidad disponible *</label>
            <input type="number" placeholder="0" value={cantidad} onChange={e => setCantidad(e.target.value)} style={{ ...inputStyle, fontSize: '16px', fontWeight: '700' }} />
          </div>
          <div>
            <label style={labelStyle}>Categoria</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
              <option value="">Seleccionar...</option>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={{ background: '#F5F5F5', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarSign size={15} color="#757575" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#757575', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Precios y ganancia</span>
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Precio de compra</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9e9e9e', fontWeight: '700', fontSize: '13px' }}>$</span>
              <input type="number" placeholder="0" value={precioCompra} onChange={e => setPrecioCompra(e.target.value)} style={{ ...inputStyle, paddingLeft: '26px' }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Precio de venta *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9e9e9e', fontWeight: '700', fontSize: '13px' }}>$</span>
              <input type="number" placeholder="0" value={precioVenta} onChange={e => setPrecioVenta(e.target.value)} style={{ ...inputStyle, paddingLeft: '26px' }} />
            </div>
          </div>
          {precioCompra && precioVenta && (
            <div style={{ gridColumn: 'span 2', background: ganancia >= 0 ? GL : '#FFEBEE', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} color={ganancia >= 0 ? G : '#ef5350'} />
                <span style={{ fontSize: '13px', fontWeight: '700', color: ganancia >= 0 ? G2 : '#C62828' }}>Ganancia por unidad</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: ganancia >= 0 ? G : '#ef5350' }}>{fmt(ganancia)}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#9e9e9e' }}>Margen: {margen}%</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ ...sectionStyle, padding: '20px' }}>
        <label style={labelStyle}>Descripcion</label>
        <textarea rows="3" placeholder="Descripcion adicional del producto..." value={descripcion} onChange={e => setDescripcion(e.target.value)}
          style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }} />
      </div>

      <button type="button" onClick={handleGuardar}
        style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: isValido ? G : '#e0e0e0', color: '#fff', fontWeight: '800', fontSize: '15px', cursor: isValido ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit' }}>
        <Save size={20} /> {productoAEditar ? 'Guardar cambios' : 'Crear producto'}
      </button>
    </div>
  );
};

const Inventario = () => {
  const [vista, setVista] = useState('lista');
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0);

  const handleSave = (datos) => {
    if (datos._id) {
      setProductos(prev => prev.map(p => p._id === datos._id ? datos : p));
      alert('Producto actualizado');
    } else {
      const nuevo = { ...datos, _id: Date.now().toString() };
      setProductos(prev => [...prev, nuevo]);
      alert('Producto creado');
    }
    setProductoSeleccionado(null);
    setVista('lista');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Eliminar este producto?')) return;
    setProductos(prev => prev.filter(p => p._id !== id));
    setProductoSeleccionado(null);
    setVista('lista');
  };

  if (vista !== 'lista') {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <FormProducto
          onBack={() => { setProductoSeleccionado(null); setVista('lista'); }}
          onSave={handleSave}
          productoAEditar={productoSeleccionado}
        />
        {productoSeleccionado && (
          <button type="button" onClick={() => handleDelete(productoSeleccionado._id)}
            style={{ width: '100%', marginTop: '10px', padding: '14px', borderRadius: '14px', border: '1.5px solid #ef5350', background: '#fff', color: '#ef5350', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit' }}>
            <Trash2 size={18} /> Eliminar producto
          </button>
        )}
      </div>
    );
  }

  const totalProductos = productos.length;
  const totalCosto = productos.reduce((a, p) => a + (p.precioCompra || 0) * p.cantidad, 0);
  const totalVenta = productos.reduce((a, p) => a + (p.precioVenta || 0) * p.cantidad, 0);

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ background: G, borderRadius: '20px', padding: '22px 26px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '19px', fontWeight: '800', color: '#fff' }}>Inventario</h1>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{totalProductos} producto{totalProductos !== 1 ? 's' : ''} registrado{totalProductos !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button type="button" onClick={() => { setProductoSeleccionado(null); setVista('crear'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '10px', border: 'none', background: '#fff', color: G, fontWeight: '800', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
            <Plus size={15} /> Nuevo
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {[
            { label: 'Productos', value: totalProductos },
            { label: 'Costo total', value: fmt(totalCosto) },
            { label: 'Valor venta', value: fmt(totalVenta) },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 14px' }}>
              <p style={{ margin: '0 0 3px', fontSize: '10px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontWeight: '700' }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: '#fff' }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {productos.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '20px', padding: '60px 32px', border: '1.5px solid #f0f0f0', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: GL, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={28} color={G} />
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '800', color: '#1a1a1a' }}>Sin productos creados</h3>
          <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#9e9e9e', maxWidth: '260px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
            Agrega tu primer producto para controlar tu inventario.
          </p>
          <button type="button" onClick={() => { setProductoSeleccionado(null); setVista('crear'); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', border: 'none', background: G, color: '#fff', fontWeight: '800', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
            <Plus size={16} /> Crear primer producto
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {productos.map(p => (
            <button key={p._id} type="button" onClick={() => { setProductoSeleccionado(p); setVista('crear'); }}
              style={{ width: '100%', textAlign: 'left', background: '#fff', borderRadius: '16px', border: '1.5px solid #f0f0f0', padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = G}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#f0f0f0'}>
              {p.foto ? (
                <img src={p.foto} alt={p.nombre} style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: GL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Package size={22} color={G} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#1a1a1a' }}>{p.nombre}</span>
                  {p.categoria && (
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: GL, color: G2 }}>{p.categoria}</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#9e9e9e' }}>Stock: <strong style={{ color: '#1a1a1a' }}>{p.cantidad}</strong></span>
                  <span style={{ fontSize: '11px', color: '#9e9e9e' }}>Compra: <strong style={{ color: '#1a1a1a' }}>{fmt(p.precioCompra)}</strong></span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: G }}>{fmt(p.precioVenta)}</p>
                <p style={{ margin: 0, fontSize: '10px', color: '#9e9e9e' }}>precio venta</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventario;