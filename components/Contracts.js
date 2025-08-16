import React, { useState } from "react";

export default function Contracts() {
  const [folders, setFolders] = useState([]);
  const [current, setCurrent] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editText, setEditText] = useState("");

  function addFolder() {
    const name = prompt("Folder name?");
    if (name) {
      const folder = { id: Date.now(), name, notes: [] };
      setFolders([...folders, folder]);
    }
  }

  function addNote() {
    if (!current || !newNote.trim()) return;
    const note = { id: Date.now(), text: newNote.trim() };
    setCurrent({
      ...current,
      notes: [...current.notes, note],
    });
    setFolders(
      folders.map((f) =>
        f.id === current.id ? { ...f, notes: [...f.notes, note] } : f
      )
    );
    setNewNote("");
  }

  function removeNote(id) {
    const updated = current.notes.filter((n) => n.id !== id);
    setCurrent({ ...current, notes: updated });
    setFolders(
      folders.map((f) =>
        f.id === current.id ? { ...f, notes: updated } : f
      )
    );
  }

  function startEditing(note) {
    setEditingNoteId(note.id);
    setEditText(note.text);
  }

  function saveNote(id) {
    const updated = current.notes.map((n) =>
      n.id === id ? { ...n, text: editText } : n
    );
    setCurrent({ ...current, notes: updated });
    setFolders(
      folders.map((f) =>
        f.id === current.id ? { ...f, notes: updated } : f
      )
    );
    setEditingNoteId(null);
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Contracts</h2>
        <button
          onClick={addFolder}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          + Folder
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="col-span-1 border-r pr-2">
          <h3 className="font-semibold mb-2">Folders</h3>
          <ul className="space-y-1">
            {folders.map((f) => (
              <li
                key={f.id}
                className={`cursor-pointer p-1 rounded ${
                  current?.id === f.id ? "bg-blue-100" : ""
                }`}
                onClick={() => setCurrent(f)}
              >
                {f.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Main panel */}
        <div className="col-span-3">
          {current ? (
            <div>
              <h3 className="text-md font-semibold mb-2">{current.name}</h3>
              <div className="flex mb-3">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="border p-1 flex-grow"
                  placeholder="Add note"
                />
                <button
                  onClick={addNote}
                  className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                >
                  Add
                </button>
              </div>

              <ul className="space-y-2">
                {(current.notes ?? []).map((n) => (
                  <li
                    key={n.id}
                    className="border rounded p-2 flex items-start justify-between"
                  >
                    {editingNoteId === n.id ? (
                      <>
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="border p-1 flex-grow"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveNote(n.id)}
                            className="text-green-600 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="text-gray-600 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="whitespace-pre-wrap">{n.text}</div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditing(n)}
                            className="text-blue-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeNote(n.id)}
                            className="text-red-600 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Select a folder to view notes.</p>
          )}
        </div>
      </div>
    </div>
  );
}
