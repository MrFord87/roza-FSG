import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function MiniWeek({ onOpenCalendar }) {
  const events = []; // Pull from your main calendar's event data

  return (
    <div style={{ height: 180, overflow: 'hidden' }}>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        views={{ week: true }} // only week view
        toolbar={false}
        popup
        step={60}
        timeslots={1}
        showMultiDayTimes={false}
        formats={{
          dayFormat: () => '', // removes day names (Sun, Mon, etc.)
        }}
        onSelectEvent={(event) => {
          if (onOpenCalendar) {
            onOpenCalendar(event.start);
          }
        }}
        onSelectSlot={(slotInfo) => {
          if (onOpenCalendar) {
            onOpenCalendar(slotInfo.start);
          }
        }}
        firstDay={1} // start on Monday
      />
    </div>
  );
}
