<ul className="space-y-2">
  {current.notes.map((n) => (
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
