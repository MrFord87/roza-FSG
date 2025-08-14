// pages/api/naics.js
// Robust NAICS lookup with upstream API + strong local fallback (fuzzy search)

export default async function handler(req, res) {
  const q = String(req.query.q || '').trim();
  if (!q) return res.status(200).json({ results: [] });

  try {
    // 1) Try the upstream API first (several combinations)
    const net = await tryUpstream(q);
    if (Array.isArray(net) && net.length) {
      return res.status(200).json({ results: net.slice(0, 25) });
    }

    // 2) Fallback to local fuzzy search
    const local = localSearch(q, DATA);
    return res.status(200).json({ results: local.slice(0, 25) });
  } catch (err) {
    // Absolute fallback: still give local results even if something threw above
    const local = localSearch(q, DATA);
    return res.status(200).json({ results: local.slice(0, 25), error: 'fallback' });
  }
}

/* ---------------------------------------
   Upstream (Code for America NAICS demo)
   --------------------------------------- */

const YEARS = [2017, 2012]; // these endpoints tend to be the most stable
const HOSTS = ['https://api.naics.us', 'http://api.naics.us']; // try https, then http

// If numeric-ish, treat as code; otherwise terms
const isCodeLike = (term) => /^[0-9]{2,6}$/.test(term.replace(/\D/g, ''));

const buildUrl = (host, year, term) => {
  const p = isCodeLike(term) ? `code=${encodeURIComponent(term)}` : `terms=${encodeURIComponent(term)}`;
  return `${host}/v0/q?year=${year}&${p}`;
};

async function tryUpstream(term) {
  for (const host of HOSTS) {
    for (const year of YEARS) {
      const url = buildUrl(host, year, term);
      try {
        const r = await fetch(url, {
          headers: { accept: 'application/json' },
          // keep this non-cached so redeploys don’t pin bad responses
          next: { revalidate: 0 },
        });
        if (!r.ok) continue;
        const data = await r.json().catch(() => []);
        // API sometimes returns array; sometimes {results:[...]}
        const rows = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        const norm = normalize(rows);
        if (norm.length) return norm;
      } catch {
        // try the next combo
      }
    }
  }
  return [];
}

/* ---------------------------------------
   Normalization (API → common shape)
   common row: { code, title, desc, index[] }
   --------------------------------------- */

function normalize(rows = []) {
  return rows
    .map((r) => {
      const code =
        r.code ||
        r.naics_code ||
        r.NaicsCode ||
        r.naics ||
        r.code_code || // just-in-case variants
        '';

      const title =
        r.title ||
        r.description ||
        r.NaicsTitle ||
        r.name ||
        r.title_name ||
        '';

      const desc =
        r.desc ||
        r.definition ||
        r.Definition ||
        r.summary ||
        r.notes ||
        '';

      const index =
        r.index ||
        r.keywords ||
        r.search_terms ||
        r.terms ||
        null;

      return {
        code: String(code || '').trim(),
        title: String(title || '').trim(),
        desc: String(desc || '').trim(),
        index: Array.isArray(index) ? index : index ? [String(index)] : [],
      };
    })
    .filter((x) => x.code && x.title);
}

/* ---------------------------------------
   Local fallback dataset (beefed up)
   (Common small-business + gov contracting categories)
   --------------------------------------- */

