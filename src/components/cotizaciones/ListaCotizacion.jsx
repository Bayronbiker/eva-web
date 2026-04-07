import React from 'react';
import { ClipboardList, Plus, FileSpreadsheet } from 'lucide-react';

const ListaCotizacion = ({ cotizaciones = [], onSeleccionar, onNueva }) => {

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(amount ?? 0);
  };

  const descPrimera = (c) => {
    const it = c.items?.[0];
    return it?.descripcion || '—';
  };

  if (!cotizaciones.length) {
    return (
      <div className="max-w-[1148px] mx-auto p-8 bg-white rounded-3xl border-[6px] border-[#2E7D32] shadow-xl">
        <div
          className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-3xl"
          style={{
            background: 'linear-gradient(165deg, #E8F5E9 0%, #F8FAFB 45%, #C8E6C9 100%)',
            border: '2px dashed rgba(46, 125, 50, 0.35)',
          }}
        >
          <div className="mb-6 p-5 rounded-full bg-white shadow-md border-2 border-[#2E7D32]/20">
            <FileSpreadsheet size={48} className="text-[#2E7D32]" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#1B5E20] uppercase tracking-tight mb-3">
            No tienes ninguna cotización creada
          </h2>
          <p className="text-gray-600 font-medium max-w-md mb-10 text-sm md:text-base">
            Crea tu primera cotización para verla aquí. Los datos se guardan en tu cuenta y se sincronizan con la app.
          </p>
          <button
            type="button"
            onClick={onNueva}
            className="inline-flex items-center gap-3 bg-[#2E7D32] text-white px-10 py-4 rounded-2xl font-black text-lg uppercase shadow-lg hover:bg-[#1B5E20] hover:shadow-xl transition-all active:scale-[0.98]"
          >
            <Plus size={22} strokeWidth={2.5} />
            Crear cotización
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1148px] mx-auto p-6 bg-white rounded-3xl border-[6px] border-[#2E7D32] shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b-2 border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <ClipboardList size={32} className="text-[#2E7D32]" />
          <h1 className="text-3xl font-black text-gray-800 uppercase">Cotizaciones</h1>
        </div>
        <button
          type="button"
          onClick={onNueva}
          className="flex items-center gap-2 bg-[#2E7D32] text-white px-6 py-3 rounded-xl font-black uppercase text-sm hover:bg-[#1B5E20] transition-all shadow-md"
        >
          <Plus size={20} />
          Crear cotización
        </button>
      </div>

      <div className="space-y-4">
        {cotizaciones.map((c) => (
          <button
            key={c._id || c.id}
            type="button"
            onClick={() => onSeleccionar(c)}
            className="w-full text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-[#C8E6C9] rounded-2xl border-2 border-[#2E7D32]/20 hover:border-[#2E7D32] hover:shadow-md transition-all cursor-pointer"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-grow">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#1B5E20] uppercase tracking-wider">Número</span>
                <span className="text-lg font-bold text-gray-900">{c.numero}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#1B5E20] uppercase tracking-wider">Cliente</span>
                <span className="text-lg font-bold text-gray-800">{c.clienteNombre}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#1B5E20] uppercase tracking-wider">Descripción</span>
                <span className="text-sm font-medium text-gray-700 truncate max-w-[280px]">{descPrimera(c)}</span>
              </div>
            </div>
            <div className="flex flex-col sm:items-end border-t sm:border-t-0 sm:border-l border-[#2E7D32]/15 pt-3 sm:pt-0 sm:pl-6 sm:min-w-[140px]">
              <span className="text-[10px] font-black text-[#1B5E20] uppercase tracking-wider">Total</span>
              <span className="text-2xl font-black text-[#2E7D32]">{formatCurrency(c.total)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListaCotizacion;
