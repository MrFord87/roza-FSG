// pages/api/naics.js
import fs from 'fs';
import path from 'path';

// ---------- load big local dataset if present ----------
let BIG = [];
let LOAD_NOTE = '';

function tryLoadJSON() {
  const candidates = [
    path.join(process.cwd(), 'public', 'naics-local.json'),
    path.join(process.cwd(), 'naics-local.json'),                // just in case
    path.join(__dirname || '.', '../../public/naics-local.json') // SSR path variance
  ];
  for (const fp of candidates) {
    try {
      if (fs.existsSync(fp)) {
        const raw = fs.readFileSync(fp, 'utf8');
        const data = JSON.parse(raw); // will throw if invalid
        if (Array.isArray(data)) {
          BIG = data;
          LOAD_NOTE = `loaded:${fp}`;
          return;
        }
      }
    } catch (e) {
      LOAD_NOTE = `error:${e?.message || String(e)}`;
      // keep trying other paths
    }
  }
  if (!LOAD_NOTE) LOAD_NOTE = 'not_found';
}
tryLoadJSON();

// ---------- small in-file fallback ----------
const FALLBACK = [
  { code: '238160', title: 'Roofing Contractors', desc: 'Roofing, reroofing, roof repair; flashing & gutters.', index: ['roof','roofing','reroof'] },
  { code: '238220', title: 'Plumbing, Heating, and Air-Conditioning Contractors', desc: 'Plumbing, HVAC and related services.', index: ['plumbing','hvac','mechanical'] },
  { code: '238210', title: 'Electrical Contractors and Other Wiring Installation Contractors', desc: 'Electrical wiring and installations; low voltage; alarms.', index: ['electrical','wiring','alarm'] },
  { code: '236220', title: 'Commercial and Institutional Building Construction', desc: 'Nonresidential building construction; general contractors.', index: ['construction','building'] },
  { code: '541512', title: 'Computer Systems Design Services', desc: 'IT systems design, integration, implementation.', index: ['it','systems','integration'] },
  { code: '541611', title: 'Administrative Management and General Management Consulting Services', desc: 'Strategy, process improvement, admin mgmt.', index: ['management consulting','bpi','strategy'] },
  { code: '561612', title: 'Security Guards and Patrol Services', desc: 'Armed/unarmed guards, patrol, protective services.', index: ['security','guard','patrol'] },
  { code: '561720', title: 'Janitorial Services', desc: 'Custodial, commercial cleaning, interior janitorial.', index: ['cleaning','custodial','janitor'] }
];

// ---------- helpers ----------
const safe = (v) => String(v ?? '').toLowerCase();

const normalize = (rows = []) =>
  rows
    .map((r) => {
      const code  = safe(r.code || r.naics_code || r.NaicsCode || r.naics);
      const title = safe(r.title || r.NaicsTitle || r.name || r.description);
      const desc  = safe(r.desc || r.definition || r.Definition || r.summary || r.description);
      let index   = r.index || r.keywords || r.search_terms || r.terms || [];
      if (!Array.isArray(index)) index = [String(index || '')];
      index = index.map(safe);
      return code && title ? { code, title, desc, index } : null;
    })
    .filter(Boolean);

const score = (row, q) => {
  const terms = q.split(/\s+/).filter(Boolean);
  let s = 0;
  for (const t of terms) {
    if (row.code === t) s += 40;
    else if (row.code.startsWith(t)) s += 20;
    else if (row.code.includes(t)) s += 10;

    if (row.title.includes(t)) s += 12;
    if (row.desc?.includes(t)) s += 5;
    if (row.index?.some((i) => i.includes(t))) s += 4;
  }
  return s;
};

const filterAndRank = (rows, q, limit = 25) => {
  const norm = normalize(rows);
  if (!q) return [];
  const qq = safe(q);
  return norm
    .map((r) => ({ r, s: score(r, qq) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s || a.r.code.localeCompare(b.r.code))
    .slice(0, limit)
    .map(({ r }) => r);
};

// ---------- API handler ----------
export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const q = safe(req.query.q || '').trim();
  const rows = (BIG && BIG.length) ? BIG : FALLBACK;
  const source = (BIG && BIG.length) ? 'BIG' : 'FALLBACK';

  const results = q ? filterAndRank(rows, q) : [];

  // Include a small debug hint so you can see what it used
  res.status(200).json({ results, source, note: LOAD_NOTE });
}
