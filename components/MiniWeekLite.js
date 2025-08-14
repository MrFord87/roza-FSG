// components/MiniWeek.js
import React, { useMemo } from 'react';

const EVENTS_KEY = 'rozaCalendarEvents'; // same key your main calendar uses

function startOfWeek(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay();          // 0=Sun
  x.setDate(x.getDate() - day);    // go back to Sunday
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function ymd(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function readEvents() {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    // normalize to { title, start, end?, allDay? }
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function MiniWeek({ onOpenCalendar }) {
  // compute week range (this Sunday → Saturday)
  const days = useMemo(() => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, []);

  // collect events for this week
  const eventsByDay = useMemo(() => {
    const all = readEvents();
    const map = {};
    for (const d of days) map[ymd(d)] = [];

    for (const ev of all) {
      if (!ev || !ev.start) continue;
      const s = new Date(ev.start);
      const e = ev.end ? new Date(ev.end) : endOfDay(s);
      // For each day in our week, include the event if it overlaps the day
      for (const d of days) {
        const ds = d;              // start of that day
        const de = endOfDay(d);    // end of that day
        if (e >= ds && s <= de) {
          map[ymd(d)].push(ev);
        }
      }
    }
    // sort events by start time
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => new Date(a.start) - new Date(b.start));
    }
    return map;
  }, [days]);

  const todayYmd = ymd(new Date());

  const handleOpen = (date) => {
    try {
      localStorage.setItem('rozaCalendarFocusDate', date.toISOString());
    } catch {}
    if (typeof onOpenCalendar === 'function') onOpenCalendar(date);
  };

  return (
    <div className="miniweek not-prose">
      {/* one-row, seven-column grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date) => {
          const key = ymd(date);
          const isToday = key === todayYmd;
          const evs = eventsByDay[key] || [];
          return (
            <button
              key={key}
              onClick={() => handleOpen(date)}
              className={[
                'text-left rounded-md border p-2 bg-white hover:shadow transition',
                isToday ? 'border-blue-500 ring-1 ring-blue-300' : 'border-gray-300',
              ].join(' ')}
            >
              {/* day label */}
              <div className="flex items-baseline justify-between">
                <div className="text-xs font-medium text-gray-600">
                  {date.toLocaleDateString(undefined, { weekday: 'short' })}
                </div>
                <div className="text-sm font-semibold">{date.getDate()}</div>
              </div>

              {/* events (first few) */}
              <div className="mt-2 space-y-1">
                {evs.length === 0 ? (
                  <div className="text-[11px] text-gray-400 italic">—</div>
                ) : (
                  evs.slice(0, 3).map((ev, i) => (
                    <div
                      key={i}
                      className="text-[11px] leading-snug px-2 py-1 rounded bg-gray-100 text-gray-800"
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  ))
                )}
                {evs.length > 3 && (
                  <div className="text-[11px] text-gray-500">+{evs.length - 3} more…</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
