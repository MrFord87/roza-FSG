// components/Contacts.js
import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'roza_contacts_v1';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', notes: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setContacts(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch {}
  }, [contacts]);

  function handleChange(e) {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  }

  function addContact(e) {
    e.preventDefault();
    setError('');
    if (!newContact.name.trim()) return setError('Name is required.');
    setContacts([{ id: Date.now(), ...newContact }, ...contacts]);
    setNewContact({ name: '', email: '', phone: '', notes: '' });
  }

  function deleteContact(id) {
    if (!confirm('Delete this contact?')) return;
    setContacts(contacts.filter(c => c.id !== id));
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Contacts</h2>

      <form onSubmit={addContact} className="grid md:grid-cols-4 gap-2">
        <input
          name="name"
          value={newContact.name}
          onChange={handleChange}
          placeholder="Name"
          className="border rounded p-2"
        />
        <input
          name="email"
          value={newContact.email}
          onChange={handleChange}
          placeholder="Email"
          className="border rounded p-2"
        />
        <input
          name="phone"
          value={newContact.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border rounded p-2"
        />
        <input
          name="notes"
          value={newContact.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="border rounded p-2"
        />
        <button className="md:col-span-4 px-4 py-2 bg-blue-600 text-white rounded">Add Contact</button>
      </form>

      {error && <div className="text-red-600">{error}</div>}

      {contacts.length === 0 ? (
        <div className="text-gray-600">No contacts added yet.</div>
      ) : (
        <div className="grid gap-2">
          {contacts.map(c => (
            <div key={c.id} className="border rounded p-3 flex justify-between items-start bg-white dark:bg-gray-900">
              <div>
                <div className="font-medium">{c.name}</div>
                {c.email && <div className="text-sm">{c.email}</div>}
                {c.phone && <div className="text-sm">{c.phone}</div>}
                {c.notes && <div className="text-xs text-gray-500">{c.notes}</div>}
              </div>
              <button
                onClick={() => deleteContact(c.id)}
                className="text-red-600 border border-red-500 rounded px-2 py-1 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
