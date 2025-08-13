// components/Sources.js
import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'roza_sources_v1';

// Seed with just the three you wanted
const SEED_LINKS = [
  { id: 'seed-sam', title: 'SAM.gov', url: 'https://sam.gov', desc: 'Contract opportunities, entity registration' },
  { id: 'seed-unison', title: 'Unison Marketplace', url: 'https://marketplace.unisoneMarketplace.com', desc: 'Reverse auctions & marketplace' },
  { id: 'seed-fedconnect', title: 'FedConnect', url: 'https://www.fedconnect.net', desc: 'Opportunities & awards (civilian agencies)' },
];

function normalizeUrl(u) {
  if (!u) return '';
  const trimmed = u.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function Sources() {
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');

  // Load from storage; seed if empty
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setLinks(JSON.parse(raw));
      } else {
        setLinks(SEED_LINKS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LINKS));
      }
    } catch {
      setLinks(SEED_LINKS);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    } catch {}
  }, [links]);

  const addLink = (e) => {
    e.preventDefault();
    setError('');

    const t = title.trim();
    const u = normalizeUrl(url);
    if (!t || !u) {
      setError('Title and URL are required.');
      return;
    }
    try {
      // Basic URL validation
      new URL(u);
    } catch {
      setError('Please enter a valid URL.');
      return;
    }
    // Prevent duplicates by URL
    if (links.some((x) => x.url.toLowerCase() === u.toLowerCase())) {
      setError('That URL is already in your list.');
      return;
    }

    const item = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: t,
      url: u,
      desc: desc.trim(),
    };
    setLinks([item, ...links]);
    setTitle('');
    setUrl('');
    setDesc('');
  };

  const removeLink = (id) => {
    setLinks((xs) => xs.filter((x) => x.id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Sources</h2>

      {/* Add form */}
      <form
        onSubmit={addLink}
        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-6"
      >
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            placeholder="Title (e.g., SAM.gov)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-black dark:text-white md:col-span-2"
            placeholder="URL (e.g., https://sam.gov)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <textarea
          className="mt-3 w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-black dark:text-white"
          placeholder="Description (optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={2}
        />
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        <div className="mt-3 flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Link
          </button>
          <button
            type="button"
            onClick={() => { setTitle(''); setUrl(''); setDesc(''); setError(''); }}
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Grid of links */}
      {links.length === 0 ? (
        <div className="text-gray-600">No sources yet. Add your first link above.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {links.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col justify-between"
            >
              <div>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline break-words"
                  title={s.url}
                >
                  {s.title}
                </a>
                {s.desc && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {s.desc}
                  </div>
                )}
              </div>
              <div className="mt-3">
                <button
                  onClick={() => removeLink(s.id)}
                  className="px-3 py-1 text-sm rounded border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
