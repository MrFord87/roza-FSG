import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'roza_contacts_v2'; // v2 includes file support

// -------- utils
const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const normalizeUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
};

// -------- Contact Form
const ContactForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    notes: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return; // Require name + phone
    onAdd({ ...form, id: uid() });
    setForm({ name: '', phone: '', email: '', company: '', notes: '' });
  };

  const handleClear = () => {
    setForm({ name: '', phone: '', email: '', company: '', notes: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <div className="grid grid-cols-2 gap-2">
        <input
          name="name"
          placeholder="Full name *"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="phone"
          placeholder="Phone *"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>
      <textarea
        name="notes"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
      <div className="flex gap-2">
        <button type="button" onClick={handleClear} className="px-3 py-1 border rounded">
          Clear
        </button>
        <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded">
          Add Contact
        </button>
      </div>
    </form>
  );
};

// -------- Contact List
const ContactList = ({ contacts, onRemove }) => (
  <ul className="space-y-2">
    {contacts.map((c) => (
      <li key={c.id} className="border p-2 rounded">
        <div className="font-bold">{c.name}</div>
        <div className="text-sm text-blue-600">
          {c.phone}
          {c.email && (
            <>
              {' · '}
              <a href={`mailto:${c.email}`} className="underline">
                {c.email}
              </a>
            </>
          )}
        </div>
        {c.company && <div className="text-sm">{c.company}</div>}
        {c.notes && <div className="text-xs text-gray-600">{c.notes}</div>}
        <button
          onClick={() => onRemove(c.id)}
          className="mt-1 px-2 py-1 text-sm bg-red-100 text-red-600 rounded"
        >
          Remove
        </button>
      </li>
    ))}
  </ul>
);

// -------- Main Component
const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setContacts(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse contacts', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (contact) => setContacts([...contacts, contact]);
  const removeContact = (id) =>
    setContacts(contacts.filter((c) => c.id !== id));

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Contacts</h2>
      <ContactForm onAdd={addContact} />
      <ContactList contacts={contacts} onRemove={removeContact} />
    </div>
  );
};

export default Contacts;
