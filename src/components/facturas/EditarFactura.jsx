import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3 } from 'lucide-react';

const EditarFactura = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-8" style={{ background: 'var(--eva-bg)' }}>
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/home')}
          className="rounded-xl border p-2.5 transition-colors"
          style={{ borderColor: 'var(--eva-border)', color: 'var(--eva-text-muted)' }}
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--eva-text)' }}>
          Editar factura
        </h1>
      </div>
      <div className="eva-card flex flex-col items-center justify-center py-16">
        <Edit3 size={48} className="mb-4 opacity-50" style={{ color: 'var(--eva-text-muted)' }} />
        <p className="mb-2 font-medium" style={{ color: 'var(--eva-text)' }}>
          Factura #{id}
        </p>
        <p className="mb-6 text-sm" style={{ color: 'var(--eva-text-muted)' }}>
          Formulario de edición en desarrollo
        </p>
        <button onClick={() => navigate('/home')} className="eva-btn-primary">
          Volver al panel
        </button>
      </div>
    </div>
  );
};

export default EditarFactura;
