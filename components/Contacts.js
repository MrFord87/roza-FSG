// Contacts.js
import React, { useState, useEffect } from 'react';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Load saved contacts on mount
  useEffect(() => {
    const saved = localStorage.getItem('rozaContacts');
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  // Persist whenever contacts change
  useEffect(() => {
    localStorage.setItem('rozaContacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = () => {
    if (!name.trim() || !phone.trim()) return;
    const newContact = { id: Date.now(), name: name.trim(), phone: phone.trim() };
    setContacts(prev => [newContact, ...prev]);
    setName('');
    setPhone('');
  };

  const removeContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div style={{ padding: '1rem', maxWidth: 640, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Contacts</h1>

      {/* Add Contact */}
      <div style={{ marginTop: '1rem', marginBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <button
          onClick={addContact}
          style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: 4 }}
        >
          Add
        </button>
      </div>

      {/* Contacts List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {contacts.map((c) => (
          <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ccc', padding: '0.75rem', borderRadius: 4, background: 'white', color: 'black', marginBottom: '0.5rem' }}>
            <div>
              <strong>{c.name}</strong>
              <div style={{ fontSize: 14, color: '#555' }}>{c.phone}</div>
            </div>
            <button onClick={() => removeContact(c.id)} style={{ background: 'transparent', border: '1px solid #e11d48', color: '#e11d48', padding: '0.4rem 0.7rem', borderRadius: 4 }}>
              Remove
            </button>
          </li>
        ))}
        {contacts.length === 0 && <li style={{ color: '#777' }}>No contacts yet.</li>}
      </ul>
    </div>
  );
};

export default Contacts;
