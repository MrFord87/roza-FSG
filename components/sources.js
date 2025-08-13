// components/Sources.js
import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'roza_sources_v2';

const DEFAULT_SOURCES = [
  { id: 'sam',    title: 'SAM.gov',        url: 'https://sam.gov',         note: 'Federal opportunities & awards' },
  { id: 'unison', title: 'Unison Marketplace', url: 'https://marketplace.unisonglobal.com', note: 'Reverse auctions / RFQs' },
  { id: 'fedconn',title: 'FedConnect',     url: 'https://www.fedconnect.net', note: 'Solicitations and awards' },
  { id: 'naics',  title: 'NAICS Codes',    url: 'https://www.naics.com/search', note: 'Industry classification search' },
  { id: 'gsa',    title: 'GSA eBuy',       url: 'https://www.ebuy.gsa.gov', note: 'GSA schedule opportunities' },
];

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const normalizeUrl = (u) => {
  if (!u) return '';
  const t = u.trim();
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
};

export default function Sources() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ id: '', title: '', url: '', note: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      } else {
        setItems(DEFAULT_SOURCES);
      }
    } catch {
      setItems(DEFAULT_SOURCES);
    }
  }, []);
  // save
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter(
      x =>
        x.title.toLowerCase().includes(t) ||
        x.url.toLowerCase().includes(t) ||
        (x.note || '').toLowerCase().includes(t)
    );
  }, [items, q]);

  function resetForm() {
    setForm({ id: '', title: '', url: '', note: '' });
    setEditingId(null);
    setError('');
  }

  function submit(e) {
    e.preventDefault();
    setError('');
    const title = form.title.trim();
    const rawUrl = form.url.trim();
    if (!title || !rawUrl) {
      setError('Title and URL are required.');
      return;
    }
    const url = normalizeUrl(rawUrl);
    try { new URL(url); } catch {
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }

    if (editingId) {
      setItems(prev =>
        prev.map(it => (it.id === editingId ? { ...it, title, url, note: form.note.trim() } : it))
      );
    } else {
      const id = uid();
      setItems(prev => [{ id, title, url, note: form.note.trim() }, ...prev]);
    }
    resetForm();
  }

  function onEdit(item) {
    setEditingId(item.id);
    setForm({ id: item.id, title: item.title, url: item.url, note: item.note || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function onDelete(id) {
    if (!confirm('Remove this source?')) return;
    setItems(prev => prev.filter(x => x.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <div className="p-2 space-y-4">
      <h2 className="text-xl font-semibold">Sources</h2>
      <p className="text-sm text-gray-700">
        Curated sites you use for opportunities. Add your own below.
      </p>

      {/* Add / Edit form */}
      <form onSubmit={submit} className="border rounded p-3 bg-white dark:bg-gray-900 space-y-2">
        <div className="grid md:grid-cols-3 gap-2">
          <input
            className="border rounded p-2"
            placeholder="Title (e.g., City Vendor Portal)"
            value={form.title}
            onChange={(e)=>setForm(f=>({ ...f, title: e.target.value }))}
          />
          <input
            className="border rounded p-2"
            placeholder="URL (https://...)"
            value={form.url}
            onChange={(e)=>setForm(f=>({ ...f, url: e.target.value }))}
          />
          <input
            className="border rounded p-2"
            placeholder="Note (optional)"
            value={form.note}
            onChange={(e)=>setForm(f=>({ ...f, note: e.target.value }))}
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-blue-600 text-white">
            {editingId ? 'Update Source' : 'Add Source'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded border">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search */}
      <div className="flex items-center gap-2">
        <input
          className="border rounded p-2 w-full"
          placeholder="Search by title, URL, or note…"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
        />
      </div>

      {/* Grid of sources */}
      {filtered.length === 0 ? (
        <div className="text-gray-600">No sources yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="group border-2 border-black rounded-2xl p-4 bg-white dark:bg-gray-900 flex flex-col justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <div className="min-w-0">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-lg font-semibold underline-offset-2 group-hover:underline truncate"
                  title={s.url}
                >
                  {s.title}
                </a>
                {s.note && <div className="text-sm text-gray-600 mt-1 break-words">{s.note}</div>}
                <div className="text-xs text-gray-500 mt-1 break-words">{s.url}</div>
              </div>

              <div className="flex gap-2 mt-4">
                <button onClick={()=>onEdit(s)} className="px-3 py-1 border rounded text-sm">Edit</button>
                <button onClick={()=>onDelete(s.id)} className="px-3 py-1 border rounded border-red-500 text-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
