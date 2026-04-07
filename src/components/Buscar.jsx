import React, { useState } from 'react';
import { Search } from 'lucide-react';

const Buscar = () => {
  const [valor, setValor] = useState('');

  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2"
        size={18}
        style={{ color: 'var(--eva-text-muted)' }}
      />
      <input
        type="text"
        placeholder="Buscar..."
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="eva-input py-2 pl-10 pr-4 text-sm"
      />
    </div>
  );
};

export default Buscar;
