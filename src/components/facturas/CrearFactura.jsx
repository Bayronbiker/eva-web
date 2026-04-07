import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft, Save, Percent, ChevronDown, Trash2
} from 'lucide-react';

const CrearFactura = ({ facturaAEditar, onBack, onSave, onDelete, listaDeClientes = [], onNuevoCliente }) => {
  const isEditMode = !!facturaAEditar;

  const [cliente, setCliente] = useState('');
  const [vendedor, setVendedor] = useState('');
  const [formaDePago, setFormaDePago] = useState('Contado');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [costoPorUnidad, setCostoPorUnidad] = useState('');
  const [descuentoPorcentual, setDescuentoPorcentual] = useState('');
  const [ivaPorcentual, setIvaPorcentual] = useState('19');

  useEffect(() => {
    if (!facturaAEditar) {
      setCliente('');
      setVendedor('');
      setFormaDePago('Contado');
      setDescripcion('');
      setCantidad('1');
      setCostoPorUnidad('');
      setDescuentoPorcentual('');
      setIvaPorcentual('19');
      return;
    }
    const item = facturaAEditar.items?.[0] || {};
    const sub = facturaAEditar.subtotal || 0;
    const ivaAmt = facturaAEditar.iva || 0;
    const ivaPct = sub > 0 ? Math.round((ivaAmt / sub) * 1000) / 10 : 19;
    setCliente(facturaAEditar.clienteNombre || '');
    setVendedor('');
    setFormaDePago('Contado');
    setDescripcion(item.descripcion || '');
    setCantidad(String(item.cantidad ?? 1));
    setCostoPorUnidad(item.precioUnitario != null ? String(item.precioUnitario) : '');
    setDescuentoPorcentual('');
    setIvaPorcentual(String(ivaPct));
  }, [facturaAEditar]);

  const calculos = useMemo(() => {
    const costo = parseFloat(costoPorUnidad) || 0;
    const cant = parseFloat(cantidad) || 0;
    const descPorc = parseFloat(descuentoPorcentual) || 0;
    const ivaPorc = parseFloat(ivaPorcentual) || 0;

    const totalBruto = costo * cant;
    const valorDescuento = totalBruto * (descPorc / 100);
    const subtotal = totalBruto - valorDescuento;
    const valorIva = subtotal * (ivaPorc / 100);
    const valorNeto = subtotal + valorIva;

    return { totalBruto, valorDescuento, subtotal, valorIva, valorNeto, descPorc, ivaPorc };
  }, [costoPorUnidad, cantidad, descuentoPorcentual, ivaPorcentual]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const buildPayload = () => ({
    ...calculos,
    cliente,
    vendedor,
    formaDePago,
    descripcion,
    _id: facturaAEditar?._id,
    numero: facturaAEditar?.numero,
  });

  const handlePrimaryAction = () => {
    const data = buildPayload();
    if (onSave) onSave(data);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen font-sans border-[6px] border-[#2E7D32] rounded-3xl my-4 shadow-2xl">

      <div className="flex items-center gap-4 mb-8 border-b-2 border-gray-100 pb-4">
        <button type="button" onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={32} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">
            {isEditMode ? 'Editar factura' : 'Nueva factura'}
          </h1>
          <p className="text-sm text-gray-500 font-medium">Gestión de documentos tributarios</p>
        </div>
      </div>

      <div className="border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm">

        <div className="flex w-full bg-[#C8E6C9] border-b border-gray-300">
          <div className="w-1/2 p-6 border-r-2 border-[#2E7D32]/30 px-[15px]">
            <label className="block text-base font-black text-[#1B5E20] uppercase mb-2">Vendedor</label>
            <input
              type="text"
              placeholder="Nombre del responsable"
              value={vendedor}
              onChange={(e) => setVendedor(e.target.value)}
              className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl text-xl focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/20 font-medium shadow-sm"
            />
          </div>
          <div className="w-1/2 p-6 px-[15px]">
            <label className="block text-base font-black text-[#1B5E20] uppercase mb-2">Cliente</label>
            <div className="relative">
              <select
                value={cliente}
                onChange={(e) => {
                  if (e.target.value === 'nuevo') {
                    onNuevoCliente?.();
                  } else {
                    setCliente(e.target.value);
                  }
                }}
                className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl text-xl appearance-none focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/20 font-medium shadow-sm"
              >
                <option value="">Seleccionar cliente...</option>
                <option value="nuevo" className="font-bold text-[#2E7D32] tracking-wide">+ CREAR NUEVO CLIENTE</option>
                {listaDeClientes.map((c, i) => (
                  <option key={i} value={c.nombre}>{c.nombre}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-5 text-gray-400 pointer-events-none" size={24} />
            </div>
          </div>
        </div>

        <div className="w-full p-8 bg-white border-b border-gray-300 px-[15px]">
          <label className="block text-base font-black text-gray-700 uppercase mb-4">Forma de pago</label>
          <div className="flex gap-10">
            {['Contado', 'Crédito'].map((opcion) => (
              <label key={opcion} className="flex items-center gap-4 cursor-pointer text-xl font-bold">
                <input
                  type="radio"
                  name="pago"
                  checked={formaDePago === opcion}
                  onChange={() => setFormaDePago(opcion)}
                  className="w-6 h-6 accent-[#2E7D32]"
                />
                {opcion}
              </label>
            ))}
          </div>
        </div>

        <div className="w-full p-6 bg-[#C8E6C9] border-b border-gray-300 px-[15px]">
          <label className="block text-base font-black text-[#1B5E20] uppercase mb-2">Descripción del servicio / Producto</label>
          <textarea
            rows="3"
            placeholder="Escribe aquí los detalles..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl text-xl resize-none focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/20 font-medium shadow-sm"
          />
        </div>

        <div className="flex w-full bg-white border-b border-gray-300">
          <div className="w-1/2 p-6 border-r border-gray-200 px-[15px]">
            <label className="block text-base font-black text-gray-700 uppercase mb-2">Cantidad</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-2xl font-bold focus:outline-none shadow-inner"
            />
          </div>
          <div className="w-1/2 p-6 px-[15px]">
            <label className="block text-base font-black text-gray-700 uppercase mb-2">Costo Unitario</label>
            <div className="relative">
              <span className="absolute left-5 top-4 text-gray-500 text-2xl font-bold">$</span>
              <input
                type="number"
                value={costoPorUnidad}
                onChange={(e) => setCostoPorUnidad(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-2xl font-bold focus:outline-none shadow-inner"
              />
            </div>
          </div>
        </div>

        <div className="flex w-full bg-[#C8E6C9]">
          <div className="w-1/2 p-6 border-r-2 border-[#2E7D32]/30 px-[15px]">
            <label className="block text-base font-black text-[#1B5E20] uppercase mb-2">Descuento (%)</label>
            <div className="relative">
              <Percent className="absolute left-5 top-5 text-[#2E7D32]" size={24} />
              <input
                type="number"
                placeholder="0"
                value={descuentoPorcentual}
                onChange={(e) => setDescuentoPorcentual(e.target.value)}
                className="w-full pl-14 pr-5 py-4 bg-white border-2 border-gray-300 rounded-xl text-2xl font-bold focus:outline-none shadow-sm"
              />
            </div>
          </div>
          <div className="w-1/2 p-6 px-[15px]">
            <label className="block text-base font-black text-[#1B5E20] uppercase mb-2">IVA (%)</label>
            <input
              type="number"
              value={ivaPorcentual}
              onChange={(e) => setIvaPorcentual(e.target.value)}
              className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl text-2xl font-bold focus:outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 border-2 border-gray-300 rounded-2xl overflow-hidden shadow-lg">
        <div className="flex justify-between p-5 text-lg border-b-2 bg-white">
          <span className="font-bold text-gray-600 uppercase">TOTAL BRUTO</span>
          <span className="font-bold text-gray-900">{formatCurrency(calculos.totalBruto)}</span>
        </div>
        <div className="flex justify-between p-5 text-lg border-b-2 bg-white">
          <span className="font-bold text-gray-600 uppercase">DESCUENTO ({calculos.descPorc}%)</span>
          <span className="text-red-600 font-bold">-{formatCurrency(calculos.valorDescuento)}</span>
        </div>
        <div className="flex justify-between p-5 text-lg border-b-2 bg-white">
          <span className="font-bold text-gray-600 uppercase">SUBTOTAL</span>
          <span className="font-bold text-gray-900">{formatCurrency(calculos.subtotal)}</span>
        </div>
        <div className="flex justify-between p-5 text-lg border-b-2 bg-white">
          <span className="font-bold text-gray-600 uppercase">I.V.A. ({calculos.ivaPorc}%)</span>
          <span className="font-bold text-gray-900">{formatCurrency(calculos.valorIva)}</span>
        </div>
        <div className="flex justify-between p-6 text-2xl font-black bg-gray-50">
          <span className="uppercase tracking-wider text-gray-800">VALOR NETO</span>
          <span className="text-[#2E7D32] text-3xl">{formatCurrency(calculos.valorNeto)}</span>
        </div>
      </div>

      {isEditMode ? (
        <div className="flex gap-4 mt-10">
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="flex-1 py-6 bg-[#22C55E] text-white font-black rounded-2xl text-xl uppercase flex items-center justify-center gap-3 hover:bg-[#16A34A] shadow-xl transition-all active:scale-95"
          >
            <Save size={28} />
            Guardar
          </button>
          <button
            type="button"
            onClick={() => facturaAEditar?._id && onDelete?.(facturaAEditar._id)}
            className="flex-1 py-6 bg-[#DC2626] text-white font-black rounded-2xl text-xl uppercase flex items-center justify-center gap-3 hover:bg-[#B91C1C] shadow-xl transition-all active:scale-95"
          >
            <Trash2 size={28} />
            Eliminar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handlePrimaryAction}
          className="w-full mt-10 py-6 bg-[#2E7D32] text-white font-black rounded-2xl text-2xl uppercase flex items-center justify-center gap-4 hover:bg-[#1B5E20] shadow-xl transition-all transform active:scale-95"
        >
          <Save size={32} />
          Crear factura
        </button>
      )}

    </div>
  );
};

export default CrearFactura;
