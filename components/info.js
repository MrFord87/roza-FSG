// components/Info.js
import React, { useEffect, useState } from 'react';

export default function Info() {
  // --- Glossary (minimal starter; extend as needed)
  const [glossary, setGlossary] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('roza_glossary') || '[]');
    } catch {
      return [];
    }
  });
  const [term, setTerm] = useState('');
  const [defn, setDefn] = useState('');

  useEffect(() => {
    localStorage.setItem('roza_glossary', JSON.stringify(glossary));
  }, [glossary]);

  const addTerm = () => {
    if (!term.trim() || !defn.trim()) return;
    setGlossary([
      ...glossary,
      { id: crypto.randomUUID(), term: term.trim(), definition: defn.trim() },
    ]);
    setTerm('');
    setDefn('');
  };

  const delTerm = (id) => setGlossary(glossary.filter((g) => g.id !== id));

  // --- Knowledge Base PDFs (store as data URLs for MVP)
  const [pdfs, setPdfs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('roza_pdfs') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('roza_pdfs', JSON.stringify(pdfs));
  }, [pdfs]);

  const onPDF = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPdfs([
        ...pdfs,
        { id: crypto.randomUUID(), name: f.name, dataUrl: reader.result },
      ]);
    };
    reader.readAsDataURL(f);
    e.target.value = '';
  };

  const delPDF = (id) => setPdfs(pdfs.filter((p) => p.id !== id));

  // --- NAICS lookup (client → /api/naics?query=...)
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const searchNaics = async () => {
    if (!q.trim()) return;
    setBusy(true);
    setErr('');
    try {
      const r = await fetch(`/api/naics?query=${encodeURIComponent(q.trim())}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setResults(Array.isArray(data?.items) ? data.items : []);
    } catch (e) {
      setErr('Search failed. Try another term.');
      setResults([]);
    } finally {
      setBusy(false);
    }
  };

  const Block = ({ title, children }) => (
    <div className="p-5 border-2 border-black rounded-xl mb-6 bg-white">
      <h2 className="text-2xl font-extrabold mb-4">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="max-w-4xl">
      {/* Glossary */}
      <Block title="Government Contracting Glossary">
        <div className="flex gap-2 mb-3">
          <input
            className="border rounded px-2 py-1 flex-1"
            placeholder="Term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <input
            className="border rounded px-2 py-1 flex-[2]"
            placeholder="Definition"
            value={defn}
            onChange={(e) => setDefn(e.target.value)}
          />
          <button
            className="px-3 py-1 border rounded bg-black text-white"
            onClick={addTerm}
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {glossary.map((g) => (
            <li
              key={g.id}
              className="border rounded px-3 py-2 flex items-start justify-between"
            >
              <div>
                <div className="font-semibold">{g.term}</div>
                <div className="text-sm text-gray-700">{g.definition}</div>
              </div>
              <button
                className="text-sm px-2 py-1 border rounded border-red-500 text-red-600"
                onClick={() => delTerm(g.id)}
              >
                Delete
              </button>
            </li>
          ))}
          {glossary.length === 0 && (
            <li className="text-sm text-gray-500">No terms yet.</li>
          )}
        </ul>
      </Block>

      {/* PDFs */}
      <Block title="Knowledge Base (PDFs)">
        <div className="mb-3">
          <input type="file" accept="application/pdf" onChange={onPDF} />
        </div>
        <ul className="list-disc ml-6 space-y-2">
          {pdfs.map((p) => (
            <li key={p.id}>
              <a
                className="text-blue-700 underline"
                href={p.dataUrl}
                target="_blank"
                rel="noreferrer"
              >
                {p.name}
              </a>
              <button
                className="ml-2 text-sm px-2 py-1 border rounded border-red-500 text-red-600"
                onClick={() => delPDF(p.id)}
              >
                Delete
              </button>
            </li>
          ))}
          {pdfs.length === 0 && (
            <li className="text-sm text-gray-500">No PDFs uploaded yet.</li>
          )}
        </ul>
      </Block>

      {/* NAICS */}
      <Block title="NAICS Look Up">
        <div className="flex gap-2 mb-3">
          <input
            className="border rounded px-2 py-1 flex-1"
            placeholder="Enter keyword…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            className="px-3 py-1 border rounded bg-black text-white"
            onClick={searchNaics}
            disabled={busy}
          >
            {busy ? 'Searching…' : 'Search'}
          </button>
        </div>
        {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
        <ul className="space-y-2">
          {results.map((r, i) => (
            <li key={i} className="border rounded px-3 py-2">
              <div className="font-semibold">{r.code} — {r.title}</div>
              {r.description && <div className="text-sm text-gray-700">{r.description}</div>}
            </li>
          ))}
          {!busy && results.length === 0 && (
            <li className="text-sm text-gray-500">No results yet.</li>
          )}
        </ul>
      </Block>
    </div>
  );
}
