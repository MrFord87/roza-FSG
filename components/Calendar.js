// components/Calendar.js
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const STORAGE_KEY = 'rozaCalendarEvents';

function PortalModal({ open, title, children, onClose }) {
  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.4)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div
        role="dialog" aria-modal="true" tabIndex={-1}
        style={{
          width: '100%', maxWidth: 520, background: 'white', color: 'black',
          borderRadius: 8, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', padding: 16, outline: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div style={{ marginTop: 12 }}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [note, setNote] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);   // Date for new event start
  const [selectedEvent, setSelectedEvent] = useState(null); // Event being edited
  const inputRef = useRef(null);

  // ✅ Load events from localStorage on mount (rehydrate Date fields)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw).map(ev => ({
          ...ev,
          start: new Date(ev.start),
          end: new Date(ev.end),
        }));
        setEvents(parsed);
      }
    } catch (e) {
      console.warn('Failed to load calendar events:', e);
    }
  }, []);

  // ✅ Save events to localStorage whenever they change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.warn('Failed to save calendar events:', e);
    }
  }, [events]);

  // Autofocus input when a modal opens
  useEffect(() => {
    if (!selectedSlot && !selectedEvent) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [selectedSlot, selectedEvent]);

  // Handlers
  const handleSelectSlot = ({ start }) => {
    setSelectedEvent(null);
    setSelectedSlot(start);
    setNote('');
  };

  const handleSelectEvent = (event) => {
    setSelectedSlot(null);
    setSelectedEvent(event);
    setNote(event.title);
  };

  const handleSaveNew = () => {
    if (!note.trim() || !selectedSlot) return;
    const start = new Date(selectedSlot);
    const end = moment(start).add(1, 'hour').toDate();
    setEvents(prev => [...prev, { id: Date.now(), title: note.trim(), start, end, completed: false }]);
    setSelectedSlot(null);
    setNote('');
  };

  const handleUpdate = () => {
    if (!selectedEvent) return;
    setEvents(prev => prev.map(ev => (ev.id === selectedEvent.id ? { ...ev, title: note.trim() } : ev)));
    setSelectedEvent(null);
    setNote('');
  };

  const handleDelete = () => {
    if (!selectedEvent) return;
    setEvents(prev => prev.filter(ev => ev.id !== selectedEvent.id));
    setSelectedEvent(null);
    setNote('');
  };

  const handleComplete = () => {
    if (!selectedEvent) return;
    setEvents(prev => prev.map(ev => (ev.id === selectedEvent.id ? { ...ev, completed: true } : ev)));
    setSelectedEvent(null);
    setNote('');
  };

  // Styling for events
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.completed ? 'green' : '#2563eb',
      color: 'white',
      borderRadius: 4,
      border: 'none',
      display: 'block',
      textDecoration: event.completed ? 'line-through' : 'none',
    };
    return { style };
  };

  return (
    <div style={{ height: '85vh', padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>ROZA Calendar</h1>

      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day']}
        popup
        longPressThreshold={50}
        eventPropGetter={eventStyleGetter}
        style={{ height: '70vh', background: 'white', color: 'black' }}
      />

      {/* Add Note (Portal) */}
      <PortalModal
        open={!!selectedSlot}
        title={`Add Note – ${selectedSlot ? moment(selectedSlot).format('MMM D, YYYY h:mm A') : ''}`}
        onClose={() => { setSelectedSlot(null); setNote(''); }}
      >
        <input
          ref={inputRef}
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type your note here..."
          autoFocus
          inputMode="text"
          style={{
            width: '100%', padding: '0.5rem', marginBottom: '0.75rem',
            borderRadius: 4, border: '1px solid #ccc', background: 'white', color: 'black',
          }}
        />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => { setSelectedSlot(null); setNote(''); }}>Cancel</button>
          <button
            onClick={handleSaveNew}
            style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: 4 }}
          >
            Save Note
          </button>
        </div>
      </PortalModal>

      {/* Edit Note (Portal) */}
      <PortalModal
        open={!!selectedEvent}
        title="Edit Note"
        onClose={() => { setSelectedEvent(null); setNote(''); }}
      >
        <input
          ref={inputRef}
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Update your note..."
          autoFocus
          inputMode="text"
          style={{
            width: '100%', padding: '0.5rem', marginBottom: '0.75rem',
            borderRadius: 4, border: '1px solid #ccc', background: 'white', color: 'black',
          }}
        />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => setSelectedEvent(null)}>Cancel</button>
          <button
            onClick={handleUpdate}
            style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: 4 }}
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: 4 }}
          >
            Delete
          </button>
          <button
            onClick={handleComplete}
            style={{ backgroundColor: 'green', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: 4 }}
          >
            Mark Completed
          </button>
        </div>
      </PortalModal>
    </div>
  );
}
