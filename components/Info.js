// components/Info.js
import React, { useEffect, useMemo, useState } from 'react';

/** ---------- LocalStorage helpers (SSR safe) ---------- */
const safeGet = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const safeSet = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

/** ---------- Component ---------- */
export default function Info() {
  /** Glossary */
  const [glossary, setGlossary] = useState([]);
  const [gTerm, setGTerm] = useState('');
  const [gDef, setGDef] = useState('');
  const [gSearch, setGSearch] = useState('');
  const [editingId, setEditingId] = useState(null);

  /** Knowledge Base (PDFs) */
  const [pdfs, setPdfs] = useState([]);

  /** NAICS Lookup */
  const [q, setQ] = useState('');
  const [naicsLoading, setNaicsLoading] = useState(false);
  const [naicsError, setNaicsError] = useState('');
  const [naicsResults, setNaicsResults] = useState([]);

  /** Load persisted data */
  useEffect(() => {
    setGlossary(safeGet('roza_glossary', []));
    setPdfs(safeGet('roza_kb_pdfs', []));
  }, []);

  /** Persist on change */
  useEffect(() => safeSet('roza_glossary', glossary), [glossary]);
  useEffect(() => safeSet('roza_kb_pdfs', pdfs), [pdfs]);

  /** Glossary handlers */
  const addGlossary = () => {
    const term = gTerm.trim();
    const definition = gDef.trim();
    if (!term || !definition) return;
    const entry = { id: crypto.randomUUID(), term, definition };
    setGlossary([entry, ...glossary]);
    setGTerm('');
    setGDef('');
  };
  const startEdit = (id) => setEditingId(id);
  const saveEdit = (id, updated) => {
    setGlossary(glossary.map((g) => (g.id === id ? { ...g, ...updated } : g)));
    setEditingId(null);
  };
  const deleteGlossary = (id) =>
    setGlossary(glossary.filter((g) => g.id !== id));

  const filteredGlossary = useMemo(() => {
    const s = gSearch.toLowerCase();
    if (!s) return glossary;
    return glossary.filter(
      (g) =>
        g.term.toLowerCase().includes(s) ||
        g.definition.toLowerCase().includes(s)
    );
  }, [glossary, gSearch]);

  // Bucket by first letter A–Z
  const buckets = useMemo(() => {
    const map = {};
    for (let i = 65; i <= 90; i++) map[String.fromCharCode(i)] = [];
    filteredGlossary.forEach((g) => {
      const letter = (g.term[0] || '').toUpperCase();
      if (map[letter]) map[letter].push(g);
      else {
        map.Other = map.Other || [];
        map.Other.push(g);
      }
    });
    return map;
  }, [filteredGlossary]);

  /** Knowledge Base handlers */
  const onUploadPdf = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const item = {
        id: crypto.randomUUID(),
        name: file.name,
        dataUrl: reader.result, // base64
        addedAt: new Date().toISOString(),
      };
      setPdfs([item, ...pdfs]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  const openPdf = (item) => {
    // open in a new tab (kept as your preferred behavior)
    window.open(item.dataUrl, '_blank', 'noopener,noreferrer');
  };
  const deletePdf = (id) => setPdfs(pdfs.filter((p) => p.id !== id));

  /** NAICS Lookup (keyword only) */
  const searchNaics = async () => {
    setNaicsError('');
    setNaicsResults([]);
    const keyword = q.trim();
    if (!keyword) return;
    setNaicsLoading(true);
    try {
      const res = await fetch(`/api/naics?q=${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const data = await res.json();
      // expect array of {code, title, desc} or similar
      setNaicsResults(Array.isArray(data?.results) ? data.results : data);
    } catch (err) {
      setNaicsError('Unable to fetch NAICS right now. Try another keyword.');
    } finally {
      setNaicsLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Grid blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Glossary Block */}
        <section className="bg-white border rounded-xl shadow-sm p-5">
          <h2 className="text-xl font-semibold mb-3">
            Government Contracting Glossary
          </h2>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={gTerm}
              onChange={(e) => setGTerm(e.target.value)}
              placeholder="Term (e.g., RFP)"
              className="flex-1 border rounded px-2 py-1"
            />
            <input
              type="text"
              value={gDef}
              onChange={(e) => setGDef(e.target.value)}
              placeholder="Definition"
              className="flex-[2] border rounded px-2 py-1"
            />
            <button
              onClick={addGlossary}
              className="px-3 py-1 rounded bg-blue-600 text-white"
            >
              Add
            </button>
          </div>

          <input
            type="text"
            value={gSearch}
            onChange={(e) => setGSearch(e.target.value)}
            placeholder="Search terms/definitions..."
            className="w-full border rounded px-2 py-1 mb-4"
          />

          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
            {Object.entries(buckets).map(([letter, items]) =>
              items.length ? (
                <div key={letter}>
                  <div className="text-sm font-semibold text-gray-600 mb-1">
                    {letter}
                  </div>
                  <div className="space-y-2">
                    {items.map((g) => (
                      <div
                        key={g.id}
                        className="border rounded p-2 flex items-start justify-between gap-3"
                      >
                        <div className="flex-1">
                          {editingId === g.id ? (
                            <EditRow
                              term={g.term}
                              definition={g.definition}
                              onCancel={() => setEditingId(null)}
                              onSave={(updated) => saveEdit(g.id, updated)}
                            />
                          ) : (
                            <>
                              <div className="font-medium">{g.term}</div>
                              <div className="text-sm text-gray-700">
                                {g.definition}
                              </div>
                            </>
                          )}
                        </div>
                        {editingId !== g.id && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(g.id)}
                              className="px-2 py-1 text-sm rounded border"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteGlossary(g.id)}
                              className="px-2 py-1 text-sm rounded border text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            )}
            {filteredGlossary.length === 0 && (
              <div className="text-sm text-gray-500 italic">No terms yet.</div>
            )}
          </div>
        </section>

        {/* Knowledge Base PDFs */}
        <section className="bg-white border rounded-xl shadow-sm p-5">
          <h2 className="text-xl font-semibold mb-3">Knowledge Base (PDFs)</h2>

          <label className="inline-flex items-center gap-2 cursor-pointer mb-4">
            <span className="px-3 py-1 rounded border bg-gray-50">
              Choose PDF…
            </span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={onUploadPdf}
            />
          </label>

          <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
            {pdfs.length === 0 && (
              <div className="text-sm text-gray-500 italic">
                No PDFs uploaded yet.
              </div>
            )}
            {pdfs.map((p) => (
              <div
                key={p.id}
                className="border rounded p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-xs text-gray-500">
                    Added {new Date(p.addedAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openPdf(p)}
                    className="px-3 py-1 rounded border"
                  >
                    View
                  </button>
                  <button
                    onClick={() => deletePdf(p.id)}
                    className="px-3 py-1 rounded border text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NAICS Look Up */}
        <section className="bg-white border rounded-xl shadow-sm p-5">
          <h2 className="text-xl font-semibold mb-3">NAICS Look Up</h2>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Enter keyword (e.g., security, janitorial)"
              className="flex-1 border rounded px-2 py-1"
              onKeyDown={(e) => e.key === 'Enter' && searchNaics()}
            />
            <button
              onClick={searchNaics}
              className="px-3 py-1 rounded bg-blue-600 text-white"
              disabled={naicsLoading}
            >
              {naicsLoading ? 'Searching…' : 'Search'}
            </button>
          </div>

          {naicsError && (
            <div className="text-sm text-red-600 mb-2">{naicsError}</div>
          )}

          <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
            {naicsResults?.length === 0 && !naicsLoading && (
              <div className="text-sm text-gray-500 italic">
                No results yet. Try a keyword.
              </div>
            )}
            {naicsResults?.map((r, idx) => (
              <div key={idx} className="border rounded p-3">
                <div className="font-semibold">
                  {r.code ? `${r.code} — ` : ''}
                  {r.title || r.name || 'NAICS Item'}
                </div>
                {r.desc || r.description ? (
                  <div className="text-sm text-gray-700 mt-1">
                    {r.desc || r.description}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/** Inline editor row for glossary */
function EditRow({ term: initialTerm, definition: initialDef, onCancel, onSave }) {
  const [term, setTerm] = useState(initialTerm);
  const [definition, setDefinition] = useState(initialDef);

  return (
    <div className="flex flex-col gap-2">
      <input
        className="border rounded px-2 py-1"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <textarea
        className="border rounded px-2 py-1"
        rows={2}
        value={definition}
        onChange={(e) => setDefinition(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={() => onSave({ term: term.trim(), definition: definition.trim() })}
          className="px-3 py-1 rounded border bg-gray-50"
        >
          Save
        </button>
        <button onClick={onCancel} className="px-3 py-1 rounded border">
          Cancel
        </button>
      </div>
    </div>
  );
}
