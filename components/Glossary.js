  // components/Glossary.js
import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'rozaGlossaryData';

// ---- Default seed data (your existing list) ----
const defaultGlossary = {
  A: [
    { term: 'ADA', definition: 'Americans with Disabilities Act – Prohibits discrimination against individuals with disabilities.' },
    { term: 'ADR', definition: 'Alternative Dispute Resolution – Resolving disputes outside of traditional forums.' },
    { term: 'AFP', definition: 'Annual Funding Profile – Projection of funds for a government program.' },
  ],
  B: [
    { term: 'BAA', definition: 'Broad Agency Announcement – Announcement of research interests.' },
    { term: 'BID', definition: 'Formal proposal to provide goods/services.' },
    { term: 'BPA', definition: 'Blanket Purchase Agreement – For recurring supply/service needs.' },
  ],
  C: [
    { term: 'CAGE Code', definition: 'Commercial and Government Entity code – Unique identifier for vendors.' },
    { term: 'CO', definition: 'Contracting Officer – Authorized to manage contracts.' },
    { term: 'COR', definition: 'Contracting Officer’s Representative – Assists in technical monitoring.' },
    { term: 'COTS', definition: 'Commercial Off-the-Shelf – Ready-made products used in contracts.' },
    { term: 'CPFF', definition: 'Cost Plus Fixed Fee – Cost reimbursement with a fixed fee.' },
    { term: 'CPIF', definition: 'Cost Plus Incentive Fee – Contractor reimbursed with incentive bonuses.' },
  ],
  D: [
    { term: 'DCAA', definition: 'Defense Contract Audit Agency – Performs audits for the DoD.' },
    { term: 'DoD', definition: 'Department of Defense – Oversees national security and military.' },
  ],
  E: [
    { term: 'EVM', definition: 'Earned Value Management – Project management technique to measure performance.' },
  ],
  F: [
    { term: 'FAR', definition: 'Federal Acquisition Regulation – Core rules for federal procurement.' },
    { term: 'FBO', definition: 'Federal Business Opportunities – Legacy site for federal contracting notices (now SAM.gov).' },
    { term: 'FFP', definition: 'Firm Fixed Price – Set contract price not subject to adjustment.' },
  ],
  G: [
    { term: 'GSA', definition: 'General Services Administration – Centralized federal procurement agency.' },
    { term: 'GWAC', definition: 'Government-Wide Acquisition Contract – Multi-agency IT contract vehicle.' },
  ],
  H: [
    { term: 'HUBZone', definition: 'Historically Underutilized Business Zone – Federal program for small businesses in disadvantaged areas.' },
  ],
  I: [
    { term: 'IDIQ', definition: 'Indefinite Delivery/Indefinite Quantity – Contract for unspecified amount of goods/services.' },
    { term: 'IFB', definition: 'Invitation for Bid – Used when requirements are well-defined and lowest bid wins.' },
    { term: 'IGCE', definition: 'Independent Government Cost Estimate – Internal cost projection for budgeting.' },
  ],
  J: [
    { term: 'J&A', definition: 'Justification and Approval – Required for non-competitive contracts.' },
  ],
  K: [
    { term: 'KO', definition: 'Contracting Officer – Alternate abbreviation for CO.' },
  ],
  L: [
    { term: 'LPTA', definition: 'Lowest Price Technically Acceptable – Source selection where lowest acceptable bid wins.' },
  ],
  M: [
    { term: 'MAC', definition: 'Multiple Award Contract – Contract awarded to several vendors.' },
    { term: 'MAS', definition: 'Multiple Award Schedule – GSA schedule for products/services.' },
  ],
  N: [
    { term: 'NAICS', definition: 'North American Industry Classification System – Codes classifying business types.' },
    { term: 'NDA', definition: 'Non-Disclosure Agreement – Legal agreement to protect confidential data.' },
  ],
  O: [
    { term: 'OCI', definition: 'Organizational Conflict of Interest – Unfair advantage due to conflicting roles.' },
    { term: 'OMB', definition: 'Office of Management and Budget – Oversees federal budgets and policies.' },
  ],
  P: [
    { term: 'PALT', definition: 'Procurement Administrative Lead Time – Time from procurement start to contract award.' },
    { term: 'PWS', definition: 'Performance Work Statement – Details expected results and performance standards.' },
  ],
  Q: [
    { term: 'QASP', definition: 'Quality Assurance Surveillance Plan – Ensures service quality standards are met.' },
    { term: 'Q&A', definition: 'Questions and Answers – Formal vendor inquiry responses during solicitation.' },
  ],
  R: [
    { term: 'RFI', definition: 'Request for Information – Market research tool to gather vendor input.' },
    { term: 'RFP', definition: 'Request for Proposal – Solicitation asking for detailed, evaluated proposals.' },
    { term: 'RFQ', definition: 'Request for Quote – Request for pricing information on specific goods/services.' },
  ],
  S: [
    { term: 'SAM', definition: 'System for Award Management – Central registration for government contractors.' },
    { term: 'SBA', definition: 'Small Business Administration – Supports and certifies small businesses.' },
    { term: 'SOW', definition: 'Statement of Work – Describes detailed work scope, objectives, deliverables.' },
    { term: 'SF 1449', definition: 'Standard Form 1449 – Form used for commercial item solicitations.' },
  ],
  T: [
    { term: 'T&M', definition: 'Time and Materials – Contract reimbursing for labor hours and materials used.' },
    { term: 'TOR', definition: 'Terms of Reference – Outlines the purpose, structure, and scope of a contract or initiative.' },
  ],
  U: [
    { term: 'USPFO', definition: 'United States Property and Fiscal Officer – Accountable for federal property in the National Guard.' },
  ],
  V: [
    { term: 'Vendor Vetting', definition: 'Evaluation process of a vendor’s capability, integrity, and risks.' },
  ],
  W: [
    { term: 'WAWF', definition: 'Wide Area Workflow – System for electronic invoice and acceptance.' },
    { term: 'WOSB', definition: 'Women-Owned Small Business – Federal set-aside program for women entrepreneurs.' },
  ],
  X: [],
  Y: [],
  Z: []
};

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function Glossary() {
  const [data, setData] = useState(defaultGlossary);
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [searchTerm, setSearchTerm] = useState('');

  // Add-term form state
  const [newTerm, setNewTerm] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [message, setMessage] = useState('');

  // Load saved glossary (browser only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Ensure all letters exist
        const merged = { ...defaultGlossary, ...parsed };
        alphabet.forEach(l => { if (!merged[l]) merged[l] = []; });
        setData(merged);
      }
    } catch (e) {
      console.warn('Failed to load glossary:', e);
    }
  }, []);

  // Persist glossary when changed
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save glossary:', e);
    }
  }, [data]);

  const filteredTerms = useMemo(() => {
    const list = (data[selectedLetter] || []).slice().sort((a, b) =>
      a.term.localeCompare(b.term)
    );
    if (!searchTerm.trim()) return list;
    const q = searchTerm.toLowerCase();
    return list.filter(
      (e) =>
        e.term.toLowerCase().includes(q) ||
        e.definition.toLowerCase().includes(q)
    );
  }, [data, selectedLetter, searchTerm]);

  const addTerm = () => {
    setMessage('');
    const term = newTerm.trim();
    const definition = newDefinition.trim();
    if (!term || !definition) {
      setMessage('Please enter both a term and a definition.');
      return;
    }
    // Determine letter from first A–Z character in term
    const firstLetter = (term.match(/[A-Za-z]/)?.[0] || 'A').toUpperCase();
    if (!alphabet.includes(firstLetter)) {
      setMessage('Term must start with an A–Z character.');
      return;
    }
    // Prevent duplicates (case-insensitive) within that letter
    const exists = (data[firstLetter] || []).some(
      (e) => e.term.toLowerCase() === term.toLowerCase()
    );
    if (exists) {
      setMessage(`"${term}" already exists under ${firstLetter}.`);
      return;
    }
    const next = { ...data, [firstLetter]: [...(data[firstLetter] || []), { term, definition }] };
    setData(next);
    setSelectedLetter(firstLetter);
    setNewTerm('');
    setNewDefinition('');
    setMessage('✅ Term added.');
    // Clear status after a moment
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="p-4">
      {/* Search + Add Term */}
      <div className="grid gap-3 md:grid-cols-2 mb-4">
        <input
          type="text"
          placeholder="Search terms or definitions..."
          className="p-2 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="bg-white text-black border rounded p-2">
          <div className="text-sm font-semibold mb-2">Add a new term</div>
          <div className="grid gap-2 md:grid-cols-2">
            <input
              type="text"
              placeholder="Term (e.g., ROM)"
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              className="px-2 py-1 border rounded w-full"
            />
            <button
              onClick={addTerm}
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Add Term
            </button>
          </div>
          <textarea
            placeholder="Definition"
            value={newDefinition}
            onChange={(e) => setNewDefinition(e.target.value)}
            rows={3}
            className="mt-2 px-2 py-1 border rounded w-full"
          />
          {message && (
            <div className="mt-2 text-sm">
              {message}
            </div>
          )}
          <div className="mt-1 text-xs text-gray-600">
            Letter is auto-picked from the term’s first A–Z character.
          </div>
        </div>
      </div>

      {/* Alphabet filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`px-3 py-1 rounded-md border ${selectedLetter === letter ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filteredTerms.map((entry) => (
          <div key={entry.term} className="border-b pb-2">
            <h3 className="font-semibold text-lg">{entry.term}</h3>
            <p className="text-sm text-gray-700">{entry.definition}</p>
          </div>
        ))}
        {filteredTerms.length === 0 && (
          <p className="text-gray-500 italic">No matching terms found.</p>
        )}
      </div>
    </div>
  );
}      
