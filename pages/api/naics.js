// /pages/api/naics.js
// One stable shape out; flexible about whatever the upstream returns.

export default async function handler(req, res) {
  const q = String(req.query.q || '').trim();
  if (!q) return res.status(200).json({ results: [] });

  // You can change this without touching the frontend.
  const BASE = process.env.NAICS_API_URL || 'https://api.naics.us/v0/q?year=2017&terms=';

  // Local fallback if the upstream changes/breaks.
  const FALLBACK = [
    { code: '561612', title: 'Security Guards and Patrol Services', desc: 'Armed/unarmed guards, patrols, protective services.' },
    { code: '561720', title: 'Janitorial Services', desc: 'Interior cleaning, custodial services.' },
    { code: '541611', title: 'Admin & General Management Consulting', desc: 'Org planning and management consulting.' },
    { code: '541512', title: 'Computer Systems Design Services', desc: 'IT systems planning and integration.' },
    { code: '236220', title: 'Commercial & Institutional Building Construction', desc: 'Nonresidential building construction.' },
    { code: '541330', title: 'Engineering Services', desc: 'Applying physical laws and engineering design.' },
  ];

  // Utility: normalize any upstream shape to a single, stable shape.
  const normalize = (rows = []) =>
    rows.map((r) => {
      const code =
        r.code || r.naics_code || r.NaicsCode || r.naics || '';
      const title =
        r.title || r.description || r.NaicsTitle || r.name || '';
      const desc =
        r.desc || r.summary || r.Definition || '';
      const index =
        r.index || r.keywords || r.search_terms || r.terms || null;

      return { code: String(code), title: String(title), desc: desc ? String(desc) : '', index };
    })
    // keep only items that actually have a code/title
    .filter((x) => x.code && x.title)
    .slice(0, 20);

  // Fetch with a timeout so we don’t hang builds/renders.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const r = await fetch(`${BASE}${encodeURIComponent(q)}`, {
      signal: controller.signal,
      headers: { 'accept': 'application/json' },
      cache: 'no-store',
    }).catch((e) => ({ ok: false, status: 599, _err: e }));

    clearTimeout(timer);

    if (!r || !r.ok) {
      // Upstream down/changed? fall back.
      const fb = FALLBACK.filter(
        (x) =>
          x.code.toLowerCase().includes(q.toLowerCase()) ||
          x.title.toLowerCase().includes(q.toLowerCase()) ||
          (x.desc || '').toLowerCase().includes(q.toLowerCase())
      );
      return res.status(200).json({ results: normalize(fb) });
    }

    let data;
    try {
      data = await r.json();
    } catch {
      data = [];
    }

    // The upstream might return an array *or* {results:[...]} etc.
    const rows = Array.isArray(data) ? data : Array.isArray(data.results) ? data.results : [];
    return res.status(200).json({ results: normalize(rows) });
  } catch {
    clearTimeout(timer);
    // Network/timeout -> fallback
    const fb = FALLBACK.filter(
      (x) =>
        x.code.toLowerCase().includes(q.toLowerCase()) ||
        x.title.toLowerCase().includes(q.toLowerCase()) ||
        (x.desc || '').toLowerCase().includes(q.toLowerCase())
    );
    return res.status(200).json({ results: normalize(fb) });
  }
}
