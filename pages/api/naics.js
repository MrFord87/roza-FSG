// pages/api/naics.js
// NAICS search with API-first + filtered local fallback + simple scoring

// ─── 1) LOCAL DATA (keep your big list here) ────────────────────────────────
// Replace the small sample below with YOUR full dataset.
// Format: { code: '561612', title: 'Security Guards and Patrol Services', desc: '...', index?: ['keyword', ...] }
const LOCALS = [
  { code: '561612', title: 'Security Guards and Patrol Services', desc: 'Armed/unarmed guards, patrols, protective services.', index: ['guard', 'patrol', 'security'] },
  { code: '561720', title: 'Janitorial Services', desc: 'Interior cleaning, custodial services.', index: ['cleaning', 'custodial', 'janitor'] },
  { code: '541611', title: 'Admin & General Management Consulting', desc: 'Org planning and management consulting.', index: ['admin', 'management', 'consulting'] },
  { code: '541512', title: 'Computer Systems Design Services', desc: 'IT systems design/integration.', index: ['it', 'systems', 'integration', 'software'] },
  { code: '236220', title: 'Commercial & Institutional Building Construction', desc: 'Nonresidential building construction.', index: ['construction', 'commercial', 'build'] },
  { code: '238160', title: 'Roofing Contractors', desc: 'Roofing, reroofing, roof repair, flashing & gutters.', index: ['roof', 'roofing', 'reroof'] },
  // …paste the rest of your large list here …
];

// ─── 2) HELPERS ─────────────────────────────────────────────────────────────
const safe = (v) => String(v ?? '').toLowerCase();

const normalize = (rows = []) =>
  rows
    .map((r) => {
      const code = safe(r.code || r.naics_code || r.NaicsCode || r.naics);
      const title = safe(r.title || r.description || r.NaicsTitle || r.name);
      const desc =
        safe(r.desc || r.definition || r.Definition || r.summary || r.description);
      let index = r.index || r.keywords || r.search_terms || r.terms || [];
      if (!Array.isArray(index)) index = [String(index || '')];
      index = index.map(safe);

      return code && title
        ? { code, title, desc, index }
        : null;
    })
    .filter(Boolean);

/** simple score: exact-ish hits weigh more; title > desc > index */
const score = (row, q) => {
  if (!q) return 0;
  const terms = q.split(/\s+/).filter(Boolean);
  let s = 0;

  for (const t of terms) {
    // code
    if (row.code === t) s += 20;
    else if (row.code.includes(t)) s += 8;

    // title
    if (row.title.includes(t)) s += 10;

    // desc
    if (row.desc && row.desc.includes(t)) s += 4;

    // index terms
    if (row.index?.some((i) => i.includes(t))) s += 3;
  }
  return s;
};

const filterAndRank = (rows, q, limit = 25) => {
  if (!q) return rows.slice(0, limit);
  const keyed = rows
    .map((r) => ({ r, s: score(r, q) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ r }) => r);
  return keyed;
};

// Upstream demo API endpoints from that README (some years only have limited data)
const YEARS = ['2012', '2007'];
const BASES = [
  (year, q) => `https://api.naics.us/v0/q?year=${year}&terms=${encodeURIComponent(q)}`,
  (year, q) => `https://api.naics.us/v0/q?year=${year}&code=${encodeURIComponent(q)}`,
];

async function tryUpstream(term) {
  for (const build of BASES) {
    for (const year of YEARS) {
      const url = build(year, term);
      try {
        const r = await fetch(url, {
          headers: { accept: 'application/json' },
          // don’t cache this in Next for long; we still filter locally
          next: { revalidate: 0 },
        });
        if (!r.ok) continue;

        const data = await r.json().catch(() => null);
        const rows = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        const normalized = normalize(rows);
        if (normalized.length) return normalized;
      } catch {
        // try next combo
      }
    }
  }
  return null;
}

// ─── 3) HANDLER ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  const q = safe(req.query.q || '');
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // 1) ask upstream (and ALWAYS filter the results)
    let results = [];
    const netRows = await tryUpstream(q);
    if (netRows && netRows.length) {
      results = filterAndRank(netRows, q);
    }

    // 2) if nothing from upstream, or query is empty, use local fallback
    if (!results.length) {
      const localRows = normalize(LOCALS);
      results = filterAndRank(localRows, q);
    }

    res.status(200).json({ results });
  } catch (e) {
    res.status(200).json({ results: filterAndRank(normalize(LOCALS), q) });
  }
}
