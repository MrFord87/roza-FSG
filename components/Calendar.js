// components/Calendar.js
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar as RBC, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const safeGet = (k, f) => { if (typeof window === 'undefined') return f; try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : f; } catch { return f; } };
const safeSet = (k, v) => { if (typeof window === 'undefined') return; try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export default function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [draft, setDraft] = useState({ open: false, start: null, end: null, text: '' });

  useEffect(() => setEvents(safeGet('roza_calendar_events', [])), []);
  useEffect(() => safeSet('roza_calendar_events', events), [events]);

  const onSelectSlot = useCallback(({ start, end }) => {
    // Open a simple inline editor at the top
    setDraft({ open: true, start, end, text: '' });
  }, []);

  const addEvent = () => {
    const title = draft.text.trim();
    if (!title) return;
    const newEvent = {
      id: crypto.randomUUID(),
      title,
      start: draft.start,
      end: draft.end,
      completed: false,
    };
    setEvents([newEvent, ...events]);
    setDraft({ open: false, start: null, end: null, text: '' });
  };

  const deleteEvent = (id) => {
    if (!window.confirm('Delete this event?')) return;
    setEvents(events.filter((e) => e.id !== id));
  };

  const toggleComplete = (id) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e)));
  };

  const editEvent = (id) => {
    const existing = events.find((e) => e.id === id);
    const next = window.prompt('Update note text:', existing?.title || '');
    if (next == null) return;
    setEvents(events.map((e) => (e.id === id ? { ...e, title: next.trim() } : e)));
  };

  const eventPropGetter = useCallback(
    (event) => ({
      style: {
        backgroundColor: event.completed ? '#16a34a' : '#2563eb',
        border: 0,
        color: '#fff',
        opacity: 0.9,
      },
      className: event.completed ? 'line-through' : '',
    }),
    []
  );

  const components = useMemo(
    () => ({
      event: ({ event }) => (
        <div className="flex flex-col">
          <div className="font-medium">{event.title}</div>
          <div className="mt-1 flex gap-1">
            <button onClick={() => toggleComplete(event.id)} className="text-xs px-1 rounded bg-white text-black">
              {event.completed ? 'Uncomplete' : 'Complete'}
            </button>
            <button onClick={() => editEvent(event.id)} className="text-xs px-1 rounded bg-white text-black">
              Edit
            </button>
            <button onClick={() => deleteEvent(event.id)} className="text-xs px-1 rounded bg-white text-red-600">
              Delete
            </button>
          </div>
        </div>
      ),
    }),
    [events]
  );

  return (
    <div style={{ height: '80vh', padding: '1rem' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>ROZA Calendar</h1>

      {draft.open && (
        <div style={{ border: '1px solid #ddd', padding: '0.75rem', borderRadius: 8, marginBottom: '0.75rem' }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            Add Note for {moment(draft.start).format('MMM D, YYYY, h:mm A')}
          </div>
          <input
            type="text"
            value={draft.text}
            onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}
            placeholder="Type your note…"
            style={{ width: '100%', border: '1px solid #ccc', padding: 8, color: '#000' }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => setDraft({ open: false, start: null, end: null, text: '' })}>Cancel</button>
            <button onClick={addEvent} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '4px 8px', borderRadius: 6 }}>
              Save
            </button>
          </div>
        </div>
      )}

      <RBC
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={['day', 'week', 'month']}
        selectable
        onSelectSlot={onSelectSlot}
        eventPropGetter={eventPropGetter}
        style={{ height: '100%' }}
      />
    </div>
  );
}
