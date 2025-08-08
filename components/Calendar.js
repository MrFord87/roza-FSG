import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [note, setNote] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Handle clicking an empty time slot
  const handleSelectSlot = ({ start }) => {
    setSelectedSlot(start);
    setSelectedEvent(null);
    setNote('');
  };

  // Save a new note into the calendar
  const handleSave = () => {
    if (!note.trim() || !selectedSlot) return;

    setEvents([
      ...events,
      {
        title: note,
        start: selectedSlot,
        end: moment(selectedSlot).add(1, 'hour').toDate(),
        completed: false,
      },
    ]);
    setSelectedSlot(null);
    setNote('');
  };

  // Handle clicking on an existing event
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setNote(event.title);
  };

  // Update existing event
  const handleUpdate = () => {
    setEvents(events.map(ev => 
      ev === selectedEvent ? { ...ev, title: note } : ev
    ));
    setSelectedEvent(null);
    setNote('');
  };

  // Delete existing event
  const handleDelete = () => {
    setEvents(events.filter(ev => ev !== selectedEvent));
    setSelectedEvent(null);
    setNote('');
  };

  // Mark event as completed
  const handleComplete = () => {
    setEvents(events.map(ev => 
      ev === selectedEvent ? { ...ev, completed: true } : ev
    ));
    setSelectedEvent(null);
    setNote('');
  };

  // Style completed events
  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: event.completed ? 'green' : '#2563eb',
      color: 'white',
      borderRadius: '4px',
      border: 'none',
      display: 'block',
      textDecoration: event.completed ? 'line-through' : 'none',
    };
    return { style };
  };

  return (
    <div style={{ height: '85vh', padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>ROZA Calendar</h1>

  <input
  type="text"
  placeholder="Test typing"
  value={note}
  onChange={(e) => setNote(e.target.value)}
  style={{ border:'1px solid red', width:'100%', marginBottom:8, background:'white', color:'black' }}
/>
  
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={handleSelectSlot}   // ✅ Wired correctly now
        onSelectEvent={handleSelectEvent}
        style={{ height: '70vh' }}
        eventPropGetter={eventStyleGetter}
        views={['day', 'week', 'month']} // Can click in day/week
      />

      {/* Add new note */}
      {selectedSlot && (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Add Note for: {moment(selectedSlot).format('MMMM Do YYYY, h:mm A')}</h3>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type your note here..."
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.5rem',
              marginBottom: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setSelectedSlot(null)}>Cancel</button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* Edit existing event */}
      {selectedEvent && (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Edit Note</h3>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.5rem',
              marginBottom: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setSelectedEvent(null)}>Cancel</button>
            <button onClick={handleUpdate} style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}>Update</button>
            <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}>Delete</button>
            <button onClick={handleComplete} style={{ backgroundColor: 'green', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}>Mark Completed</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
