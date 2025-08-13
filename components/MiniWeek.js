import React, { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

// If you already import these in pages/_app.js, remove them here.
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';

export default function MiniWeek({ onOpenCalendar }) {
  // Load events saved by your main calendar
  const events = useMemo(() => {
    try {
      const raw = localStorage.getItem('rozaCalendarEvents');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridWeek"    // <-- grid week, no time slots
      headerToolbar={false}
      dayHeaders={true}            // show Mon/Tue/... in the grid
      height="auto"
      fixedWeekCount={false}
      dayMaxEventRows={3}
      events={events}
      dateClick={(info) => onOpenCalendar?.(info.date)}
    />
  );
}
