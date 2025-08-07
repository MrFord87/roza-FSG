import { useState } from 'react';

const CalendarApp = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState('');

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNote(''); // Clear previous note
  };

  const handleSave = () => {
    if (note.trim() !== '') {
      console.log(`📅 Saved note for ${selectedDate}: ${note}`);
    } else {
      console.log('No note entered.');
    }
    setSelectedDate(null); // Close modal
    setNote('');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ROZA Calendar</h1>

      {/* Simple 30-day calendar mock */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {[...Array(30)].map((_, i) => {
          const date = `2025-08-${String(i + 1).padStart(2, '0')}`;
          return (
            <button
              key={date}
              onClick={() => handleDateClick(date)}
              className="p-2 border rounded hover:bg-blue-100"
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Note Input Modal */}
      {selectedDate && (
        <div className="p-4 border rounded bg-white shadow">
          <h2 className="text-lg font-semibold mb-2">Add Note for {selectedDate}</h2>
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
