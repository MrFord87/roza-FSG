// components/MiniWeek.js
import React, { useMemo, useEffect, useState } from 'react';

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();            // 0 = Sun
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() - day);      // back to Sunday
  return d;
}
function fmtYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function dowShort(d) {
  return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
}

export default function MiniWeek({ onOpenCalendar }) {
  const [events, setEvents] = useState([]);

  // Pull events the same way the main calendar saves them
  useEffect(() => {
    try {
      const raw = localStorage.getItem('rozaCalendarEvents') || '[]';
      setEvents(JSON.parse(raw));
    } catch {
      setEvents([]);
    }
  }, []);

  // Build the 7 days for the current week (Sun-Sat containing today)
  const days = useMemo(() => {
    const sun = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sun);
      d.setDate(sun.getDate() + i);
      return d;
    });
  }, []);

  // Index events by YYYY-MM-DD for quick lookup
  const eventsByDate = useMemo(() => {
    const map = {};
    for (const ev of events) {
      // tolerate different shapes: {date:'2025-08-13'} or {start:'2025-08-13T10:00'}
      const key = (ev.date || ev.start || '').slice(0, 10);
      if (!key) continue;
      (map[key] ||= []).push(ev);
    }
    return map;
  }, [events]);

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d) => {
        const key = fmtYMD(d);
        const todays = eventsByDate[key] || [];
        return (
          <button
            key={key}
            onClick={() => onOpenCalendar?.(d)}
            className="
              text-left border border-gray-300 rounded-md p-2 bg-white
              hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          >
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-gray-500">{dowShort(d)}</span>
              <span className="text-sm font-semibold">{d.getDate()}</span>
            </div>

            {todays.length === 0 ? (
              <div className="mt-2 h-16 text-xs text-gray-400">
                {/* empty slot for consistent height */}
              </div>
            ) : (
              <ul className="mt-2 space-y-1 max-h-24 overflow-auto pr-1">
                {todays.slice(0, 4).map((ev, i) => (
                  <li
                    key={i}
                    className="text-xs bg-gray-100 border border-gray-200 rounded px-1 py-0.5 truncate"
                    title={ev.title || ev.name || ''}
                  >
                    {ev.title || ev.name || 'Untitled'}
                  </li>
                ))}
                {todays.length > 4 && (
                  <li className="text-[10px] text-gray-500">+{todays.length - 4} more</li>
                )}
              </ul>
            )}
          </button>
        );
      })}
    </div>
  );
}
