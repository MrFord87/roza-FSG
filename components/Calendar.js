import { useState } from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00 AM`).concat(
  Array.from({ length: 6 }, (_, i) => `${i + 1}:00 PM`)
);

const CalendarApp = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState({});

  const handleDateClick = (day) => {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(date);
    setSelectedTime('');
    setNote('');
  };

  const handleSave = () => {
    if (!selectedTime || !note.trim()) return;

    const key = `${selectedDate}_${selectedTime}`;
    setNotes((prev) => ({
      ...prev,
      [key]: note,
    }));

    setSelectedDate(null);
    setSelectedTime('');
    setNote('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ROZA Calendar</h1>

      {/* Unified Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-2 border-b">{day}</div>
        ))}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const hasNote = Object.keys(notes).some((k) => k.startsWith(dateKey));

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`p-2 h-20 border rounded text-left ${
                hasNote ? 'bg-yellow-100' : 'hover:bg-blue-100'
              }`}
            >
              <span className="font-medium">{day}</span>
            </button>
          );
        })}
      </div>

      {/* Note Input */}
      {selectedDate && (
        <div className="p-4 border rounded bg-white shadow">
          <h2 className="text-lg font-semibold mb-2">Add Note for {selectedDate}</h2>

          <label className="block mb-2 font-medium">Select Time:</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          >
            <option value="">-- Select a Time --</option>
            {hours.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Type your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setSelectedDate(null);
                setSelectedTime('');
                setNote('');
              }}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarApp;
