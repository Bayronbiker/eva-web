import React, { useState } from 'react';
import Balance from './Balance';
import SituacionFinanciera from './SituacionFinanciera';
import { useTheme } from '../../context/ThemeContext';

const PALETA_CLARA = {
  bg: '#F8FAFB', card: '#FFFFFF', texto: '#1a1a1a', textoMuted: '#9e9e9e',
  borde: '#f0f0f0', verde: '#2E7D32', verdeBg: '#E8F5E9',
};
const PALETA_OSCURA = {
  bg: '#0D1117', card: '#161B22', texto: '#E6EDF3', textoMuted: '#7D8590',
  borde: '#30363D', verde: '#3FB950', verdeBg: '#0D2818',
};

const TABS = [
  { id: 'cajaMenor',           label: 'Caja Menor' },
  { id: 'situacionFinanciera', label: 'Situación Financiera' },
];

export default function BalanceTabs({ movimientos, resumen, clientes, onNavigate, onVerLista }) {
  const { theme } = useTheme();
  const p = theme === 'dark' ? PALETA_OSCURA : PALETA_CLARA;
  const [tabActiva, setTabActiva] = useState('cajaMenor');

  return (
    <div>
      {/* ── Barra de tabs ── */}
      <div style={{
        display: 'flex', gap: 0, marginBottom: 24,
        borderBottom: `2px solid ${p.borde}`,
      }}>
        {TABS.map(tab => {
          const activa = tabActiva === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              style={{
                padding: '10px 22px',
                background: 'none',
                border: 'none',
                borderBottom: activa ? `2px solid ${p.verde}` : '2px solid transparent',
                marginBottom: -2,
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: activa ? 700 : 400,
                color: activa ? p.verde : p.textoMuted,
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Contenido ── */}
      {tabActiva === 'cajaMenor' ? (
        <Balance movimientos={movimientos} resumen={resumen} onVerLista={onVerLista} onNavigate={onNavigate} />
      ) : (
        <SituacionFinanciera movimientos={movimientos} onNavigate={onNavigate} />
      )}
    </div>
  );
}
