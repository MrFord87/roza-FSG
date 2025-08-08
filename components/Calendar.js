// components/Contacts.js
import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'rozaContacts';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Load saved contacts on mount (browser only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setContacts(parsed);
      }
    } catch (e) {
      console.warn('Failed to load contacts from localStorage:', e);
    }
  }, []);

  // Persist whenever contacts change (browser only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch (e) {
      console.warn('Failed to save contacts to localStorage:', e);
    }
  }, [contacts]);

  const addContact = () => {
    const n = name.trim();
    const p = phone.trim();
    if (!n || !p) return;
    const newContact = { id: Date.now(), name: n, phone: p };
    setContacts(prev => [newContact, ...prev]);
    setName('');
    setPhone('');
  };

  const removeContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div style={{ padding: '1rem', maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 12 }}>Contacts</h1>

      {/* Add Contact */}
      <div
        style={{
          marginBottom: 16,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr auto',
          gap: 8,
        }}
      >
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
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: 4,
          }}
        >
          Add
        </button>
      </div>

      {/* Contacts List */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {contacts.map((c) => (
          <li
            key={c.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #ccc',
              padding: '0.75rem',
              borderRadius: 6,
              background: 'white',
              color: 'black',
              marginBottom: 8,
            }}
          >
            <div>
              <strong>{c.name}</strong>
              <div style={{ fontSize: 14, color: '#555' }}>{c.phone}</div>
            </div>
            <button
              onClick={() => removeContact(c.id)}
              style={{
                background: 'transparent',
                border: '1px solid #e11d48',
                color: '#e11d48',
                padding: '0.4rem 0.7rem',
                borderRadius: 4,
              }}
            >
              Remove
            </button>
          </li>
        ))}
        {contacts.length === 0 && (
          <li style={{ color: '#777' }}>No contacts yet.</li>
        )}
      </ul>
    </div>
  );
};

export default Contacts;
