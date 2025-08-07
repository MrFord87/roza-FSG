// /components/Calendar.js
import React, { useState } from 'react';
import './calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

// Setup localizer
const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([
    {
      title: 'Example Event',
      start: new Date(),
      end: new Date(),
    },
  ]);

  return (
    <div style={{ height: '80vh', padding: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default MyCalendar;
