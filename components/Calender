import React, { useState } from 'react'; import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';

export default function Calendar() { const [currentMonth, setCurrentMonth] = useState(new Date()); const [selectedDate, setSelectedDate] = useState(new Date()); const [notes, setNotes] = useState({});

const renderHeader = () => { return ( <div className="flex justify-between items-center mb-4"> <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="px-2 py-1 bg-gray-200">←</button> <h2 className="text-lg font-bold">{format(currentMonth, 'MMMM yyyy')}</h2> <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="px-2 py-1 bg-gray-200">→</button> </div> ); };

const renderDays = () => { const days = []; const date = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

for (let i = 0; i < 7; i++) {
  days.push(
    <div className="text-center font-medium text-gray-700" key={i}>
      {date[i]}
    </div>
  );
}
return <div className="grid grid-cols-7 mb-2">{days}</div>;

};

const renderCells = () => { const monthStart = startOfMonth(currentMonth); const monthEnd = endOfMonth(monthStart); const startDate = startOfWeek(monthStart); const endDate = endOfWeek(monthEnd);

const rows = [];
let days = [];
let day = startDate;

while (day <= endDate) {
  for (let i = 0; i < 7; i++) {
    const formattedDate = format(day, 'yyyy-MM-dd');
    const isSelected = isSameDay(day, selectedDate);
    days.push(
      <div
        key={day}
        className={`p-2 border h-24 cursor-pointer ${!isSameMonth(day, monthStart) ? 'bg-gray-100 text-gray-400' : ''} ${isSelected ? 'bg-blue-200' : ''}`}
        onClick={() => setSelectedDate(day)}
      >
        <div className="text-sm font-semibold">{format(day, 'd')}</div>
        <div className="text-xs mt-1 overflow-hidden h-12">
          {notes[formattedDate] || ''}
        </div>
      </div>
    );
    day = addDays(day, 1);
  }
  rows.push(<div className="grid grid-cols-7" key={day}>{days}</div>);
  days = [];
}
return <div>{rows}</div>;

};

const handleNoteChange = (e) => { const formattedDate = format(selectedDate, 'yyyy-MM-dd'); setNotes({ ...notes, [formattedDate]: e.target.value }); };

return ( <div className="p-4 max-w-4xl mx-auto"> {renderHeader()} {renderDays()} {renderCells()}

<div className="mt-4">
    <h3 className="text-lg font-semibold mb-2">Notes for {format(selectedDate, 'PPP')}:</h3>
    <textarea
      className="w-full border p-2"
      rows={4}
      value={notes[format(selectedDate, 'yyyy-MM-dd')] || ''}
      onChange={handleNoteChange}
    />
  </div>
</div>

); }

