// components/Contacts.js
import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'rozaContacts';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');

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
      console.warn('Failed to load contacts:', e);
    }
  }, []);

  // Persist whenever contacts change (browser only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch (e) {
      console.warn('Failed to save contacts:', e);
    }
  }, [contacts]);

  const addContact = () => {
    const n = name.trim();
    const p = phone.trim();
    const em = email.trim();
    const co = company.trim();
    const no = notes.trim();

    if (!n || !p) return; // name + phone required

    const newContact = {
      id: Date.now(),
      name: n,
      phone: p,
      email: em || null,
      company: co || null,
      notes: no || null,
      createdAt: new Date().toISOString(),
    };

    setContacts(prev => [newContact, ...prev]);
    // reset form
    setName(''); setPhone(''); setEmail(''); setCompany(''); setNotes('');
  };

  const removeContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div style={{ padding: '1rem', maxWidth: 840, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 12 }}>Contacts</h1>

      {/* Add Contact */}
      <div
        style={{
          marginBottom: 16,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          background: 'white',
          color: 'black',
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 12,
        }}
      >
        <input
          type="text"
          placeholder="Full name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <input
          type="tel"
          placeholder="Phone *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          style={{ gridColumn: '1 / -1', padding: '0.5rem', resize: 'vertical' }}
        />
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={() => { setName(''); setPhone(''); setEmail(''); setCompany(''); setNotes(''); }}
            style={{ background: 'transparent', border: '1px solid #aaa', color: '#333', padding: '0.5rem 1rem', borderRadius: 4 }}
          >
            Clear
          </button>
          <button
            onClick={addContact}
            style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: 4 }}
          >
            Add Contact
          </button>
        </div>
      </div>

      {/* Contacts List */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {contacts.map((c) => (
          <li
            key={c.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 8,
              border: '1px solid #ccc',
              padding: '0.75rem',
              borderRadius: 6,
              background: 'white',
              color: 'black',
              marginBottom: 8,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>{c.name}</strong>
                {c.company && <span style={{ fontSize: 12, color: '#555' }}>• {c.company}</span>}
              </div>
              <div style={{ marginTop: 4 }}>
                <a href={`tel:${c.phone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                  {c.phone}
                </a>
                {c.email && (
                  <>
                    {' · '}
                    <a href={`mailto:${c.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                      {c.email}
                    </a>
                  </>
                )}
              </div>
              {c.notes && (
                <div style={{ marginTop: 6, fontSize: 14, color: '#444' }}>
                  {c.notes}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => removeContact(c.id)}
                style={{ background: 'transparent', border: '1px solid #e11d48', color: '#e11d48', padding: '0.4rem 0.7rem', borderRadius: 4 }}
              >
                Remove
              </button>
            </div>
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
