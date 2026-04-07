import React, { useState, useMemo, useEffect } from 'react';
import {
  Save, DollarSign, Hash, ChevronDown, Truck, User, ArrowLeft, Trash2
} from 'lucide-react';

const CrearRemision = ({ remisionAEditar, onBack, onSave, onDelete, listaDeClientes = [], onNuevoCliente }) => {
  const isEditMode = !!remisionAEditar;

  const [cliente, setCliente] = useState('');
  const [numeroRemision, setNumeroRemision] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [descripcion, setDescripcion] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [nombreVendedor, setNombreVendedor] = useState('');
  const [cedulaVendedor, setCedulaVendedor] = useState('');

  useEffect(() => {
    if (!remisionAEditar) {
      setCliente('');
      setNumeroRemision('');
      setCantidad('1');
      setDescripcion('');
      setValorUnitario('');
      setNombreVendedor('');
      setCedulaVendedor('');
      return;
    }
    const item = remisionAEditar.items?.[0] || {};
    setCliente(remisionAEditar.clienteNombre || '');
    setNumeroRemision(remisionAEditar.numero || '');
    setCantidad(String(item.cantidad ?? 1));
    setDescripcion(item.descripcion || '');
    setValorUnitario(item.precioUnitario != null ? String(item.precioUnitario) : '');
    setNombreVendedor('');
    setCedulaVendedor('');
  }, [remisionAEditar]);

  const valorTotal = useMemo(() => {
    const cant = parseFloat(cantidad) || 0;
    const unitario = parseFloat(valorUnitario) || 0;
    return cant * unitario;
  }, [cantidad, valorUnitario]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const buildPayload = () => ({
    cliente,
    numeroRemision,
    cantidad,
    descripcion,
    valorUnitario,
    valorTotal,
    nombreVendedor,
    cedulaVendedor,
    _id: remisionAEditar?._id,
    numero: remisionAEditar?.numero,
  });

  const handleGuardar = () => {
    if (onSave) onSave(buildPayload());
  };

  return (
    <div className="max-w-[1148px] mx-auto p-2 bg-white h-[92vh] font-sans border-[6px] border-[#2E7D32] rounded-3xl my-2 shadow-2xl flex flex-col overflow-hidden">

      <div className="flex flex-col h-full p-4 justify-between">

        <div className="mb-4 border-b-2 border-gray-100 pb-2 flex justify-between items-center gap-3">
          <div className="flex items-start gap-3">
            <button type="button" onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full shrink-0">
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                <Truck size={28} className="text-[#2E7D32]" />
                {isEditMode ? 'Editar Remisión' : 'Nueva Remisión'}
              </h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide">Documento de entrega de mercancía o servicios</p>
            </div>
          </div>
        </div>

        <div className="flex-grow flex flex-col border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm overflow-y-auto">

          <div className="relative flex w-full bg-[#C8E6C9] border-b border-gray-300 p-4 gap-8">
            <div className="flex-1 flex flex-col gap-1 px-2">
              <label className="text-sm font-black text-[#1B5E20] uppercase">Cliente</label>
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
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
                >
                  <option value="">Seleccionar cliente...</option>
                  <option value="nuevo">+ Crear nuevo cliente</option>
                  {listaDeClientes.map((c, i) => (
                    <option key={i} value={c.nombre}>{c.nombre}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="w-[2px] self-stretch bg-[#2E7D32] opacity-20 my-1" />

            <div className="flex-1 flex flex-col gap-1 px-2">
              <label className="text-sm font-black text-[#1B5E20] uppercase">N° Remisión</label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  value={numeroRemision}
                  onChange={(e) => setNumeroRemision(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-lg font-bold focus:outline-none"
                  placeholder="REM-001"
                />
              </div>
            </div>
          </div>

          <div className="w-full p-4 bg-white border-b border-gray-300 flex flex-col gap-1 px-4">
            <label className="text-sm font-black text-gray-700 uppercase">Descripción / Detalles de entrega</label>
            <textarea
              rows="2"
              placeholder="Escribe aquí los detalles del producto o servicio remitido..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 font-medium"
            />
          </div>

          <div className="relative flex w-full bg-[#C8E6C9] border-b border-gray-300 p-4 gap-8">
            <div className="flex-1 flex flex-col gap-1 px-2">
              <label className="text-sm font-black text-[#1B5E20] uppercase">Cantidad</label>
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-lg font-bold focus:outline-none"
              />
            </div>

            <div className="w-[2px] self-stretch bg-[#2E7D32] opacity-20 my-1" />

            <div className="flex-1 flex flex-col gap-1 px-2">
              <label className="text-sm font-black text-[#1B5E20] uppercase">Costo Unitario</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-[#2E7D32] text-lg font-bold">$</span>
                <input
                  type="number"
                  value={valorUnitario}
                  onChange={(e) => setValorUnitario(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-lg font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="relative flex w-full bg-white p-4 gap-8">
            <div className="flex-1 flex flex-col gap-1 px-2">
              <label className="text-sm font-black text-gray-700 uppercase">Vendedor Responsable</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  value={nombreVendedor}
                  onChange={(e) => setNombreVendedor(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-lg font-medium focus:outline-none"
                />
              </div>
            </div>

            <div className="w-[2px] self-stretch bg-gray-300 opacity-50 my-1" />

            <div className="flex-1 flex flex-col gap-1 px-2">
              <label className="text-sm font-black text-gray-700 uppercase">Cédula / ID</label>
              <input
                type="text"
                value={cedulaVendedor}
                onChange={(e) => setCedulaVendedor(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-lg font-medium focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 border-[3px] border-[#2E7D32] rounded-2xl overflow-hidden shadow-md">
            <div className="flex justify-between px-6 py-3 text-xl font-black bg-gray-50 items-center">
              <div className="flex items-center gap-2">
                <div className="bg-[#2E7D32] p-1.5 rounded-full">
                  <DollarSign size={20} className="text-white" />
                </div>
                <span className="text-base uppercase tracking-widest text-gray-700">Valor Total Remisión</span>
              </div>
              <span className="text-[#2E7D32] text-2xl font-black">{formatCurrency(valorTotal)}</span>
            </div>
          </div>

          {isEditMode ? (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleGuardar}
                className="flex-1 py-4 bg-[#22C55E] text-white font-black rounded-2xl text-xl uppercase flex items-center justify-center gap-3 hover:bg-[#16A34A] shadow-xl transition-all active:scale-95"
              >
                <Save size={28} />
                Guardar
              </button>
              <button
                type="button"
                onClick={() => remisionAEditar?._id && onDelete?.(remisionAEditar._id)}
                className="flex-1 py-4 bg-[#DC2626] text-white font-black rounded-2xl text-xl uppercase flex items-center justify-center gap-3 hover:bg-[#B91C1C] shadow-xl transition-all active:scale-95"
              >
                <Trash2 size={28} />
                Eliminar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGuardar}
              className="w-full py-4 bg-[#2E7D32] text-white font-black rounded-2xl text-xl uppercase flex items-center justify-center gap-4 hover:bg-[#1B5E20] shadow-xl transition-all active:scale-95"
            >
              <Save size={28} />
              Crear remisión
            </button>
          )}

          <p className="text-center text-[10px] text-gray-400 mt-2 italic font-semibold uppercase tracking-wider">
            ⓘ Este documento ampara la entrega física de mercancía.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrearRemision;
