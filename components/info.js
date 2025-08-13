// components/info.js
import React, { useEffect, useMemo, useState } from 'react';

// --- tiny helpers for localStorage
const load = (k, d) => {
  if (typeof window === 'undefined') return d;
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; }
};
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export default function Info() {
  // Glossary
  const [glossary, setGlossary] = useState(() => load('roza_glossary', {
    A: [{ term: 'ADA', definition: 'Americans with Disabilities Act — Prohibits discrimination against individuals with disabilities.' }],
    R: [{ term: 'RFP', definition: 'Request for Proposal — Solicitation asking for detailed, evaluated proposals.' }],
    S: [{ term: 'SOW', definition: 'Statement of Work — Describes detailed scope, objectives, deliverables.' }],
  }));
  const [term, setTerm] = useState('');
  const [defn, setDefn] = useState('');
  const alphabet = useMemo(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), []);

  useEffect(() => save('roza_glossary', glossary), [glossary]);

  const addTerm = () => {
    if (!term.trim() || !defn.trim()) return;
    const letter = term.trim()[0].toUpperCase();
    setGlossary(prev => {
      const next = { ...prev };
      next[letter] = next[letter] || [];
      next[letter] = [...next[letter], { term: term.trim(), definition: defn.trim() }];
      return next;
    });
    setTerm(''); setDefn('');
  };

  const deleteTerm = (letter, t) => {
    setGlossary(prev => {
      const next = { ...prev };
      next[letter] = (next[letter] || []).filter(x => x.term !== t);
      return next;
    });
  };

  // PDFs (Knowledge Base)
  const [pdfs, setPdfs] = useState(() => load('roza_pdfs', []));
  useEffect(() => save('roza_pdfs', pdfs), [pdfs]);

  const onUploadPdf = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPdfs(prev => [
        ...prev,
        { id: Date.now(), name: file.name, dataUrl: reader.result, ts: new Date().toISOString() }
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removePdf = (id) => setPdfs(prev => prev.filter(p => p.id !== id));

  // NAICS lookup (keyword only)
  const [q, setQ] = useState('');
  const [naicsLoading, setNaicsLoading] = useState(false);
  const [naicsError, setNaicsError] = useState('');
  const [naicsResults, setNaicsResults] = useState([]);

  const searchNaics = async (e) => {
    e.preventDefault();
    setNaicsError('');
    setNaicsResults([]);
    if (!q.trim()) return;
    try {
      setNaicsLoading(true);
      const resp = await fetch(`/api/naics?q=${encodeURIComponent(q.trim())}`);
      if (!resp.ok) throw new Error('Lookup failed');
      const data = await resp.json();
      setNaicsResults(data?.results || []);
    } catch (err) {
      setNaicsError('Lookup failed. Try another keyword.');
    } finally {
      setNaicsLoading(false);
    }
  };

  // --- UI blocks
  return (
    <div className="space-y-8">
      {/* Block: Glossary */}
      <section className="border-2 border-black rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Government Contracting Glossary</h2>

        <div className="flex gap-2 mb-4">
          <input
            className="border px-3 py-2 rounded w-48"
            placeholder="Term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <input
            className="border px-3 py-2 rounded flex-1"
            placeholder="Definition"
            value={defn}
            onChange={(e) => setDefn(e.target.value)}
          />
          <button onClick={addTerm} className="px-4 py-2 border rounded bg-black text-white">
            Add
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alphabet.map((L) => (
            <div key={L} className="border rounded p-3">
              <h3 className="font-semibold mb-2">{L}</h3>
              {(glossary[L] || []).length === 0 ? (
                <div className="text-gray-500 text-sm">No terms yet.</div>
              ) : (
                <ul className="space-y-2">
                  {(glossary[L] || []).map((item) => (
                    <li key={item.term} className="flex justify-between gap-3">
                      <div>
                        <span className="font-semibold">{item.term}</span>{' '}
                        <span className="text-gray-700">— {item.definition}</span>
                      </div>
                      <button
                        className="text-red-600"
                        onClick={() => deleteTerm(L, item.term)}
                        title="Delete term"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Block: Knowledge Base (PDFs) */}
      <section className="border-2 border-black rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Knowledge Base (PDFs)</h2>

        <input type="file" accept="application/pdf" onChange={onUploadPdf} className="mb-3" />
        {pdfs.length === 0 ? (
          <div className="text-gray-600">No PDFs uploaded yet.</div>
        ) : (
          <ul className="list-disc pl-5 space-y-2">
            {pdfs.map((p) => (
              <li key={p.id}>
                <a
                  href={p.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 underline"
                >
                  {p.name}
                </a>
                <button className="ml-3 text-red-600" onClick={() => removePdf(p.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-gray-500 mt-3">
          PDFs are stored locally in your browser (localStorage). Keep files small for now.
        </p>
      </section>

      {/* Block: NAICS Look Up */}
      <section className="border-2 border-black rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">NAICS Look Up</h2>

        <form onSubmit={searchNaics} className="flex gap-2 mb-3">
          <input
            className="border px-3 py-2 rounded w-64"
            placeholder="Enter keyword (e.g., security)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 border rounded bg-black text-white">
            Search
          </button>
        </form>

        {naicsLoading && <div>Searching…</div>}
        {naicsError && <div className="text-red-600">{naicsError}</div>}
        {naicsResults.length > 0 && (
          <ul className="space-y-2">
            {naicsResults.map((r) => (
              <li key={r.code} className="border rounded p-3">
                <div className="font-semibold">{r.code}</div>
                <div className="text-gray-700">{r.title}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
