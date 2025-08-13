// components/Info.js
import React, { useEffect, useMemo, useState } from 'react';

/* ---------- helpers (SSR-safe localStorage) ---------- */
const safeGet = (k, f) => {
  if (typeof window === 'undefined') return f;
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; }
};
const safeSet = (k, v) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};

/* ---------- component ---------- */
export default function Info() {
  /* Glossary */
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [glossary, setGlossary] = useState([]);
  const [gSearch, setGSearch] = useState('');

  /* NAICS */
  const [q, setQ] = useState('');
  const [naicsLoading, setNaicsLoading] = useState(false);
  const [naicsError, setNaicsError] = useState('');
  const [naicsResults, setNaicsResults] = useState([]);

  /* Knowledge Base PDFs */
  const [pdfs, setPdfs] = useState([]);

  /* Load stored data */
  useEffect(() => {
    setGlossary(safeGet('roza_glossary', []));
    setPdfs(safeGet('roza_kb_pdfs', []));
  }, []);

  /* Persist */
  useEffect(() => { safeSet('roza_glossary', glossary); }, [glossary]);
  useEffect(() => { safeSet('roza_kb_pdfs', pdfs); }, [pdfs]);

  /* Glossary actions */
  const addTerm = () => {
    const t = term.trim();
    const d = definition.trim();
    if (!t || !d) return;
    setGlossary(prev => [{ id: crypto.randomUUID(), term: t, definition: d }, ...prev]);
    setTerm(''); setDefinition('');
  };
  const deleteTerm = (id) => setGlossary(prev => prev.filter(x => x.id !== id));
  const filteredGlossary = useMemo(() => {
    const s = gSearch.toLowerCase();
    return !s
      ? glossary
      : glossary.filter(x =>
          x.term.toLowerCase().includes(s) ||
          x.definition.toLowerCase().includes(s)
        );
  }, [glossary, gSearch]);

  /* NAICS search (requires /pages/api/naics.js present) */
  const searchNaics = async () => {
    if (!q.trim()) return;
    setNaicsError(''); setNaicsLoading(true); setNaicsResults([]);
    try {
      const res = await fetch(`/api/naics?q=${encodeURIComponent(q.trim())}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setNaicsResults(Array.isArray(data?.results) ? data.results : []);
    } catch (e) {
      setNaicsError('Network error. Try again in a moment.');
    } finally {
      setNaicsLoading(false);
    }
  };

  /* PDF handlers */
  const onPdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { alert('Please choose a PDF.'); return; }

    const reader = new FileReader();
    reader.onload = () => {
      // store base64 for persistence
      const base64 = reader.result; // data:application/pdf;base64,....
      const entry = {
        id: crypto.randomUUID(),
        name: file.name,
        base64,
        addedAt: new Date().toISOString(),
      };
      setPdfs(prev => [entry, ...prev]);
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const viewPdf = (entry) => {
    try {
      // Convert base64 to Blob and open a real object URL (no interstitial).
      const [meta, b64] = entry.base64.split(',');
      const byteString = atob(b64);
      const len = byteString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = byteString.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      alert('Could not open PDF. Try re-uploading it.');
    }
  };

  const deletePdf = (id) => setPdfs(prev => prev.filter(p => p.id !== id));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Info</h1>

      {/* GRID of blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Glossary */}
        <section className="border rounded-xl shadow-sm bg-white p-4">
          <h2 className="text-xl font-semibold mb-3">Government Contracting Glossary</h2>

          <div className="flex gap-2 mb-3">
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Term (e.g., RFP)"
              className="flex-1 border rounded px-2 py-2 text-black"
            />
            <input
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Definition"
              className="flex-[2] border rounded px-2 py-2 text-black"
            />
            <button
              onClick={addTerm}
              className="px-3 py-2 rounded text-white"
              style={{ backgroundColor: '#2563eb' }}
            >
              Add
            </button>
          </div>

          <input
            value={gSearch}
            onChange={(e) => setGSearch(e.target.value)}
            placeholder="Search terms or definitions…"
            className="w-full border rounded px-2 py-2 text-black mb-3"
          />

          <div className="divide-y">
            {filteredGlossary.length === 0 ? (
              <p className="text-gray-500">No terms yet.</p>
            ) : (
              filteredGlossary.map(item => (
                <div key={item.id} className="py-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{item.term}</div>
                      <div className="text-sm text-gray-700">{item.definition}</div>
                    </div>
                    <button
                      onClick={() => deleteTerm(item.id)}
                      className="text-red-600 text-sm"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* NAICS Look Up */}
        <section className="border rounded-xl shadow-sm bg-white p-4">
          <h2 className="text-xl font-semibold mb-3">NAICS Look Up</h2>
          <div className="flex gap-2 mb-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Enter keyword (e.g., security)"
              className="flex-1 border rounded px-2 py-2 text-black"
            />
            <button
              onClick={searchNaics}
              disabled={naicsLoading}
              className="px-3 py-2 rounded text-white disabled:opacity-60"
              style={{ backgroundColor: '#2563eb' }}
            >
              {naicsLoading ? 'Searching…' : 'Search'}
            </button>
          </div>
          {naicsError && <p className="text-red-600 mb-2">{naicsError}</p>}

          <div className="max-h-80 overflow-auto divide-y">
            {naicsResults.length === 0 ? (
              <p className="text-gray-500">No results yet.</p>
            ) : (
              naicsResults.map((r, idx) => (
                <div key={idx} className="py-2">
                  <div className="font-medium">{r.code} — {r.title}</div>
                  {r.description && (
                    <div className="text-sm text-gray-700">{r.description}</div>
                  )}
                </div>
              ))
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            If you see “Network error,” confirm <code>/pages/api/naics.js</code> is present and reachable.
          </p>
        </section>

        {/* Knowledge Base (PDFs) */}
        <section className="md:col-span-2 border rounded-xl shadow-sm bg-white p-4">
          <h2 className="text-xl font-semibold mb-3">Knowledge Base (PDFs)</h2>

          <div className="flex items-center gap-3 mb-3">
            <input type="file" accept="application/pdf" onChange={onPdfUpload} />
            <span className="text-sm text-gray-600">
              Stored locally in your browser for now.
            </span>
          </div>

          {pdfs.length === 0 ? (
            <p className="text-gray-500">No PDFs uploaded yet.</p>
          ) : (
            <ul className="space-y-2">
              {pdfs.map(p => (
                <li key={p.id} className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-gray-500">
                    • Added {new Date(p.addedAt).toLocaleString()}
                  </span>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => viewPdf(p)}
                      className="px-2 py-1 text-sm rounded border"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deletePdf(p.id)}
                      className="px-2 py-1 text-sm rounded border text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
