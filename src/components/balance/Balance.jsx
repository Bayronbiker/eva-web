import React, { useState, useMemo } from 'react';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, Calendar, Filter, FileText, Table, ChevronLeft, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const G = '#2E7D32';
const GL = '#E8F5E9';

const Balance = ({ movimientos = [], resumen: resumenGeneral = { saldo: 0, ingresos: 0, gastos: 0 } }) => {
  const [filtro, setFiltro] = useState('todos');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null); // null = todos
  const [semanaOffset, setSemanaOffset] = useState(0); // 0 = semana actual

  const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0);
  const fmtShort = (n) => {
    if (Math.abs(n) >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
    if (Math.abs(n) >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
    return fmt(n);
  };

  // Genera los 7 días de la semana con offset
  const diasSemana = useMemo(() => {
    const hoy = new Date();
    const lunes = new Date(hoy);
    const diaSemana = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1;
    lunes.setDate(hoy.getDate() - diaSemana + semanaOffset * 7);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(lunes);
      d.setDate(lunes.getDate() + i);
      return d;
    });
  }, [semanaOffset]);

  const etiquetasDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const hoyStr = new Date().toDateString();

  // Filtra movimientos por fecha seleccionada
  const movsFiltradosPorFecha = useMemo(() => {
    if (!fechaSeleccionada) return movimientos;
    return movimientos.filter(m => {
      const fechaMov = new Date(m.fecha).toDateString();
      return fechaMov === fechaSeleccionada.toDateString();
    });
  }, [movimientos, fechaSeleccionada]);

  // Filtra por tipo (ingreso/gasto)
  const movsFiltrados = movsFiltradosPorFecha.filter(m =>
    filtro === 'todos' ? true : m.tipo === filtro
  );

  // Calcula resumen dinámicamente desde los movimientos filtrados por fecha
  const resumen = useMemo(() => {
    const ingresos = movsFiltradosPorFecha.filter(m => m.tipo === 'ingreso').reduce((a, m) => a + (m.monto || 0), 0);
    const gastos = movsFiltradosPorFecha.filter(m => m.tipo === 'gasto').reduce((a, m) => a + (m.monto || 0), 0);
    return { ingresos, gastos, saldo: ingresos - gastos };
  }, [movsFiltradosPorFecha]);

  const tituloFecha = fechaSeleccionada
    ? fechaSeleccionada.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
    : 'Todos los movimientos';

  // ── Exportar PDF ──────────────────────────────────────────────────────────
  const exportarPDF = () => {
    const doc = new jsPDF();
    const fechaHoy = new Date().toLocaleDateString('es-CO');

    doc.setFillColor(46, 125, 50);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('EVA - Balance Financiero', 14, 20);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de exportación: ${fechaHoy}`, 14, 40);
    doc.text(`Filtro: ${tituloFecha}`, 14, 48);

    // Resumen
    doc.setFillColor(232, 245, 233);
    doc.roundedRect(14, 55, 55, 28, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(46, 125, 50);
    doc.text('INGRESOS', 14 + 27, 65, { align: 'center' });
    doc.setFontSize(13);
    doc.text(fmt(resumen.ingresos), 14 + 27, 75, { align: 'center' });

    doc.setFillColor(255, 235, 238);
    doc.roundedRect(75, 55, 55, 28, 3, 3, 'F');
    doc.setTextColor(239, 83, 80);
    doc.setFontSize(11);
    doc.text('GASTOS', 75 + 27, 65, { align: 'center' });
    doc.setFontSize(13);
    doc.text(fmt(resumen.gastos), 75 + 27, 75, { align: 'center' });

    doc.setFillColor(26, 26, 26);
    doc.roundedRect(136, 55, 60, 28, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text('BALANCE', 136 + 30, 65, { align: 'center' });
    doc.setFontSize(13);
    doc.setTextColor(resumen.saldo >= 0 ? '#4CAF50' : '#ef5350');
    doc.setTextColor(resumen.saldo >= 0 ? 76 : 239, resumen.saldo >= 0 ? 175 : 83, resumen.saldo >= 0 ? 80 : 80);
    doc.text(fmt(resumen.saldo), 136 + 30, 75, { align: 'center' });

    // Tabla de movimientos
    let y = 95;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalle de Movimientos', 14, y);
    y += 8;

    // Encabezado tabla
    doc.setFillColor(46, 125, 50);
    doc.rect(14, y, 182, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('Fecha', 16, y + 5.5);
    doc.text('Descripción', 46, y + 5.5);
    doc.text('Categoría', 106, y + 5.5);
    doc.text('Tipo', 146, y + 5.5);
    doc.text('Monto', 170, y + 5.5);
    y += 10;

    movsFiltrados.forEach((m, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFillColor(i % 2 === 0 ? 249 : 255, i % 2 === 0 ? 249 : 255, i % 2 === 0 ? 249 : 255);
      doc.rect(14, y - 3, 182, 8, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      const fecha = new Date(m.fecha).toLocaleDateString('es-CO');
      const desc = (m.descripcion || m.categoria || '').substring(0, 28);
      const cat = (m.categoria || '').substring(0, 18);
      doc.text(fecha, 16, y + 2);
      doc.text(desc, 46, y + 2);
      doc.text(cat, 106, y + 2);
      doc.setTextColor(m.tipo === 'ingreso' ? 46 : 239, m.tipo === 'ingreso' ? 125 : 83, m.tipo === 'ingreso' ? 50 : 80);
      doc.text(m.tipo, 146, y + 2);
      doc.setTextColor(0, 0, 0);
      doc.text((m.tipo === 'ingreso' ? '+' : '-') + fmtShort(m.monto), 170, y + 2);
      y += 9;
    });

    doc.save(`EVA_Balance_${fechaHoy.replace(/\//g, '-')}.pdf`);
  };

  // ── Exportar Excel ────────────────────────────────────────────────────────
  const exportarExcel = () => {
    const fechaHoy = new Date().toLocaleDateString('es-CO');
    const filas = movsFiltrados.map(m => ({
      'Fecha': new Date(m.fecha).toLocaleDateString('es-CO'),
      'Descripción': m.descripcion || m.categoria || '',
      'Categoría': m.categoria || '',
      'Tipo': m.tipo,
      'Monto': m.monto || 0,
      'Método de pago': m.metodoPago || '',
    }));

    // Hoja de resumen
    const resumenFilas = [
      { 'Concepto': 'Total Ingresos', 'Valor': resumen.ingresos },
      { 'Concepto': 'Total Gastos', 'Valor': resumen.gastos },
      { 'Concepto': 'Balance', 'Valor': resumen.saldo },
      { 'Concepto': 'Filtro aplicado', 'Valor': tituloFecha },
      { 'Concepto': 'Fecha de exportación', 'Valor': fechaHoy },
    ];

    const wb = XLSX.utils.book_new();
    const wsMovimientos = XLSX.utils.json_to_sheet(filas);
    const wsResumen = XLSX.utils.json_to_sheet(resumenFilas);

    // Anchos de columna
    wsMovimientos['!cols'] = [{ wch: 12 }, { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 14 }, { wch: 18 }];
    wsResumen['!cols'] = [{ wch: 22 }, { wch: 20 }];

    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');
    XLSX.utils.book_append_sheet(wb, wsMovimientos, 'Movimientos');
    XLSX.writeFile(wb, `EVA_Balance_${fechaHoy.replace(/\//g, '-')}.xlsx`);
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Selector de semana */}
      <div style={{ background: GL, borderRadius: '16px', padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: G }}>
              {semanaOffset === 0 ? 'Esta semana' : semanaOffset === -1 ? 'Semana anterior' : `Semana ${semanaOffset > 0 ? '+' : ''}${semanaOffset}`}
            </span>
            {fechaSeleccionada && (
              <button onClick={() => setFechaSeleccionada(null)}
                style={{ fontSize: '10px', fontWeight: '700', color: G, background: 'rgba(46,125,50,0.15)', border: 'none', borderRadius: '20px', padding: '2px 8px', cursor: 'pointer' }}>
                Ver todos
              </button>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button onClick={() => setSemanaOffset(s => s - 1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
              <ChevronLeft size={16} color={G} />
            </button>
            <Calendar size={16} color={G} />
            <button onClick={() => setSemanaOffset(s => s + 1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
              <ChevronRight size={16} color={G} />
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {diasSemana.map((dia, i) => {
            const esHoy = dia.toDateString() === hoyStr;
            const seleccionado = fechaSeleccionada && dia.toDateString() === fechaSeleccionada.toDateString();
            const tieneMovs = movimientos.some(m => new Date(m.fecha).toDateString() === dia.toDateString());
            return (
              <button key={i} type="button" onClick={() => setFechaSeleccionada(seleccionado ? null : dia)}
                style={{
                  flex: 1, padding: '8px 4px', borderRadius: '10px', border: seleccionado ? `2px solid ${G}` : '2px solid transparent',
                  background: seleccionado ? G : esHoy ? 'rgba(46,125,50,0.2)' : 'rgba(46,125,50,0.08)',
                  cursor: 'pointer', fontFamily: 'inherit', position: 'relative'
                }}>
                <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: seleccionado ? 'rgba(255,255,255,0.85)' : '#9e9e9e', textTransform: 'uppercase' }}>{etiquetasDias[i]}</p>
                <p style={{ margin: '2px 0 0', fontSize: '11px', fontWeight: '800', color: seleccionado ? '#fff' : esHoy ? G : '#757575' }}>{dia.getDate()}</p>
                {tieneMovs && <div style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: seleccionado ? 'rgba(255,255,255,0.7)' : G }} />}
              </button>
            );
          })}
        </div>
        {fechaSeleccionada && (
          <p style={{ margin: '10px 0 0', fontSize: '12px', color: G, fontWeight: '600', textAlign: 'center' }}>
            Mostrando: {tituloFecha}
          </p>
        )}
      </div>

      {/* Tarjetas resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: GL, borderRadius: '16px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ArrowUpCircle size={16} color={G} />
            <span style={{ fontSize: '11px', fontWeight: '700', color: G, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ingresos</span>
          </div>
          <p style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: G }}>{fmtShort(resumen.ingresos)}</p>
        </div>
        <div style={{ background: '#FFEBEE', borderRadius: '16px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ArrowDownCircle size={16} color="#ef5350" />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#ef5350', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gastos</span>
          </div>
          <p style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#ef5350' }}>{fmtShort(resumen.gastos)}</p>
        </div>
      </div>

      {/* Balance total */}
      <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '24px', marginBottom: '12px' }}>
        <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: '700', color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>Balance Total</p>
        <p style={{ margin: 0, fontSize: '38px', fontWeight: '900', color: resumen.saldo >= 0 ? '#4CAF50' : '#ef5350', letterSpacing: '-1px', textAlign: 'center' }}>{fmt(resumen.saldo)}</p>
      </div>

      {/* Botones exportar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button onClick={exportarPDF} type="button"
          style={{ flex: 1, padding: '13px', borderRadius: '14px', border: 'none', background: '#ef5350', color: '#fff', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', fontFamily: 'inherit' }}>
          <FileText size={16} /> Exportar PDF
        </button>
        <button onClick={exportarExcel} type="button"
          style={{ flex: 1, padding: '13px', borderRadius: '14px', border: 'none', background: G, color: '#fff', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', fontFamily: 'inherit' }}>
          <Table size={16} /> Exportar Excel
        </button>
      </div>

      {/* Lista de movimientos */}
      <div style={{ background: '#fff', borderRadius: '20px', border: '1.5px solid #f0f0f0', overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1a1a1a' }}>
            Movimientos {fechaSeleccionada ? `· ${fechaSeleccionada.getDate()}/${fechaSeleccionada.getMonth() + 1}` : ''}
          </h3>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[{ id: 'todos', label: 'Todos' }, { id: 'ingreso', label: 'Ingresos' }, { id: 'gasto', label: 'Gastos' }].map(f => (
              <button key={f.id} type="button" onClick={() => setFiltro(f.id)}
                style={{ padding: '5px 12px', borderRadius: '20px', border: 'none', background: filtro === f.id ? G : '#F5F5F5', color: filtro === f.id ? '#fff' : '#9e9e9e', fontWeight: '700', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {movsFiltrados.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <DollarSign size={32} color="#e0e0e0" />
            <p style={{ margin: '10px 0 0', fontSize: '13px', color: '#bdbdbd' }}>
              {fechaSeleccionada ? 'Sin movimientos en esta fecha' : 'No hay movimientos registrados'}
            </p>
          </div>
        ) : (
          <div>
            {movsFiltrados.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderBottom: i < movsFiltrados.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: m.tipo === 'ingreso' ? GL : '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {m.tipo === 'ingreso' ? <ArrowUpCircle size={17} color={G} /> : <ArrowDownCircle size={17} color="#ef5350" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.descripcion || m.categoria || (m.tipo === 'ingreso' ? 'Ingreso' : 'Gasto')}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#9e9e9e' }}>
                    {m.fecha ? new Date(m.fecha).toLocaleDateString('es-CO') : ''}
                    {m.metodoPago ? ' · ' + m.metodoPago : ''}
                  </p>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '900', color: m.tipo === 'ingreso' ? G : '#ef5350', flexShrink: 0 }}>
                  {m.tipo === 'ingreso' ? '+' : '-'}{fmtShort(m.monto)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Balance;
