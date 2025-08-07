// components/Calendar.js
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { enUS } from 'date-fns/locale';
import './calendar.css'; // Optional for custom styles

const locales = {
  'en-US': enUS,
};

const localizer = {
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
};

const MyCalendar = () => {
  const [events, setEvents] = useState([
    {
      title: 'Initial Event',
      start: new Date(),
      end: new Date(),
    },
  ]);

  const handleSelect = ({ start, end }) => {
    const title = prompt('Enter event title:');
    if (title) {
      setEvents([...events, { start, end, title }]);
    }
  };

  return (
    <div className="h-screen p-4 bg-white dark:bg-black text-black dark:text-white">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelect}
        style={{ height: '80vh' }}
      />
    </div>
  );
};

export default MyCalendar;
