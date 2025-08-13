// components/Info.js
import React, { useEffect, useMemo, useState } from 'react';

/* ---------- SSR-safe localStorage helpers ---------- */
const safeGet = (k, f) => {
  if (typeof window === 'undefined') return f;
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; }
};
const safeSet = (k, v) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};

/* ---------- simple styles (no Tailwind) ---------- */
const wrap = { padding: '16px', maxWidth: 1200, margin: '0 auto' };
const grid = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '16px',
};
const gridWide = {
  gridColumn: '1 / -1',
};
const card = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  padding: '16px',
};
const h1 = { fontSize: 24, fontWeight: 700, marginBottom: 12 };
const h2 = { fontSize: 18, fontWeight: 600, marginBottom: 10 };
const row = { display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' };
const input = { border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 10px', color: '#111', minWidth: 160, flex: 1 };
const btn = { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' };
const btnLite = { border: '1px solid #d1d5db', background: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' };
const muted = { color: '#6b7280', fontSize: 14 };
const listDivider = { borderTop: '1px solid #f3f4f6', paddingTop: 8, marginTop: 8 };

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

  /* Load stored */
  useEffect(() => {
    setGlossary(safeGet('roza_glossary', []));
    setPdfs(safeGet('roza_kb_pdfs', []));
  }, []);

  /* Persist */
  useEffect(() => { safeSet('roza_glossary', glossary); }, [glossary]);
  useEffect(() => { safeSet('roza_kb_pdfs', pdfs); }, [pdfs]);

  /* Glossary actions */
  const addTerm = () => {
    const t = term.trim(); const d = definition.trim();
    if (!t || !d) return;
    setGlossary(prev => [{ id: crypto.randomUUID(), term: t, definition: d }, ...prev]);
    setTerm(''); setDefinition('');
  };
  const deleteTerm = (id) => setGlossary(prev => prev.filter(x => x.id !== id));
  const filteredGlossary = useMemo(() => {
    const s = gSearch.toLowerCase();
    return !s ? glossary :
      glossary.filter(x =>
        x.term.toLowerCase().includes(s) ||
        x.definition.toLowerCase().includes(s)
      );
  }, [glossary, gSearch]);

  /* NAICS */
  const searchNaics = async () => {
    if (!q.trim()) return;
    setNaicsError(''); setNaicsLoading(true); setNaicsResults([]);
    try {
      const res = await fetch(`/api/naics?q=${encodeURIComponent(q.trim())}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setNaicsResults(Array.isArray(data?.results) ? data.results : []);
    } catch {
      setNaicsError('Network error. Make sure /pages/api/naics.js exists and is deployed.');
    } finally {
      setNaicsLoading(false);
    }
  };

  /* PDFs */
  const onPdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { alert('Please choose a PDF.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const entry = {
        id: crypto.randomUUID(),
        name: file.name,
        base64: reader.result, // data:application/pdf;base64,....
        addedAt: new Date().toISOString(),
      };
      setPdfs(prev => [entry, ...prev]);
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const viewPdf = (entry) => {
    try {
      const [meta, b64] = entry.base64.split(',');
      const byteString = atob(b64);
      const len = byteString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = byteString.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer'); // opens directly in new tab
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      alert('Could not open PDF. Try re-uploading it.');
    }
  };

  const deletePdf = (id) => setPdfs(prev => prev.filter(p => p.id !== id));

  /* Responsive grid for larger screens */
  const gridResponsive = {
    ...grid,
    // 2 columns on tablets/desktop
    gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth >= 900 ? '1fr 1fr' : '1fr'
  };

  return (
    <div style={wrap}>
      <h1 style={h1}>Info</h1>

      <div style={gridResponsive}>
        {/* Glossary */}
        <section style={card}>
          <h2 style={h2}>Government Contracting Glossary</h2>

          <div style={row}>
            <input
              style={input}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Term (e.g., RFP)"
            />
            <input
              style={{ ...input, flex: 2 }}
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Definition"
            />
            <button style={btn} onClick={addTerm}>Add</button>
          </div>

          <input
            style={{ ...input, marginBottom: 8 }}
            value={gSearch}
            onChange={(e) => setGSearch(e.target.value)}
            placeholder="Search terms or definitions…"
          />

          {filteredGlossary.length === 0 ? (
            <p style={muted}>No terms yet.</p>
          ) : (
            <div>
              {filteredGlossary.map(item => (
                <div key={item.id} style={listDivider}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.term}</div>
                      <div style={{ color: '#374151', fontSize: 14 }}>{item.definition}</div>
                    </div>
                    <button style={{ ...btnLite, color: '#dc2626', borderColor: '#fecaca' }} onClick={() => deleteTerm(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* NAICS Look Up */}
        <section style={card}>
          <h2 style={h2}>NAICS Look Up</h2>
          <div style={row}>
            <input
              style={input}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Enter keyword (e.g., security)"
            />
            <button style={btn} onClick={searchNaics} disabled={naicsLoading}>
              {naicsLoading ? 'Searching…' : 'Search'}
            </button>
          </div>
          {naicsError && <p style={{ color: '#dc2626', marginBottom: 8 }}>{naicsError}</p>}

          {naicsResults.length === 0 ? (
            <p style={muted}>No results yet.</p>
          ) : (
            <div style={{ maxHeight: 320, overflow: 'auto' }}>
              {naicsResults.map((r, i) => (
                <div key={i} style={listDivider}>
                  <div style={{ fontWeight: 600 }}>{r.code} — {r.title}</div>
                  {r.description && <div style={{ color: '#374151', fontSize: 14 }}>{r.description}</div>}
                </div>
              ))}
            </div>
          )}
          <p style={{ ...muted, marginTop: 8 }}>
            If you see “Network error,” confirm <code>/pages/api/naics.js</code> exists and is deployed.
          </p>
        </section>

        {/* Knowledge Base (PDFs) */}
        <section style={{ ...card, ...gridWide }}>
          <h2 style={h2}>Knowledge Base (PDFs)</h2>

          <div style={{ ...row, alignItems: 'center' }}>
            <input type="file" accept="application/pdf" onChange={onPdfUpload} />
            <span style={muted}>Stored locally in your browser for now.</span>
          </div>

          {pdfs.length === 0 ? (
            <p style={muted}>No PDFs uploaded yet.</p>
          ) : (
            <ul style={{ paddingLeft: 16 }}>
              {pdfs.map(p => (
                <li key={p.id} style={{ marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                  <span style={muted}> • Added {new Date(p.addedAt).toLocaleString()}</span>
                  <div style={{ display: 'inline-flex', gap: 8, marginLeft: 8 }}>
                    <button style={btnLite} onClick={() => viewPdf(p)}>View</button>
                    <button style={{ ...btnLite, color: '#dc2626', borderColor: '#fecaca' }} onClick={() => deletePdf(p.id)}>
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
