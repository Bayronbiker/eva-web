import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS_ES = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function CalendarWidget() {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const cells = [];
  const offset = firstDay;
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) => today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
  const isHighlight = (d) => d && (isToday(d) || d % 7 === 0 || d === 15);

  return (
    <div className="eva-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
          style={{ color: 'var(--eva-text-muted)' }}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-semibold" style={{ color: 'var(--eva-text)' }}>
          {MONTHS_ES[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
          style={{ color: 'var(--eva-text-muted)' }}
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS_ES.map((day) => (
          <div key={day} className="py-1 text-xs font-semibold" style={{ color: 'var(--eva-text-muted)' }}>
            {day}
          </div>
        ))}
        {cells.map((d, i) => (
          <div key={i} className="flex justify-center py-1">
            {d != null ? (
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  isHighlight(d) ? 'text-white' : ''
                }`}
                style={{
                  background: isHighlight(d) ? 'var(--eva-primary)' : 'transparent',
                  color: isHighlight(d) ? 'white' : 'var(--eva-text)',
                }}
              >
                {d}
              </span>
            ) : (
              <span />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
