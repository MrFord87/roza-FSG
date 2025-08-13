// components/MiniWeek.js
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const STORAGE_KEY = 'rozaCalendarEvents'; // <-- make sure this matches your Calendar.js

function startOfWeek(d = new Date()) {
  const x = new Date(d);
  const day = x.getDay();          // 0=Sun
  x.setDate(x.getDate() - day);    // start on Sunday; change math if you start Monday
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfWeek(d = new Date()) {
  const s = startOfWeek(d);
  const e = new Date(s);
  e.setDate(s.getDate() + 7);
  e.setHours(23, 59, 59, 999);
  return e;
}

export default function MiniWeek() {
  const [events, setEvents] = useState([]);

  // pull events from the same storage as the main calendar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      setEvents(Array.isArray(list) ? list : []);
    } catch {
      setEvents([]);
    }
  }, []);

  // lock the view to the current week
  const visibleRange = {
    start: startOfWeek(),
    end: endOfWeek(),
  };

  return (
    <div className="border border-gray-300 rounded-md p-2 bg-white">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridWeek"           // clean week grid like your screenshot
        headerToolbar={false}                // no toolbar; very “mini”
        height="auto"
        expandRows
        events={events}
        displayEventTime={false}
        dayMaxEventRows={2}
        fixedWeekCount={false}
        navLinks={false}
        editable={false}
        selectable={false}
        visibleRange={visibleRange}         // keep it on THIS week
      />
    </div>
  );
}
