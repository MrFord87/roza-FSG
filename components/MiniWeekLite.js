// components/MiniWeek.js
import React, { useEffect, useMemo, useState } from 'react';

// Keys we already use elsewhere
const EVENTS_KEY = 'rozaCalendarEvents';
const FOCUS_KEY  = 'rozaCalendarFocusDate';

function startOfWeek(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay();             // 0 = Sun .. 6 = Sat
  x.setDate(x.getDate() - day);       // back to Sunday
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function fmtRangeLabel(sun, sat) {
  const opts = { month: 'short', day: 'numeric' };
  const left  = sun.toLocaleDateString(undefined, opts);
  const right = sat.toLocaleDateString(undefined, opts);
  return `Week of ${left} – ${right}`;
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

// light, optional color tags by event.type
const typeChip = (type) => {
  if (!type) return '';
  const map = {
    meeting: 'bg-blue-100 text-blue-700',
    deadline: 'bg-red-100 text-red-700',
    task: 'bg-amber-100 text-amber-700',
  };
  return map[type?.toLowerCase()] || 'bg-gray-100 text-gray-700';
};

export default function MiniWeek({ onOpenCalendar }) {
  const [events, setEvents] = useState([]);

  // load events saved by your main Calendar (localStorage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(EVENTS_KEY);
      if (raw) setEvents(JSON.parse(raw));
    } catch {
      setEvents([]);
    }
  }, []);

  const week = useMemo(() => {
    const today = new Date();
    const sun = startOfWeek(today);
    const days = Array.from({ length: 7 }, (_, i) => addDays(sun, i));
    return { sun, days, sat: addDays(sun, 6) };
  }, []);

  // bucket events by day (expects items shaped like { date:'YYYY-MM-DD', title, type })
  const byDay = useMemo(() => {
    const buckets = {};
    for (const d of week.days) {
      buckets[d.toDateString()] = [];
    }

    for (const ev of events || []) {
      // accept several shapes:
      // - ev.date (YYYY-MM-DD)
      // - ev.start (ISO)   -> prefer start
      // - ev.when          -> fallback
      const iso = ev.start || ev.date || ev.when;
      if (!iso) continue;
      const dt = new Date(iso);
      for (const d of week.days) {
        if (sameDay(dt, d)) {
          buckets[d.toDateString()].push(ev);
          break;
        }
      }
    }
    // sort events by time if they have one
    for (const key of Object.keys(buckets)) {
      buckets[key].sort((a, b) => String(a.start || a.date || '').localeCompare(String(b.start || b.date || '')));
    }
    return buckets;
  }, [events, week.days]);

  const handleOpen = (d) => {
    try {
      localStorage.setItem(FOCUS_KEY, d.toISOString());
    } catch {}
    onOpenCalendar?.(d);
  };

  return (
    <div className="p-4">
      <div className="text-sm text-gray-500 mb-3">{fmtRangeLabel(week.sun, week.sat)}</div>

      <div className="flex gap-2 overflow-x-auto">
        {week.days.map((d) => {
          const key = d.toDateString();
          const items = byDay[key] || [];
          const isToday = sameDay(d, new Date());

          return (
            <button
              key={key}
              onClick={() => handleOpen(d)}
              className={[
                'min-w-[110px] rounded border px-3 py-2 text-left',
                isToday ? 'bg-gray-100 border-gray-400' : 'bg-white border-gray-300',
                'hover:shadow transition'
              ].join(' ')}
              title="Open in Calendar"
            >
              <div className="text-xs uppercase tracking-wide text-gray-500">
                {d.toLocaleDateString(undefined, { weekday: 'short' })}
              </div>
              <div className="text-sm font-semibold -mt-0.5">
                {d.toLocaleDateString(undefined, { day: '2-digit' })}
              </div>

              <div className="mt-2 space-y-1">
                {items.length === 0 ? (
                  <div className="text-xs text-gray-400">—</div>
                ) : (
                  items.slice(0, 3).map((ev, i) => (
                    <div
                      key={i}
                      className={[
                        'text-xs rounded px-2 py-1 border',
                        'border-gray-200',
                        typeChip(ev.type)
                      ].join(' ')}
                    >
                      {ev.title || ev.name || ev.text || 'Untitled'}
                    </div>
                  ))
                )}
                {items.length > 3 && (
                  <div className="text-[11px] text-gray-500">+{items.length - 3} more…</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
