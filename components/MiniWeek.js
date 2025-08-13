// components/MiniWeek.js
import React, { useMemo, useState, useEffect } from 'react';

/**
 * Reads events from the same place your main calendar stores them.
 * This helper tries a few common keys to be resilient.
 * Expected shapes it can handle:
 *  - Array of { date: 'YYYY-MM-DD', text/title/... }
 *  - Object map: { 'YYYY-MM-DD': [ {text}, {text} ] }
 */
function loadEvents() {
  let raw =
    localStorage.getItem('rozaCalendarEvents') ||
    localStorage.getItem('calendarEvents') ||
    localStorage.getItem('events');
  if (!raw) return [];

  try {
    const data = JSON.parse(raw);

    // If it's already an array of "flat" events
    if (Array.isArray(data)) {
      return data
        .map((e) => ({
          date: e.date || e.day || e.when || '',
          text: e.text || e.title || e.note || '',
        }))
        .filter((e) => e.date && e.text);
    }

    // If it's a date->array map
    if (data && typeof data === 'object') {
      const out = [];
      for (const [date, list] of Object.entries(data)) {
        if (Array.isArray(list)) {
          list.forEach((itm) =>
            out.push({
              date,
              text: itm?.text || itm?.title || itm?.note || '',
            })
          );
        }
      }
      return out;
    }
  } catch {
    /* ignore parse errors */
  }
  return [];
}

function fmtYMD(d) {
  return d.toISOString().slice(0, 10);
}

function startOfWeek(date) {
  const d = new Date(date);
  // Week starts on Sunday to match your full calendar tab
  const day = d.getDay(); // 0=Sun
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function MiniWeek({ onOpenCalendar }) {
  const [anchor, setAnchor] = useState(() => startOfWeek(new Date()));
  const [events, setEvents] = useState([]);

  useEffect(() => {
    try {
      setEvents(loadEvents());
    } catch {}
  }, []);

  // Re-read events if another tab updates localStorage (optional but nice)
  useEffect(() => {
    const onStorage = (e) => {
      if (
        ['rozaCalendarEvents', 'calendarEvents', 'events'].includes(e.key)
      ) {
        setEvents(loadEvents());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const days = useMemo(() => {
    // 7 days starting from anchor
    return new Array(7).fill(0).map((_, i) => {
      const d = new Date(anchor);
      d.setDate(anchor.getDate() + i);
      return d;
    });
  }, [anchor]);

  const eventsByDay = useMemo(() => {
    const map = {};
    for (const e of events) {
      if (!e.date) continue;
      (map[e.date] ||= []).push(e);
    }
    return map;
  }, [events]);

  const todayYMD = fmtYMD(new Date());

  const jumpToCalendar = (date) => {
    // Save focus date for the main Calendar tab
    try {
      localStorage.setItem(
        'rozaCalendarFocusDate',
        new Date(date).toISOString()
      );
    } catch {}
    // Ask parent Dashboard to switch tabs (best UX).
    if (typeof onOpenCalendar === 'function') {
      onOpenCalendar(new Date(date));
    } else {
      // Fallback: if you ever wire tabs via hash or route
      window.location.hash = '#calendar';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white text-black">
      {/* Header controls */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="font-semibold">This Week</div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 border rounded hover:bg-gray-50"
            onClick={() =>
              setAnchor((d) => {
                const nd = new Date(d);
                nd.setDate(nd.getDate() - 7);
                return startOfWeek(nd);
              })
            }
          >
            ◀
          </button>
          <button
            className="px-2 py-1 border rounded hover:bg-gray-50"
            onClick={() => setAnchor(startOfWeek(new Date()))}
          >
            Today
          </button>
          <button
            className="px-2 py-1 border rounded hover:bg-gray-50"
            onClick={() =>
              setAnchor((d) => {
                const nd = new Date(d);
                nd.setDate(nd.getDate() + 7);
                return startOfWeek(nd);
              })
            }
          >
            ▶
          </button>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-7 text-xs text-gray-600 border-b">
        {days.map((d) => (
          <div key={`h-${fmtYMD(d)}`} className="px-2 py-1">
            {d.toLocaleDateString(undefined, { weekday: 'short' })}
          </div>
        ))}
      </div>

      {/* One-row week grid */}
      <div className="grid grid-cols-7">
        {days.map((d) => {
          const ymd = fmtYMD(d);
          const dayEvents = eventsByDay[ymd] || [];
          const isToday = ymd === todayYMD;

          return (
            <button
              key={ymd}
              onClick={() => jumpToCalendar(d)}
              className={[
                'h-32 w-full text-left px-2 py-2 border-l first:border-l-0 focus:outline-none',
                'hover:bg-gray-50',
                isToday ? 'bg-blue-50' : '',
              ].join(' ')}
              title="Open in full calendar"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">
                  {d.getDate()}
                </div>
                {isToday && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white">
                    Today
                  </span>
                )}
              </div>

              {/* events preview (up to 3) */}
              <ul className="mt-2 space-y-1 text-xs">
                {dayEvents.slice(0, 3).map((e, idx) => (
                  <li
                    key={`${ymd}-${idx}`}
                    className="truncate leading-snug"
                  >
                    • {e.text}
                  </li>
                ))}
                {dayEvents.length > 3 && (
                  <li className="text-[10px] text-gray-500">
                    + {dayEvents.length - 3} more
                  </li>
                )}
                {dayEvents.length === 0 && (
                  <li className="text-[11px] text-gray-400 italic">
                    — no notes —
                  </li>
                )}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}