const DATA = [
  { code: '236220', title: 'Commercial and Institutional Building Construction', desc: 'Nonresidential building construction; general contractors.' },
  { code: '238160', title: 'Roofing Contractors', desc: 'Roofing, reroofing, roof repair, sheet metal flashing and gutters.', index: ['roof', 'roofing', 'reroof'] },
  { code: '238210', title: 'Electrical Contractors and Other Wiring Installation Contractors', desc: 'Electrical wiring and equipment; fiber, low-voltage, alarm.' },
  { code: '238220', title: 'Plumbing, Heating, and Air-Conditioning Contractors', desc: 'HVAC, mechanical, plumbing contractors.' },
  { code: '238320', title: 'Painting and Wall Covering Contractors', desc: 'Painting, wall covering, finishing.' },
  { code: '238910', title: 'Site Preparation Contractors', desc: 'Excavation, grading, demolition, land clearing.' },
  { code: '238990', title: 'All Other Specialty Trade Contractors', desc: 'Specialty trade work not elsewhere classified.' },

  { code: '423430', title: 'Computer and Computer Peripheral Equipment and Software Merchant Wholesalers', desc: 'IT equipment and software wholesaling.' },
  { code: '424120', title: 'Stationery and Office Supplies Merchant Wholesalers', desc: 'Office supplies distribution.' },

  { code: '484110', title: 'General Freight Trucking, Local', desc: 'Local freight; short-haul trucking.' },
  { code: '488510', title: 'Freight Transportation Arrangement', desc: 'Third-party logistics (3PL), freight brokerage.' },
  { code: '493110', title: 'General Warehousing and Storage', desc: 'Warehousing, storage, distribution centers.' },

  { code: '518210', title: 'Computing Infrastructure Providers, Data Processing, Web Hosting', desc: 'Hosting, cloud infrastructure, data processing.' },
  { code: '519290', title: 'Web Search Portals and All Other Information Services', desc: 'Directories, information services, portals.' },

  { code: '541330', title: 'Engineering Services', desc: 'Civil, mechanical, electrical, and other engineering services.' },
  { code: '541370', title: 'Surveying and Mapping (except Geophysical) Services', desc: 'Land surveying, mapping, GIS.' },
  { code: '541511', title: 'Custom Computer Programming Services', desc: 'Custom software development.' },
  { code: '541512', title: 'Computer Systems Design Services', desc: 'IT systems design, integration, implementation.', index: ['it', 'systems integration', 'networking'] },
  { code: '541513', title: 'Computer Facilities Management Services', desc: 'Managed services, IT outsourcing (MSP).' },
  { code: '541519', title: 'Other Computer Related Services', desc: 'Cybersecurity, IT support not classified elsewhere.', index: ['cybersecurity', 'it support'] },
  { code: '541611', title: 'Administrative Management and General Management Consulting Services', desc: 'Org planning, strategy, business process improvement.' },
  { code: '541612', title: 'Human Resources Consulting Services', desc: 'HR consulting, staffing strategy.' },
  { code: '541618', title: 'Other Management Consulting Services', desc: 'Operations and other management consulting.' },
  { code: '541690', title: 'Other Scientific and Technical Consulting Services', desc: 'Technical advisory and consulting services.' },
  { code: '541715', title: 'R&D in the Physical, Engineering, and Life Sciences (except Nanotechnology and Biotechnology)', desc: 'Research and development services.' },

  { code: '561110', title: 'Office Administrative Services', desc: 'Back-office and administrative support services.' },
  { code: '561210', title: 'Facilities Support Services', desc: 'Base operations support, facilities operations and maintenance.' },
  { code: '561311', title: 'Employment Placement Agencies', desc: 'Talent placement, recruiting.' },
  { code: '561320', title: 'Temporary Help Services', desc: 'Staff augmentation, temporary staffing.' },
  { code: '561612', title: 'Security Guards and Patrol Services', desc: 'Armed/unarmed guards, patrol, protective services.', index: ['security', 'guard', 'patrol'] },
  { code: '561720', title: 'Janitorial Services', desc: 'Custodial, commercial cleaning, interior janitorial.', index: ['cleaning'] },
  { code: '561730', title: 'Landscaping Services', desc: 'Grounds maintenance, lawn care, snow removal.' },
  { code: '561740', title: 'Carpet and Upholstery Cleaning Services', desc: 'Carpet cleaning, upholstery cleaning.' },
  { code: '561790', title: 'Other Services to Buildings and Dwellings', desc: 'Power washing, pest control coordination, building services.' },

  { code: '562111', title: 'Solid Waste Collection', desc: 'Trash collection, waste hauling.' },
  { code: '562910', title: 'Remediation Services', desc: 'Environmental remediation, asbestos/lead abatement.' },

  { code: '611430', title: 'Professional and Management Development Training', desc: 'Corporate training, professional development.' },

  { code: '621999', title: 'All Other Miscellaneous Ambulatory Health Care Services', desc: 'Health services not elsewhere classified.' },

  { code: '711510', title: 'Independent Artists, Writers, and Performers', desc: 'Creative services, content, performance.' },

  { code: '811212', title: 'Computer and Office Machine Repair and Maintenance', desc: 'IT hardware repair, maintenance.' },
  { code: '811310', title: 'Commercial and Industrial Machinery and Equipment Repair and Maintenance', desc: 'Industrial repair and maintenance.' },

  { code: '925120', title: 'Administration of Urban Planning and Community and Rural Development', desc: 'Planning and development support (gov.)' },
];

/* ---------------------------------------
   Local fuzzy search (simple scoring)
   --------------------------------------- */

function localSearch(term, rows) {
  const t = term.toLowerCase();
  const numeric = isCodeLike(term);
  const tokens = t.split(/\s+/).filter(Boolean);

  const scored = rows.map((r) => {
    const code = String(r.code || '').toLowerCase();
    const title = String(r.title || '').toLowerCase();
    const desc = String(r.desc || '').toLowerCase();
    const index = (r.index || []).join(' ').toLowerCase();
    const hay = `${title} ${desc} ${index}`;

    let score = 0;

    if (numeric) {
      // prefer code startsWith, then includes
      if (code.startsWith(t)) score += 100;
      else if (code.includes(t)) score += 60;
    } else {
      // token-by-token matches in title/desc/index
      for (const tok of tokens) {
        if (!tok) continue;
        if (title.includes(tok)) score += 30;
        if (desc.includes(tok)) score += 15;
        if (index.includes(tok)) score += 10;
      }
      // whole-term bonus
      if (hay.includes(t)) score += 20;
    }

    // small tie-breaker: shorter code → slightly higher
    score += Math.max(0, 10 - (r.code ? String(r.code).length : 10));

    return { row: r, score };
  });

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || String(a.row.code).localeCompare(String(b.row.code)))
    .map((x) => x.row);
}
