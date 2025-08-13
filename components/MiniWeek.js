import React, { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import '@fullcalendar/core/index.css';
import '@fullcalendar/daygrid/index.css';

export default function MiniWeek({ onOpenCalendar }) {
  // pull any saved events you already use in the big calendar
  const events = useMemo(() => {
    try {
      const raw = localStorage.getItem('rozaEvents');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridWeek"
        headerToolbar={false}              // no external header rows
        fixedWeekCount={false}
        height="auto"
        contentHeight="auto"
        dayMaxEvents={2}
        dayHeaderFormat={{ weekday: 'short' }} // Mon, Tue, ...
        events={events}
        dateClick={(info) => {
          // jump to the main calendar focused on this date
          onOpenCalendar?.(info.date);
        }}
      />
    </div>
  );
}
