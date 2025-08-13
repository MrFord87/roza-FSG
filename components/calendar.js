// components/Calendar.js
import React, { useEffect, useMemo, useState } from 'react';

// simple styles; tweak as you like
const cellBase =
  'border rounded-md p-2 min-h-[80px] relative hover:bg-gray-50 cursor-pointer';
const badge =
  'absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-[2px] rounded-full';

const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);
const ymd = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export default function Calendar() {
  const [current, setCurrent] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('roza_calendar_notes') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('roza_calendar_notes', JSON.stringify(notes));
  }, [notes]);

  const monthMatrix = useMemo(() => {
    // build a 6x7 grid for the month
    const first = new Date(current);
    const firstDay = first.getDay(); // 0-6
    const start = new Date(first);
    start.setDate(first.getDate() - firstDay); // back to Sunday before/at the 1st

    const weeks = [];
    let cursor = new Date(start);
    for (let r = 0; r < 6; r++) {
      const row = [];
      for (let c = 0; c < 7; c++) {
        row.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(row);
    }
    return weeks;
  }, [current]);

  const addNote = () => {
    if (!selectedDate || !noteText.trim()) return;
    const key = ymd(selectedDate);
    const list = notes[key] || [];
    const newList = [
      ...list,
      { id: crypto.randomUUID(), text: noteText.trim(), done: false },
    ];
    setNotes({ ...notes, [key]: newList });
    setNoteText('');
  };

  const toggleDone = (key, id) => {
    const list = (notes[key] || []).map((n) =>
      n.id === id ? { ...n, done: !n.done } : n
    );
    setNotes({ ...notes, [key]: list });
  };

  const delNote = (key, id) => {
    const list = (notes[key] || []).filter((n) => n.id !== id);
    setNotes({ ...notes, [key]: list });
  };

  const thisMonth = current.getMonth();
  const monthName = current.toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">ROZA Calendar</h2>

      {/* month controls */}
      <div className="flex items-center gap-2 mb-4">
        <button
          className="px-3 py-1 border rounded"
          onClick={() =>
            setCurrent(
              (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)
            )
          }
        >
          ← Prev
        </button>
        <div className="font-semibold">{monthName}</div>
        <button
          className="px-3 py-1 border rounded"
          onClick={() =>
            setCurrent(
              (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)
            )
          }
        >
          Next →
        </button>
        <button
          className="ml-2 px-3 py-1 border rounded"
          onClick={() => setCurrent(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
        >
          Today
        </button>
      </div>

      {/* headings */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-sm font-semibold text-gray-600">
            {d}
          </div>
        ))}
      </div>

      {/* grid */}
      <div className="grid grid-cols-7 gap-2">
        {monthMatrix.map((row, rIdx) =>
          row.map((d, cIdx) => {
            const key = ymd(d);
            const inMonth = d.getMonth() === thisMonth;
            const cnt = (notes[key] || []).length;
            const isToday = ymd(d) === ymd(new Date());
            return (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`${cellBase} ${!inMonth ? 'opacity-40' : ''} ${
                  isToday ? 'ring-2 ring-blue-600' : ''
                }`}
                onClick={() => setSelectedDate(new Date(d))}
              >
                <div className="text-sm font-semibold">{d.getDate()}</div>
                {cnt > 0 && <span className={badge}>{cnt}</span>}
                {/* quick preview */}
                <ul className="mt-2 space-y-1">
                  {(notes[key] || [])
                    .slice(0, 2)
                    .map((n) => (
                      <li
                        key={n.id}
                        className={`text-xs ${
                          n.done ? 'line-through text-gray-400' : ''
                        }`}
                      >
                        • {n.text}
                      </li>
                    ))}
                </ul>
              </div>
            );
          })
        )}
      </div>

      {/* note panel */}
      {selectedDate && (
        <div className="mt-6 p-4 border rounded-lg bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">
              Notes for {selectedDate.toDateString()}
            </h3>
            <button
              className="text-sm px-2 py-1 border rounded"
              onClick={() => setSelectedDate(null)}
            >
              Close
            </button>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              className="flex-1 border rounded px-2 py-1"
              placeholder="Type a note…"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <button
              className="px-3 py-1 border rounded bg-black text-white"
              onClick={addNote}
            >
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {(notes[ymd(selectedDate)] || []).map((n) => (
              <li
                key={n.id}
                className="flex items-center justify-between border rounded px-2 py-1"
              >
                <span className={n.done ? 'line-through text-gray-400' : ''}>
                  {n.text}
                </span>
                <div className="flex gap-2">
                  <button
                    className="text-sm px-2 py-1 border rounded"
                    onClick={() => toggleDone(ymd(selectedDate), n.id)}
                  >
                    {n.done ? 'Unmark' : 'Done'}
                  </button>
                  <button
                    className="text-sm px-2 py-1 border rounded border-red-500 text-red-600"
                    onClick={() => delNote(ymd(selectedDate), n.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {(notes[ymd(selectedDate)] || []).length === 0 && (
              <li className="text-sm text-gray-500">No notes yet.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
