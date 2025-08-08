// components/Sources.js
import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'rozaSources';

const starterLinks = [
  { id: 'sam',  name: 'SAM.gov',         url: 'https://sam.gov' },
  { id: 'unison', name: 'Unison Marketplace', url: 'https://marketplace.unisonglobal.com' },
  { id: 'fedconnect', name: 'FedConnect', url: 'https://www.fedconnect.net' },
];

export default function Sources() {
  const [links, setLinks] = useState([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  // Load on mount (browser only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setLinks(Array.isArray(parsed) ? parsed : starterLinks);
      } else {
        setLinks(starterLinks);
      }
    } catch {
      setLinks(starterLinks);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    } catch {}
  }, [links]);

  const addLink = () => {
    const n = name.trim();
    let u = url.trim();
    if (!n || !u) return;
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u; // auto-prefix
    setLinks(prev => [{ id: Date.now().toString(), name: n, url: u }, ...prev]);
    setName(''); setUrl('');
  };

  const removeLink = (id) => setLinks(prev => prev.filter(l => l.id !== id));

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">Sources</h1>

      {/* Add form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white text-black border border-gray-300 rounded-lg p-3">
        <input
          className="px-3 py-2 border border-gray-300 rounded"
          placeholder="Source name (e.g., SAM.gov)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="px-3 py-2 border border-gray-300 rounded"
          placeholder="URL (e.g., https://sam.gov)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={addLink}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Source
        </button>
      </div>

      {/* Grid of link cards */}
      {links.length === 0 ? (
        <div className="text-gray-400">No sources yet. Add a few above.</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {links.map(link => (
            <div
              key={link.id}
              className="bg-white text-black border border-gray-300 rounded-lg p-4 flex items-start justify-between"
            >
              <div className="min-w-0">
                <div className="font-semibold truncate">{link.name}</div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline break-all text-sm"
                >
                  {link.url}
                </a>
              </div>
              <button
                onClick={() => removeLink(link.id)}
                className="ml-3 px-2 py-1 text-sm border border-red-500 text-red-600 rounded"
                title="Remove"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
