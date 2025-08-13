// components/Info.js
import React, { useEffect, useMemo, useState } from 'react';

// ---------- tiny helpers ----------
const ls = {
  get(key, fallback) {
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};
const fmtTime = (d) =>
  new Date(d).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

// ---------- styles (inline, no CSS deps) ----------
const pageWrap = { padding: 16, maxWidth: 1200, margin: '0 auto' };

const gridBase = { display: 'grid', gridTemplateColumns: '1fr', gap: 16 };
const card = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: 16,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
};
const cardTitle = { fontSize: 18, fontWeight: 700, margin: '0 0 12px 0' };
const row = { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 };
const input = {
  flex: 1,
  height: 36,
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: '0 10px',
  outline: 'none',
};
const button = {
  height: 36,
  padding: '0 12px',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  background: '#111827',
  color: '#fff',
  cursor: 'pointer',
};
const subtle = { color: '#6b7280', fontSize: 13 };
const list = { marginTop: 6, paddingLeft: 18 };

export default function Info() {
  // responsive 1 -> 2 columns
  const [cols, setCols] = useState(1);
  useEffect(() => {
    const set = () => setCols(typeof window !== 'undefined' && window.innerWidth >= 900 ? 2 : 1);
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);
  const grid = useMemo(
    () => ({ ...gridBase, gridTemplateColumns: cols === 2 ? '1fr 1fr' : '1fr' }),
    [cols]
  );

  // ---------- Glossary ----------
  const [gTerm, setGTerm] = useState('');
  const [gDef, setGDef] = useState('');
  const [gSearch, setGSearch] = useState('');
  const [terms, setTerms] = useState(() => ls.get('roza_info_glossary', []));
  useEffect(() => ls.set('roza_info_glossary', terms), [terms]);

  const filteredTerms = useMemo(() => {
    const q = gSearch.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
    );
  }, [gSearch, terms]);

  const addTerm = () => {
    const term = gTerm.trim();
    const definition = gDef.trim();
    if (!term || !definition) return;
    setTerms((prev) => [{ id: crypto.randomUUID(), term, definition }, ...prev]);
    setGTerm(''); setGDef('');
  };
  const removeTerm = (id) => setTerms((prev) => prev.filter((t) => t.id !== id));

  // ---------- NAICS Lookup ----------
  const [q, setQ] = useState('');
  const [naicsLoading, setNaicsLoading] = useState(false);
  const [naicsError, setNaicsError] = useState('');
  const [naicsResults, setNaicsResults] = useState([]);

  const searchNaics = async () => {
    if (!q.trim()) return;
    setNaicsLoading(true);
    setNaicsError('');
    setNaicsResults([]);
    try {
      const res = await fetch(`/api/naics?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setNaicsResults(Array.isArray(data?.results) ? data.results : []);
    } catch (e) {
      setNaicsError('Network error. Confirm /pages/api/naics.js exists & is deployed.');
    } finally {
      setNaicsLoading(false);
    }
  };

  // ---------- Knowledge Base (PDFs) ----------
  const [pdfs, setPdfs] = useState(() => ls.get('roza_info_pdfs', []));
  useEffect(() => ls.set('roza_info_pdfs', pdfs), [pdfs]);

  const onUploadPdf = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPdfs((prev) => [
        { id: crypto.randomUUID(), name: file.name, size: file.size, addedAt: Date.now(), dataUrl: reader.result },
        ...prev,
      ]);
    };
    reader.readAsDataURL(file); // store as data URL; opens directly in a new tab
    e.target.value = '';
  };
  const removePdf = (id) => setPdfs((prev) => prev.filter((p) => p.id !== id));
  const viewPdf = (p) => {
    // open the data URL directly so we don’t land on about:blank with an extra “Open” step
    window.open(p.dataUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={pageWrap}>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '6px 0 18px' }}>Info</h1>

      <div style={grid}>
        {/* ---------- Glossary card ---------- */}
        <section style={card}>
          <h2 style={cardTitle}>Government Contracting Glossary</h2>

          <div style={{ ...row, marginBottom: 6 }}>
            <input
              style={input}
              placeholder="Term (e.g., RFP)"
              value={gTerm}
              onChange={(e) => setGTerm(e.target.value)}
            />
            <input
              style={input}
              placeholder="Definition"
              value={gDef}
              onChange={(e) => setGDef(e.target.value)}
            />
            <button style={button} onClick={addTerm}>Add</button>
          </div>

          <input
            style={{ ...input, marginBottom: 10 }}
            placeholder="Search terms or definitions…"
            value={gSearch}
            onChange={(e) => setGSearch(e.target.value)}
          />

          {filteredTerms.length === 0 ? (
            <div style={subtle}>No terms yet.</div>
          ) : (
            <ul style={list}>
              {filteredTerms.map((t) => (
                <li key={t.id} style={{ marginBottom: 8 }}>
                  <strong>{t.term}</strong> — {t.definition}{' '}
                  <button
                    onClick={() => removeTerm(t.id)}
                    style={{
                      ...button,
                      height: 26,
                      padding: '0 8px',
                      marginLeft: 8,
                      background: '#ef4444',
                      borderColor: '#ef4444',
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ---------- NAICS card ---------- */}
        <section style={card}>
          <h2 style={cardTitle}>NAICS Look Up</h2>

          <div style={{ ...row, marginBottom: 6 }}>
            <input
              style={input}
              placeholder="Enter keyword (e.g., security)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchNaics()}
            />
            <button style={button} onClick={searchNaics} disabled={naicsLoading}>
              {naicsLoading ? 'Searching…' : 'Search'}
            </button>
          </div>

          {naicsError && <div style={{ color: '#b91c1c', marginBottom: 6 }}>{naicsError}</div>}

          {naicsResults.length === 0 ? (
            <div style={subtle}>No results yet.</div>
          ) : (
            <ul style={list}>
              {naicsResults.map((r, idx) => (
                <li key={idx} style={{ marginBottom: 6 }}>
                  <strong>{r.code}</strong> — {r.title}
                </li>
              ))}
            </ul>
          )}

          <div style={{ ...subtle, marginTop: 8 }}>
            If you see “Network error,” confirm <code>/pages/api/naics.js</code> exists and is deployed.
          </div>
        </section>

        {/* ---------- Knowledge Base (spans both columns) ---------- */}
        <section
          style={{
            ...card,
            gridColumn: cols === 2 ? '1 / -1' : 'auto',
          }}
        >
          <h2 style={cardTitle}>Knowledge Base (PDFs)</h2>

          <div style={{ ...row, marginBottom: 10, justifyContent: 'space-between' }}>
            <label style={{ ...button, display: 'inline-flex', alignItems: 'center', gap: 8, background: '#111827' }}>
              <input type="file" accept="application/pdf" onChange={onUploadPdf} style={{ display: 'none' }} />
              Choose File
            </label>
            <div style={subtle}>Stored locally in your browser for now.</div>
          </div>

          {pdfs.length === 0 ? (
            <div style={subtle}>No PDFs yet.</div>
          ) : (
            <ul style={list}>
              {pdfs.map((p) => (
                <li key={p.id} style={{ marginBottom: 8 }}>
                  <strong>{p.name}</strong> · <span style={subtle}>Added {fmtTime(p.addedAt)}</span>{' '}
                  <button style={{ ...button, height: 28, padding: '0 10px', marginLeft: 8 }} onClick={() => viewPdf(p)}>
                    View
                  </button>
                  <button
                    style={{
                      ...button,
                      height: 28,
                      padding: '0 10px',
                      marginLeft: 6,
                      background: '#ef4444',
                      borderColor: '#ef4444',
                    }}
                    onClick={() => removePdf(p.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
