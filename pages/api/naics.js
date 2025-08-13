// pages/api/naics.js
// Embedded NAICS dataset (popular codes across major sectors).
// No fs/path required. Works on Vercel immediately.

const DATA = [
  // ----- 23 Construction -----
  { code: '236115', title: 'New Single-Family Housing Construction', desc: 'Residential building construction (single-family).' },
  { code: '236116', title: 'New Multifamily Housing Construction', desc: 'Residential building construction (multifamily).' },
  { code: '236118', title: 'Residential Remodelers', desc: 'Remodeling and renovations for residential buildings.' },
  { code: '236210', title: 'Industrial Building Construction', desc: 'Factories, plants, industrial facilities.' },
  { code: '236220', title: 'Commercial & Institutional Building Construction', desc: 'Nonresidential building construction (offices, schools, hospitals).' },
  { code: '237110', title: 'Water & Sewer Line and Related Structures', desc: 'Water supply, sewer, and related utility construction.' },
  { code: '237120', title: 'Oil and Gas Pipeline and Related Structures', desc: 'Pipeline construction and related structures.' },
  { code: '237130', title: 'Power and Communication Line and Related Structures', desc: 'Electric power and telecommunications infrastructure.' },
  { code: '237310', title: 'Highway, Street, and Bridge Construction', desc: 'Roadways, streets, bridges.' },
  { code: '237990', title: 'Other Heavy and Civil Engineering Construction', desc: 'Dams, levees, marine, and other civil works.' },
  { code: '238110', title: 'Poured Concrete Foundation & Structure', desc: 'Concrete foundation and structural work.' },
  { code: '238120', title: 'Structural Steel and Precast Concrete', desc: 'Steel erection and precast concrete installation.' },
  { code: '238130', title: 'Framing Contractors', desc: 'Structural framing for buildings.' },
  { code: '238160', title: 'Roofing Contractors', desc: 'Roof installation and repair.' },
  { code: '238210', title: 'Electrical Contractors and Other Wiring Installation', desc: 'Electrical systems and wiring.' },
  { code: '238220', title: 'Plumbing, Heating, and Air-Conditioning', desc: 'Mechanical trades: plumbing, HVAC.' },
  { code: '238310', title: 'Drywall and Insulation Contractors', desc: 'Drywall, plaster, insulation.' },
  { code: '238320', title: 'Painting and Wall Covering Contractors', desc: 'Interior/exterior painting and wall coverings.' },
  { code: '238330', title: 'Flooring Contractors', desc: 'Flooring installation and refinishing.' },
  { code: '238910', title: 'Site Preparation Contractors', desc: 'Excavation, grading, and site prep.' },
  { code: '238990', title: 'All Other Specialty Trade Contractors', desc: 'Misc. specialty construction trades.' },

  // ----- 31-33 Manufacturing (select IT/elec related) -----
  { code: '334111', title: 'Electronic Computer Manufacturing', desc: 'Computers and servers manufacturing.' },
  { code: '334118', title: 'Computer Terminal & Other Peripheral Manufacturing', desc: 'Peripherals: monitors, keyboards, etc.' },
  { code: '334220', title: 'Radio and Television Broadcasting and Wireless Comms Equipment', desc: 'Comms and RF equipment manufacturing.' },

  // ----- 42 Wholesale Trade (IT) -----
  { code: '423430', title: 'Computer and Computer Peripheral Equipment Merchant Wholesalers', desc: 'Wholesale of computers and peripherals.' },

  // ----- 44-45 Retail (select) -----
  { code: '454110', title: 'Electronic Shopping and Mail-Order Houses', desc: 'E-commerce and online retailing.' },

  // ----- 48-49 Transportation/Warehousing -----
  { code: '484110', title: 'General Freight Trucking, Local', desc: 'Local freight trucking.' },
  { code: '484121', title: 'General Freight Trucking, Long-Distance, Truckload', desc: 'Long-haul freight (truckload).' },
  { code: '493110', title: 'General Warehousing and Storage', desc: 'Storage and distribution services.' },

  // ----- 51 Information -----
  { code: '511210', title: 'Software Publishers', desc: 'Publishing and releasing software.' },
  { code: '517311', title: 'Wired Telecommunications Carriers', desc: 'Wired telecom infrastructure and services.' },
  { code: '517312', title: 'Wireless Telecommunications Carriers (except Satellite)', desc: 'Wireless mobile and broadband carriers.' },
  { code: '518210', title: 'Computing Infrastructure Providers, Data Processing, Web Hosting', desc: 'Cloud, hosting, data processing services.' },
  { code: '519190', title: 'All Other Information Services', desc: 'Misc. information services.' },

  // ----- 52 Finance & Insurance (select) -----
  { code: '522320', title: 'Financial Transactions Processing, Reserve, and Clearinghouse', desc: 'Payment processing and clearinghouse services.' },

  // ----- 53 Real Estate -----
  { code: '531120', title: 'Lessors of Nonresidential Buildings (except Miniwarehouses)', desc: 'Leasing office, retail, industrial spaces.' },
  { code: '531312', title: 'Nonresidential Property Managers', desc: 'Property management services.' },

  // ----- 54 Professional, Scientific & Technical -----
  { code: '541310', title: 'Architectural Services', desc: 'Building design and architectural services.' },
  { code: '541330', title: 'Engineering Services', desc: 'Civil, mechanical, electrical, other engineering.' },
  { code: '541340', title: 'Drafting Services', desc: 'CAD drafting and technical drawing.' },
  { code: '541360', title: 'Geophysical Surveying & Mapping Services', desc: 'Geophysical data acquisition and mapping.' },
  { code: '541370', title: 'Surveying and Mapping (except Geophysical) Services', desc: 'Land surveying and mapping.' },
  { code: '541380', title: 'Testing Laboratories', desc: 'Materials and product testing labs.' },
  { code: '541511', title: 'Custom Computer Programming Services', desc: 'Custom software development.' },
  { code: '541512', title: 'Computer Systems Design Services', desc: 'IT systems planning, integration, solutioning.' },
  { code: '541513', title: 'Computer Facilities Management Services', desc: 'On-site IT/ops management, data centers.' },
  { code: '541519', title: 'Other Computer Related Services', desc: 'Cyber, IT support, other computer services.' },
  { code: '541611', title: 'Administrative & General Management Consulting', desc: 'Org strategy, PMO, process improvement.' },
  { code: '541612', title: 'Human Resources Consulting Services', desc: 'HR strategy, recruiting process, benefits.' },
  { code: '541613', title: 'Marketing Consulting Services', desc: 'Branding, go-to-market, market research.' },
  { code: '541614', title: 'Process, Physical Distribution, and Logistics Consulting', desc: 'Logistics optimization and operations.' },
  { code: '541618', title: 'Other Management Consulting Services', desc: 'Misc. consulting (e.g., change mgmt).' },
  { code: '541620', title: 'Environmental Consulting Services', desc: 'Environmental compliance and consulting.' },
  { code: '541690', title: 'Other Scientific and Technical Consulting Services', desc: 'Specialty technical consulting.' },
  { code: '541910', title: 'Marketing Research and Public Opinion Polling', desc: 'Surveys, polling, research services.' },
  { code: '541930', title: 'Translation and Interpretation Services', desc: 'Language translation and interpretation.' },
  { code: '541990', title: 'All Other Professional, Scientific, and Technical Services', desc: 'Misc. professional services.' },

  // ----- 55 Management of Companies -----
  { code: '551114', title: 'Corporate, Subsidiary, and Regional Managing Offices', desc: 'HQ and management offices.' },

  // ----- 56 Admin & Support / Waste Mgmt & Remediation -----
  { code: '561110', title: 'Office Administrative Services', desc: 'Back-office admin services.' },
  { code: '561210', title: 'Facilities Support Services', desc: 'Integrated facilities support.' },
  { code: '561311', title: 'Employment Placement Agencies', desc: 'Staffing and placement services.' },
  { code: '561320', title: 'Temporary Help Services', desc: 'Temp staffing services.' },
  { code: '561499', title: 'All Other Business Support Services', desc: 'Misc. BPO/business support.' },
  { code: '561612', title: 'Security Guards and Patrol Services', desc: 'Armed/unarmed guards, patrols, protective services.' },
  { code: '561720', title: 'Janitorial Services', desc: 'Custodial and cleaning services.' },
  { code: '561730', title: 'Landscaping Services', desc: 'Grounds maintenance and landscaping.' },
  { code: '562111', title: 'Solid Waste Collection', desc: 'Municipal and commercial waste pickup.' },
  { code: '562112', title: 'Hazardous Waste Collection', desc: 'Hazardous waste pickup and transport.' },
  { code: '562119', title: 'Other Waste Collection', desc: 'Specialty/non-hazardous waste collection.' },
  { code: '562211', title: 'Hazardous Waste Treatment and Disposal', desc: 'Hazardous waste processing/disposal.' },
  { code: '562910', title: 'Remediation Services', desc: 'Site cleanup, abatement, remediation.' },

  // ----- 61 Educational Services (select) -----
  { code: '611430', title: 'Professional and Management Development Training', desc: 'Corporate training and development.' },
  { code: '611710', title: 'Educational Support Services', desc: 'Support services for education programs.' },

  // ----- 62 Health Care & Social Assistance (select) -----
  { code: '621111', title: 'Offices of Physicians (except Mental Health Specialists)', desc: 'General medical offices.' },
  { code: '621512', title: 'Diagnostic Imaging Centers', desc: 'Medical imaging services.' },
  { code: '621999', title: 'All Other Misc. Ambulatory Health Care Services', desc: 'Specialty ambulatory health services.' },

  // ----- 71 Arts, Entertainment, and Recreation (select) -----
  { code: '711510', title: 'Independent Artists, Writers, and Performers', desc: 'Creative and artistic services.' },

  // ----- 72 Accommodation & Food Services -----
  { code: '722310', title: 'Food Service Contractors', desc: 'Contract dining, cafeterias, mess halls.' },
  { code: '722320', title: 'Caterers', desc: 'Catering services.' },

  // ----- 81 Other Services -----
  { code: '811212', title: 'Computer and Office Machine Repair and Maintenance', desc: 'Repair/maintenance of computers and office devices.' },
  { code: '811219', title: 'Other Electronic and Precision Equipment Repair', desc: 'Precision/electronics repair services.' },
  { code: '812930', title: 'Parking Lots and Garages', desc: 'Parking operations.' },

  // ----- 92 Public Administration (informational only; not contractor codes) -----
  { code: '921190', title: 'Other General Government Support (Informational)', desc: 'Gov’t internal support (not a vendor code).' },
];

// Simple ranked search
function search(q) {
  const term = String(q || '').trim().toLowerCase();
  if (!term) return [];
  const isCode = /^\d{2,6}$/.test(term);

  const scored = [];
  for (const r of DATA) {
    const c = (r.code || '').toLowerCase();
    const t = (r.title || '').toLowerCase();
    const d = (r.desc || '').toLowerCase();

    let score = -1;
    if (isCode) {
      if (c === term) score = 100;
      else if (c.startsWith(term)) score = 80;
    }
    if (t.includes(term)) score = Math.max(score, 60);
    if (d.includes(term)) score = Math.max(score, 40);

    if (score >= 0) scored.push({ ...r, _score: score });
  }
  scored.sort((a, b) => b._score - a._score);
  return scored.slice(0, 50).map(({ _score, ...rest }) => rest);
}

export default function handler(req, res) {
  try {
    const { q = '' } = req.query;
    const results = search(q);
    return res.status(200).json({ results });
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'NAICS lookup failed', details: String(err?.message || err) });
  }
}
