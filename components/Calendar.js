// components/Calendar.js
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar as RBC, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

// SSR-safe localStorage helpers
const safeGet = (k, f) => {
  if (typeof window === 'undefined') return f;
  try {
    const r = localStorage.getItem(k);
    return r ? JSON.parse(r) : f;
  } catch {
    return f;
  }
};
const safeSet = (k, v) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [draft, setDraft] = useState({
    open: false,
    start: null,
    end: null,
    text: '',
  });

  // load/save
  useEffect(() => setEvents(safeGet('roza_calendar_events', [])), []);
  useEffect(() => safeSet('roza_calendar_events', events), [events]);

  // CLICK a day cell (month) or a time slot (week/day) to open input
  const onSelectSlot = useCallback(({ start, end }) => {
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
    setEvents((prev) => [newEvent, ...prev]);
    setDraft({ open: false, start: null, end: null, text: '' });
  };

  const cancelDraft = () =>
    setDraft({ open: false, start: null, end: null, text: '' });

  const deleteEvent = (id) => {
    if (!window.confirm('Delete this entry?')) return;
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleComplete = (id) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  const editEvent = (id) => {
    const existing = events.find((e) => e.id === id);
    const next = window.prompt('Update note text:', existing?.title || '');
    if (next == null) return;
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, title: next.trim() } : e))
    );
  };

  const eventPropGetter = useCallback(
    (event) => ({
      style: {
        backgroundColor: event.completed ? '#16a34a' : '#2563eb',
        border: 0,
        color: '#fff',
        opacity: 0.92,
      },
      className: event.completed ? 'line-through' : '',
    }),
    []
  );

  // Inline event renderer with action buttons
  const components = useMemo(
    () => ({
      event: ({ event }) => (
        <div className="flex flex-col">
          <div className="font-medium">{event.title}</div>
          <div className="mt-1 flex gap-1 flex-wrap">
            <button
              onClick={() => toggleComplete(event.id)}
              className="text-[11px] px-1 rounded bg-white text-black"
              title={event.completed ? 'Mark as not completed' : 'Mark completed'}
            >
              {event.completed ? 'Uncomplete' : 'Complete'}
            </button>
            <button
              onClick={() => editEvent(event.id)}
              className="text-[11px] px-1 rounded bg-white text-black"
              title="Edit"
            >
              Edit
            </button>
            <button
              onClick={() => deleteEvent(event.id)}
              className="text-[11px] px-1 rounded bg-white text-red-600"
              title="Delete"
            >
              Delete
            </button>
          </div>
        </div>
      ),
    }),
    [events]
  );

  return (
    <div style={{ minHeight: '78vh', padding: '1rem' }}>
      <h2 className="text-2xl font-bold mb-3">ROZA Calendar</h2>

      {/* Inline quick-add panel */}
      {draft.open && (
        <div className="border rounded-lg bg-white p-3 mb-3">
          <div className="font-semibold mb-1">
            Add Note —{' '}
            {moment(draft.start).format('MMM D, YYYY')} {moment(draft.start).format('h:mm A')}
            {draft.end && ` → ${moment(draft.end).format('h:mm A')}`}
          </div>
          <input
            type="text"
            value={draft.text}
            onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}
            placeholder="Type your note…"
            className="w-full border rounded px-2 py-2 text-black"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={cancelDraft} className="px-3 py-1 border rounded">
              Cancel
            </button>
            <button
              onClick={addEvent}
              className="px-3 py-1 rounded text-white"
              style={{ backgroundColor: '#2563eb' }}
            >
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
        defaultView="month"
        views={['month', 'week', 'day', 'agenda']}
        step={30}
        timeslots={2}
        popup
        // IMPORTANT: these make clicking the whole day cell open the input
        selectable
        onSelectSlot={onSelectSlot}
        longPressThreshold={1} // mobile single tap
        eventPropGetter={eventPropGetter}
        components={components}
        style={{ height: '70vh', background: 'white' }}
      />

      <p className="text-sm text-gray-600 mt-2">
        Tip: Click any **day cell** in Month view, or a **time slot** in Week/Day view to add a note.
        Click an event to use the action buttons (Edit / Complete / Delete). Saved in your browser.
      </p>
    </div>
  );
}
