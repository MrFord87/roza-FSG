// pages/api/naics.js
// Fast NAICS search: LOCAL-FIRST (instant), then short-timeout upstream fallback

// ── 1) LOCAL DATA ───────────────────────────────────────────────────────────
// Replace the sample below with YOUR full dataset (array of objects).
const LOCALS = [
  { code: '561612', title: 'Security Guards and Patrol Services', desc: 'Armed/unarmed guards, patrols, protective services.', index: ['guard','patrol','security'] },
  { code: '561720', title: 'Janitorial Services', desc: 'Interior cleaning, custodial services.', index: ['cleaning','custodial','janitor'] },
  { code: '541611', title: 'Admin & General Management Consulting', desc: 'Org planning & management consulting.', index: ['admin','management','consulting'] },
  { code: '541512', title: 'Computer Systems Design Services', desc: 'IT systems design/integration.', index: ['it','systems','integration','software'] },
  { code: '236220', title: 'Commercial & Institutional Building Construction', desc: 'Nonresidential building construction.', index: ['construction','commercial','build'] },
  { code: '238160', title: 'Roofing Contractors', desc: 'Roofing, reroofing, roof repair; flashing & gutters.', index: ['roof','roofing','reroof'] },
  // …PASTE YOUR FULL LIST HERE…
];

// ── 2) HELPERS ──────────────────────────────────────────────────────────────
const safe = (v) => String(v ?? '').toLowerCase();

const normalize = (rows = []) =>
  rows
    .map((r) => {
      const code = safe(r.code || r.naics_code || r.NaicsCode || r.naics);
      const title = safe(r.title || r.NaicsTitle || r.name || r.description);
      const desc = safe(r.desc || r.definition || r.Definition || r.summary || r.description);
      let index = r.index || r.keywords || r.search_terms || r.terms || [];
      if (!Array.isArray(index)) index = [String(index || '')];
      index = index.map(safe);
      return code && title ? { code, title, desc, index } : null;
    })
    .filter(Boolean);

const score = (row, q) => {
  if (!q) return 0;
  const terms = q.split(/\s+/).filter(Boolean);
  let s = 0;
  for (const t of terms) {
    if (row.code === t) s += 30;           // exact code
    else if (row.code.includes(t)) s += 10;

    if (row.title.includes(t)) s += 12;    // title
    if (row.desc?.includes(t)) s += 5;     // description
    if (row.index?.some((i) => i.includes(t))) s += 4; // index terms
  }
  return s;
};

const filterAndRank = (rows, q, limit = 25) => {
  if (!q) return [];
  return rows
    .map((r) => ({ r, s: score(r, q) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ r }) => r);
};

// ── 3) UPSTREAM (short timeout, only if needed) ─────────────────────────────
const YEARS = ['2012', '2007'];
const BASES = [
  (year, q) => `https://api.naics.us/v0/q?year=${year}&terms=${encodeURIComponent(q)}`,
  (year, q) => `https://api.naics.us/v0/q?year=${year}&code=${encodeURIComponent(q)}`,
];

async function fetchWithTimeout(url, ms = 1500) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { headers: { accept: 'application/json' }, signal: ctrl.signal, next: { revalidate: 0 } });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function tryUpstream(term) {
  for (const build of BASES) {
    for (const year of YEARS) {
      const url = build(year, term);
      try {
        const r = await fetchWithTimeout(url, 1500);
        if (!r.ok) continue;
        const data = await r.json().catch(() => null);
        const rows = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        const normalized = normalize(rows);
        if (normalized.length) return normalized;
      } catch {
        // ignore and try next
      }
    }
  }
  return null;
}

// ── 4) HANDLER ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const q = safe(req.query.q || '').trim();
  if (!q) {
    res.status(200).json({ results: [] });
    return;
  }

  try {
    // Local first: instant results
    const localRows = normalize(LOCALS);
    let results = filterAndRank(localRows, q);
    if (results.length) {
      res.status(200).json({ results });
      return;
    }

    // If local had nothing, try the demo API quickly
    const netRows = await tryUpstream(q);
    if (netRows?.length) {
      results = filterAndRank(netRows, q);
    }

    res.status(200).json({ results });
  } catch {
    // absolute fallback: empty array (or return top locals if you prefer)
    res.status(200).json({ results: [] });
  }
}
