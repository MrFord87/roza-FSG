// pages/api/naics.js
// Simple, robust NAICS search with good local fallback + scoring

// --- Local fallback (trimmed sample; keep your larger list here)
const LOCALS = [
  { code: '561612', title: 'Security Guards and Patrol Services', desc: 'Armed/unarmed guards, patrols, protective services.', index: ['guard', 'patrol', 'security'] },
  { code: '561720', title: 'Janitorial Services', desc: 'Interior cleaning, custodial services.', index: ['cleaning', 'custodial', 'janitor'] },
  { code: '541611', title: 'Admin & General Management Consulting', desc: 'Org planning and management consulting.', index: ['admin', 'management', 'consulting'] },
  { code: '541512', title: 'Computer Systems Design Services', desc: 'IT systems planning and integration.', index: ['it', 'systems', 'integration', 'software'] },
  { code: '236220', title: 'Commercial & Institutional Building Construction', desc: 'Nonresidential building construction.', index: ['construction', 'commercial', 'build'] },
  { code: '541330', title: 'Engineering Services', desc: 'Applying physical laws and engineering design.', index: ['engineering', 'design'] },
  // Add more local rows…
];

// ---------- helpers
const normalize = (rows = []) =>
  rows
    .map((r) => {
      const code  = String(r.code || r.naics_code || r.NaicsCode || r.naics || '').trim();
      const title = String(r.title || r.description || r.NaicsTitle || r.name || '').trim();
      const desc  = String(r.desc || r.definition || r.Definition || r.summary || '').trim();
      const index = Array.isArray(r.index)
        ? r.index
        : r.keywords || r.search_terms || r.terms
          ? [].concat(r.keywords || r.search_terms || r.terms)
          : [];
      return { code, title, desc, index: index.map(String) };
    })
    .filter((x) => x.code && x.title);

function filterAndScore(rows, term) {
  const tokens = term
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return rows
    .map((r) => {
      const hay = {
        code: r.code.toLowerCase(),
        title: r.title.toLowerCase(),
        desc: (r.desc || '').toLowerCase(),
        index: (r.index || []).map((w) => (w || '').toLowerCase()),
      };

      // must match ALL tokens somewhere
      const matchesAll = tokens.every((t) =>
        hay.code.includes(t) ||
        hay.title.includes(t) ||
        hay.desc.includes(t) ||
        hay.index.some((w) => w.includes(t))
      );
      if (!matchesAll) return null;

      // basic scoring: earlier/stronger matches rank higher
      let score = 0;
      for (const t of tokens) {
        if (hay.code.startsWith(t)) score += 4;
        if (hay.code.includes(t))   score += 3;
        if (hay.title.includes(t))  score += 2;
        if (hay.desc.includes(t))   score += 1;
        if (hay.index.some((w) => w.includes(t))) score += 1;
      }
      return { ...r, _score: score };
    })
    .filter(Boolean)
    .sort((a, b) => b._score - a._score);
}

// (Optional) upstream try — safe to keep, but we’ll still filter locally if it fails.
async function tryUpstream(q) {
  const YEARS = ['2017', '2012'];
  const BASES = [
    (year, term) => `https://api.naics.us/v0/?year=${year}&search=${encodeURIComponent(term)}`,
    (year, term) => `https://api.naics.us/v0/?year=${year}&terms=${encodeURIComponent(term)}`,
  ];

  for (const build of BASES) {
    for (const year of YEARS) {
      const url = build(year, q);
      try {
        const r = await fetch(url, { headers: { accept: 'application/json' }, cache: 'no-store' });
        if (!r.ok) continue;
        const data = await r.json().catch(() => []);
        const rows = Array.isArray(data) ? data : Array.isArray(data.results) ? data.results : [];
        if (rows.length) return normalize(rows);
      } catch {
        // try next
      }
    }
  }
  return null;
}

export default async function handler(req, res) {
  const q = String(req.query.q || '').trim();
  if (q.length < 2) {
    // don’t spam the UI with everything for 1-letter searches
    return res.status(200).json({ results: [] });
  }

  // 1) Try upstream (may be null/empty)
  let upstream = await tryUpstream(q);

  // 2) Always filter (upstream or local) by the query, then return top 25
  const base = upstream && upstream.length ? upstream : normalize(LOCALS);
  const filtered = filterAndScore(base, q).slice(0, 25);

  // cache a bit (api, not SSG)
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ results: filtered });
}
