// components/MiniWeekLite.js
import React, { useMemo } from 'react';

function startOfWeek(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = x.getDay(); // 0 Sun .. 6 Sat
  x.setDate(x.getDate() - dow); // start Sunday; change to 1..7 if you want Mon start
  x.setHours(0,0,0,0);
  return x;
}
function ymd(d) { return d.toISOString().slice(0,10); }

export default function MiniWeekLite({ onOpenCalendar }) {
  // pull events you already save in localStorage (adjust key/shape if needed)
  let events = [];
  try {
    const raw = localStorage.getItem('rozaCalendarEvents');
    if (raw) events = JSON.parse(raw);
  } catch {}

  // group events by date string (YYYY-MM-DD)
  const byDate = useMemo(() => {
    const map = {};
    for (const e of events) {
      // expect event like { id, date: 'YYYY-MM-DD', title, notes }
      const k = e.date || (e.start && e.start.slice(0,10));
      if (!k) continue;
      (map[k] ||= []).push(e);
    }
    return map;
  }, [events]);

  const today = new Date();
  const weekStart = startOfWeek(today);
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  return (
    <div className="w-full border border-gray-300 rounded-md overflow-hidden">
      {/* single-row week grid (no extra day-name list above) */}
      <div className="grid grid-cols-7">
        {days.map((d) => {
          const key = ymd(d);
          const list = byDate[key] || [];
          const isToday = key === ymd(today);
          return (
            <button
              key={key}
              className={`h-40 w-full p-2 text-left border-r border-b border-gray-200 focus:outline-none hover:bg-gray-50
                ${isToday ? 'bg-blue-50 ring-1 ring-blue-300' : ''}`}
              onClick={() => onOpenCalendar?.(d)}
              title="Open full calendar"
            >
              <div className="text-xs text-gray-500">
                {d.toLocaleDateString(undefined, { weekday: 'short' })} {d.getDate()}
              </div>
              <div className="mt-1 space-y-1">
                {list.slice(0,3).map((e) => (
                  <div key={e.id || e.title} className="text-xs truncate px-2 py-1 rounded bg-gray-100">
                    {e.title || e.notes || '(untitled)'}
                  </div>
                ))}
                {list.length > 3 && (
                  <div className="text-[10px] text-gray-500">+{list.length - 3} more…</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
