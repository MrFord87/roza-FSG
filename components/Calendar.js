// Calendar.js
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

/** Simple portal modal that renders to document.body */
function PortalModal({ open, title, children, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // Trap focus on open (best-effort)
    const prev = document.activeElement;
    modalRef.current?.focus?.();
    return () => prev && prev.focus && prev.focus();
  }, [open]);

  if (!open) return null;
  if (typeof document === 'undefined') return null; // SSR guard

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        style={{
          width: '100%',
          maxWidth: 520,
          background: 'white',
          color: 'black',
          borderRadius: 8,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          padding: 16,
          outline: 'none',
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
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

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [note, setNote] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);   // Date for new event start
  const [selectedEvent, setSelectedEvent] = useState(null); // Event being edited
  const inputRef = useRef(null);

  // Focus the main input inside the modal when it opens
  useEffect(() => {
    if (!selectedSlot && !selectedEvent) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [selectedSlot, selectedEvent]);

  // Click empty day/slot -> open ADD modal
  const handleSelectSlot = ({ start }) => {
    setSelectedEvent(null);
    setSelectedSlot(start);
    setNote('');
  };

  // Click event -> open EDIT modal
  const handleSelectEvent = (event) => {
    setSelectedSlot(null);
    setSelectedEvent(event);
    setNote(event.title);
  };

  // Create new event
  const handleSaveNew = () => {
    if (!note.trim() || !selectedSlot) return;
    const start = new Date(selectedSlot);
    const end = moment(start).add(1, 'hour').toDate(); // default 1 hour
    setEvents((prev) => [...prev, { title: note.trim(), start, end, completed: false }]);
    setSelectedSlot(null);
    setNote('');
  };

  // Update existing event
  const handleUpdate = () => {
    if (!selectedEvent) return;
    setEvents((prev) =>
      prev.map((ev) => (ev === selectedEvent ? { ...ev, title: note.trim() } : ev))
    );
    setSelectedEvent(null);
    setNote('');
  };

  // Delete existing event
  const handleDelete = () => {
    if (!selectedEvent) return;
    setEvents((prev) => prev.filter((ev) => ev !== selectedEvent));
    setSelectedEvent(null);
    setNote('');
  };

  // Mark as completed
  const handleComplete = () => {
    if (!selectedEvent) return;
    setEvents((prev) =>
      prev.map((ev) => (ev === selectedEvent ? { ...ev, completed: true } : ev))
    );
    setSelectedEvent(null);
    setNote('');
  };

  // Style events (completed -> green + strikethrough)
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

      {/* ADD NOTE (Portal Modal) */}
      <PortalModal
        open={!!selectedSlot}
        title={`Add Note – ${selectedSlot ? moment(selectedSlot).format('MMM D, YYYY h:mm A') : ''}`}
        onClose={() => {
          setSelectedSlot(null);
          setNote('');
        }}
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
            width: '100%',
            padding: '0.5rem',
            marginBottom: '0.75rem',
            borderRadius: 4,
            border: '1px solid #ccc',
            background: 'white',
            color: 'black',
          }}
        />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => { setSelectedSlot(null); setNote(''); }}>Cancel</button>
          <button
            onClick={handleSaveNew}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: 4,
            }}
          >
            Save Note
          </button>
        </div>
      </PortalModal>

      {/* EDIT NOTE (Portal Modal) */}
      <PortalModal
        open={!!selectedEvent}
        title="Edit Note"
        onClose={() => {
          setSelectedEvent(null);
          setNote('');
        }}
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
            width: '100%',
            padding: '0.5rem',
            marginBottom: '0.75rem',
            borderRadius: 4,
            border: '1px solid #ccc',
            background: 'white',
            color: 'black',
          }}
        />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => setSelectedEvent(null)}>Cancel</button>
          <button
            onClick={handleUpdate}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: 4,
            }}
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: 'red',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: 4,
            }}
          >
            Delete
          </button>
          <button
            onClick={handleComplete}
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: 4,
            }}
          >
            Mark Completed
          </button>
        </div>
      </PortalModal>
    </div>
  );
};

export default MyCalendar;
