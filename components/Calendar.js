import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([
    {
      title: 'Demo Event',
      start: new Date(),
      end: new Date(),
    },
  ]);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [note, setNote] = useState('');

  const handleSelectSlot = ({ start }) => {
    setSelectedSlot(start);
    setNote('');
  };

  const handleSaveNote = () => {
    if (!note.trim() || !selectedSlot) return;

    const newEvent = {
      title: note,
      start: selectedSlot,
      end: new Date(moment(selectedSlot).add(1, 'hours').toDate()),
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setSelectedSlot(null);
    setNote('');
  };

  return (
    <div style={{ height: '85vh', padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>ROZA Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '70vh' }}
      />

      {selectedSlot && (
        <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '5px' }}>
          <h3>Add Note for: {moment(selectedSlot).format('MMMM Do YYYY, h:mm A')}</h3>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type your note here..."
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setSelectedSlot(null)}>Cancel</button>
            <button onClick={handleSaveNote} style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}>
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
