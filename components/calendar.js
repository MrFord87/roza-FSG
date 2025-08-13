// components/calendar.js
import React, { useEffect, useMemo, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function Calendar() {
  const [events, setEvents] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('roza_events');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('roza_events', JSON.stringify(events));
    } catch {}
  }, [events]);

  // Add event on slot select; simple prompt to keep it moving
  const onSelectSlot = ({ start, end }) => {
    const title = window.prompt('Add note / title for this time:');
    if (!title) return;
    setEvents(prev => [...prev, { id: Date.now(), title, start, end, status: 'open' }]);
  };

  // Edit / complete / delete on event click
  const onSelectEvent = evt => {
    const action = window.prompt(
      `Event: ${evt.title}\n\nType one of: edit | done | delete`,
      'edit'
    );
    if (!action) return;

    if (action.toLowerCase() === 'edit') {
      const newTitle = window.prompt('New title:', evt.title);
      if (!newTitle) return;
      setEvents(prev => prev.map(e => (e.id === evt.id ? { ...e, title: newTitle } : e)));
    } else if (action.toLowerCase() === 'done') {
      setEvents(prev => prev.map(e => (e.id === evt.id ? { ...e, status: 'done' } : e)));
    } else if (action.toLowerCase() === 'delete') {
      setEvents(prev => prev.filter(e => e.id !== evt.id));
    }
  };

  const eventPropGetter = useMemo(
    () => (event) => {
      const base = { style: {} };
      if (event.status === 'done') {
        base.style.backgroundColor = '#16a34a'; // green
        base.style.border = '1px solid #0f5132';
        base.style.opacity = 0.85;
      } else {
        base.style.backgroundColor = '#2563eb'; // blue
        base.style.border = '1px solid #1e40af';
      }
      base.style.color = 'white';
      return base;
    },
    []
  );

  return (
    <div className="min-h-[75vh]">
      <h2 className="text-2xl font-bold mb-3">ROZA Calendar</h2>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        step={30}
        timeslots={2}
        popup
        style={{ height: '70vh', background: 'white' }}
        eventPropGetter={eventPropGetter}
      />
      <p className="text-sm text-gray-600 mt-2">
        Tip: Click/drag on the calendar to create an entry. Click an entry to edit, mark done, or
        delete. Entries are saved to your browser (localStorage).
      </p>
    </div>
  );
}
