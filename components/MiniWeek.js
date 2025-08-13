// components/MiniWeek.js
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

// FullCalendar CSS (needed for the block layout)
// You can keep these here or move them into pages/_app.js
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';

export default function MiniWeek({ events = [], onOpenCalendar }) {
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden"
         style={{ maxWidth: 900 }}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridWeek"     // single-week block layout
        headerToolbar={false}         // no toolbar, just the grid
        dayHeaders={true}             // show Mon/Tue/Wed... inside the grid header
        height="auto"
        contentHeight={180}           // compact on the dashboard
        stickyHeaderDates={false}
        fixedWeekCount={false}
        showNonCurrentDates={false}
        events={events}
        eventDisplay="block"
        // jump to full calendar when clicking a date or event
        dateClick={(info) => onOpenCalendar && onOpenCalendar(info.date)}
        eventClick={(info) => onOpenCalendar && onOpenCalendar(info.event.start)}
      />
    </div>
  );
}
