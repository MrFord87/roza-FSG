// pages/api/naics.js
export default function handler(req, res) {
  const { q = '' } = req.query;
  const keyword = String(q).toLowerCase().trim();

  const DATA = [
    { code: '561612', title: 'Security Guards and Patrol Services', desc: 'Providing guard and patrol services.' },
    { code: '561720', title: 'Janitorial Services', desc: 'Interior cleaning, custodial services.' },
    { code: '541611', title: 'Admin & General Management Consulting', desc: 'Org planning and management consulting.' },
    { code: '541512', title: 'Computer Systems Design Services', desc: 'IT systems planning and integration.' },
    { code: '236220', title: 'Commercial & Institutional Building Construction', desc: 'Nonresidential building construction.' },
    { code: '541330', title: 'Engineering Services', desc: 'Applying physical laws and engineering design.' },
  ];

  let results = DATA;
  if (keyword) {
    results = DATA.filter(
      (r) =>
        r.code.toLowerCase().includes(keyword) ||
        r.title.toLowerCase().includes(keyword) ||
        (r.desc || '').toLowerCase().includes(keyword)
    );
  }

  res.status(200).json({ results });
}
