import React from 'react';
import { Users, Phone, Mail, Plus, UserRound } from 'lucide-react';

const ListaClientes = ({ clientes = [], onNuevo, onEdit }) => {

  if (!clientes.length) {
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
            <UserRound size={48} className="text-[#2E7D32]" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#1B5E20] uppercase tracking-tight mb-3">
            No tienes ningún cliente creado
          </h2>
          <p className="text-gray-600 font-medium max-w-md mb-10 text-sm md:text-base">
            Registra tus clientes para usarlos en facturas, cotizaciones y remisiones. Los datos se sincronizan con la app.
          </p>
          <button
            type="button"
            onClick={onNuevo}
            className="inline-flex items-center gap-3 bg-[#2E7D32] text-white px-10 py-4 rounded-2xl font-black text-lg uppercase shadow-lg hover:bg-[#1B5E20] hover:shadow-xl transition-all active:scale-[0.98]"
          >
            <Plus size={22} strokeWidth={2.5} />
            Crear cliente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1148px] mx-auto p-6 bg-white rounded-3xl border-[6px] border-[#2E7D32] shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b-2 border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <Users size={32} className="text-[#2E7D32]" />
          <h1 className="text-3xl font-black text-gray-800 uppercase">Mis Clientes</h1>
        </div>
        <button
          type="button"
          onClick={onNuevo}
          className="flex items-center gap-2 bg-[#2E7D32] text-white px-6 py-3 rounded-xl font-black uppercase text-sm hover:bg-[#1B5E20] transition-all shadow-md"
        >
          <Plus size={20} />
          Nuevo cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clientes.map((c) => (
          <div
            key={c._id || c.id}
            role="button"
            tabIndex={0}
            onClick={() => onEdit(c)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onEdit(c); }}
            className="p-6 bg-[#C8E6C9] rounded-2xl border-2 border-[#2E7D32]/20 shadow-sm flex flex-col gap-2 cursor-pointer hover:border-[#2E7D32] hover:shadow-md transition-all transform active:scale-95"
          >
            <div className="flex items-center justify-between border-b border-[#2E7D32]/10 pb-2 mb-2">
              <span className="text-xl font-black text-[#1B5E20] uppercase">{c.nombre}</span>
              <span className="text-[10px] bg-white px-2 py-1 rounded-md font-bold text-gray-500 uppercase">{c.ciudad || '—'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={14} className="text-[#2E7D32]" /> {c.telefono || 'Sin teléfono'}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={14} className="text-[#2E7D32]" /> {c.email || '—'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaClientes;
