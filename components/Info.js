// components/Info.js
import React, { useEffect, useMemo, useState } from 'react';

/* ========= Utilities ========= */
const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

/* ========= IndexedDB for PDFs (Knowledge Base) ========= */
const DB_NAME = 'roza_info_files';
const DB_STORE = 'kb_files';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DB_STORE)) db.createObjectStore(DB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbPut(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(value, key);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}
async function idbGet(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly');
    const req = tx.objectStore(DB_STORE).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}
async function idbDel(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).delete(key);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

/* ========= Glossary (with Add/Edit/Delete) ========= */
const GLOSSARY_STORAGE = 'roza_glossary_v2';

const defaultGlossary = {
  A: [
    { id: uid(), term: 'ADA', definition: 'Americans with Disabilities Act – Prohibits discrimination against individuals with disabilities.' },
    { id: uid(), term: 'ADR', definition: 'Alternative Dispute Resolution – Resolving disputes outside of court.' },
  ],
  B: [
    { id: uid(), term: 'BAA', definition: 'Broad Agency Announcement – Announces research interests.' },
    { id: uid(), term: 'BPA', definition: 'Blanket Purchase Agreement – For recurring supply/service needs.' },
  ],
  C: [
    { id: uid(), term: 'CAGE Code', definition: 'Commercial and Government Entity code – Unique identifier for vendors.' },
    { id: uid(), term: 'CO', definition: 'Contracting Officer – Authorized to manage contracts.' },
    { id: uid(), term: 'COR', definition: 'Contracting Officer’s Representative – Assists in monitoring.' },
    { id: uid(), term: 'COTS', definition: 'Commercial Off-the-Shelf – Ready-made products.' },
  ],
  D: [{ id: uid(), term: 'DCAA', definition: 'Defense Contract Audit Agency – Performs audits for DoD.' }],
  E: [{ id: uid(), term: 'EVM', definition: 'Earned Value Management – Measures cost/schedule performance.' }],
  F: [
    { id: uid(), term: 'FAR', definition: 'Federal Acquisition Regulation – Core procurement rules.' },
    { id: uid(), term: 'FFP', definition: 'Firm Fixed Price – Set price, not subject to adjustment.' },
  ],
  G: [{ id: uid(), term: 'GSA', definition: 'General Services Administration – Central procurement agency.' }],
  H: [{ id: uid(), term: 'HUBZone', definition: 'Historically Underutilized Business Zone – Small business program.' }],
  I: [
    { id: uid(), term: 'IDIQ', definition: 'Indefinite Delivery/Indefinite Quantity – Unspecified quantity over period.' },
    { id: uid(), term: 'IFB', definition: 'Invitation for Bid – Lowest price wins when technically acceptable.' },
  ],
  J: [{ id: uid(), term: 'J&A', definition: 'Justification & Approval – Required for noncompetitive actions.' }],
  K: [{ id: uid(), term: 'KO', definition: 'Contracting Officer – Alt. abbreviation.' }],
  L: [{ id: uid(), term: 'LPTA', definition: 'Lowest Price Technically Acceptable – Source selection method.' }],
  M: [{ id: uid(), term: 'MAS', definition: 'Multiple Award Schedule – GSA schedule for products/services.' }],
  N: [
    { id: uid(), term: 'NAICS', definition: 'North American Industry Classification System – Business classification codes.' },
    { id: uid(), term: 'NDA', definition: 'Non-Disclosure Agreement – Protects confidential info.' },
  ],
  O: [{ id: uid(), term: 'OCI', definition: 'Organizational Conflict of Interest – Unfair advantage risk.' }],
  P: [
    { id: uid(), term: 'PALT', definition: 'Procurement Administrative Lead Time – Start to award timeline.' },
    { id: uid(), term: 'PWS', definition: 'Performance Work Statement – Outcome-based scope.' },
  ],
  Q: [{ id: uid(), term: 'QASP', definition: 'Quality Assurance Surveillance Plan – How performance is monitored.' }],
  R: [
    { id: uid(), term: 'RFI', definition: 'Request for Information – Market research.' },
    { id: uid(), term: 'RFP', definition: 'Request for Proposal – Solicitation for evaluated proposals.' },
    { id: uid(), term: 'RFQ', definition: 'Request for Quote – Pricing on specified goods/services.' },
  ],
  S: [
    { id: uid(), term: 'SAM', definition: 'System for Award Management – Central contractor registry.' },
    { id: uid(), term: 'SBA', definition: 'Small Business Administration – Programs & certifications.' },
    { id: uid(), term: 'SOW', definition: 'Statement of Work – Detailed task-based scope.' },
  ],
  T: [{ id: uid(), term: 'T&M', definition: 'Time & Materials – Pay for hours + materials.' }],
  U: [],
  V: [],
  W: [
    { id: uid(), term: 'WOSB', definition: 'Women-Owned Small Business – Set-aside program.' },
    { id: uid(), term: 'WAWF', definition: 'Wide Area Workflow – E-invoicing/acceptance system.' },
  ],
  X: [],
  Y: [],
  Z: [],
};

function loadGlossary() {
  try {
    const raw = localStorage.getItem(GLOSSARY_STORAGE);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultGlossary;
}
function saveGlossary(data) {
  try { localStorage.setItem(GLOSSARY_STORAGE, JSON.stringify(data)); } catch {}
}

function Glossary() {
  const [data, setData] = useState(loadGlossary);
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ term: '', definition: '' });

  useEffect(() => saveGlossary(data), [data]);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const list = useMemo(() => {
    const arr = (data[selectedLetter] || []);
    if (!search.trim()) return arr;
    const q = search.toLowerCase();
    return arr.filter(e =>
      e.term.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q)
    );
  }, [data, selectedLetter, search]);

  function onSubmit(e) {
    e.preventDefault();
    const term = form.term.trim();
    const definition = form.definition.trim();
    if (!term || !definition) return;
    const letter = (term[0] || 'A').toUpperCase();
    const entry = { id: editId || uid(), term, definition };
    setData(prev => {
      const copy = { ...prev };
      const arr = Array.isArray(copy[letter]) ? [...copy[letter]] : [];
      if (editId) {
        // remove from any bucket it might have been in
        for (const L of Object.keys(copy)) {
          copy[L] = (copy[L] || []).filter(x => x.id !== editId);
        }
      }
      // add to new bucket
      copy[letter] = [entry, ...arr];
      return copy;
    });
    setEditId(null);
    setForm({ term: '', definition: '' });
    setSelectedLetter(letter);
  }

  function onEdit(entry) {
    setEditId(entry.id);
    setForm({ term: entry.term, definition: entry.definition });
    setSelectedLetter((entry.term[0] || 'A').toUpperCase());
  }

  function onDelete(id) {
    setData(prev => {
      const copy = { ...prev };
      for (const L of Object.keys(copy)) {
        copy[L] = (copy[L] || []).filter(x => x.id !== id);
      }
      return copy;
    });
    if (editId === id) {
      setEditId(null);
      setForm({ term: '', definition: '' });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {alphabet.map(L => (
          <button
            key={L}
            onClick={() => setSelectedLetter(L)}
            className={`px-3 py-1 rounded border ${selectedLetter === L ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            {L}
          </button>
        ))}
      </div>

      <input
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        placeholder="Search terms or definitions…"
        className="w-full border rounded p-2"
      />

      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-2 border rounded p-3 bg-white dark:bg-gray-900">
        <input
          value={form.term}
          onChange={(e)=>setForm(f => ({ ...f, term: e.target.value }))}
          placeholder="Term (e.g., RFP)"
          className="border rounded p-2"
        />
        <input
          value={form.definition}
          onChange={(e)=>setForm(f => ({ ...f, definition: e.target.value }))}
          placeholder="Definition"
          className="border rounded p-2"
        />
        <div className="md:col-span-2 flex gap-2">
          <button className="px-3 py-2 rounded bg-blue-600 text-white">{editId ? 'Update' : 'Add'} Term</button>
          {editId && (
            <button type="button" onClick={()=>{ setEditId(null); setForm({term:'',definition:''}); }} className="px-3 py-2 rounded border">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {list.length === 0 ? (
          <div className="text-gray-500 italic">No matching terms.</div>
        ) : list.map(item => (
          <div key={item.id} className="border-b pb-2 flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold">{item.term}</div>
              <div className="text-sm text-gray-700">{item.definition}</div>
            </div>
            <div className="shrink-0 flex gap-2">
              <button onClick={()=>onEdit(item)} className="px-2 py-1 border rounded text-sm">Edit</button>
              <button onClick={()=>onDelete(item.id)} className="px-2 py-1 border rounded border-red-500 text-red-600 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========= Knowledge Base (PDF upload/open/delete) ========= */
const KB_META_STORAGE = 'roza_kb_meta_v1'; // list of files (id, name, size, addedAt)

function KnowledgeBase() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KB_META_STORAGE);
      if (raw) setFiles(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KB_META_STORAGE, JSON.stringify(files)); } catch {}
  }, [files]);

  async function handleUpload(e) {
    const list = Array.from(e.target.files || []);
    if (list.length === 0) return;
    setUploading(true);
    try {
      const pdfs = list.filter(f => f.type === 'application/pdf');
      if (pdfs.length === 0) { alert('Please select PDF files.'); return; }
      const metas = [];
      for (const file of pdfs) {
        const id = uid();
        await idbPut(id, file);
        metas.push({ id, name: file.name, size: file.size, addedAt: Date.now() });
      }
      setFiles(prev => [...metas, ...prev]);
    } finally {
      e.target.value = '';
      setUploading(false);
    }
  }

  async function openFile(id) {
    try {
      const blob = await idbGet(id);
      if (!blob) return alert('File not found.');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      alert('Unable to open file.');
    }
  }

  async function deleteFile(id) {
    if (!confirm('Delete this PDF?')) return;
    try { await idbDel(id); } catch {}
    setFiles(prev => prev.filter(f => f.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Knowledge Base PDFs</h3>
        <label className="px-3 py-1 border rounded cursor-pointer">
          {uploading ? 'Uploading…' : 'Upload PDF(s)'}
          <input type="file" accept="application/pdf" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {files.length === 0 ? (
        <div className="text-gray-600">No PDFs uploaded yet.</div>
      ) : (
        <ul className="space-y-2">
          {files.map(f => (
            <li key={f.id} className="border rounded p-2 flex items-center justify-between bg-white dark:bg-gray-900">
              <div className="min-w-0">
                <div className="font-medium break-words">{f.name}</div>
                <div className="text-xs text-gray-500">{(f.size/1024).toFixed(1)} KB • {new Date(f.addedAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>openFile(f.id)} className="px-3 py-1 border rounded">Open</button>
                <button onClick={()=>deleteFile(f.id)} className="px-3 py-1 border rounded border-red-500 text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ========= NAICS Lookup (local dataset) ========= */
const NAICS_DATA = [
  { code: '541511', title: 'Custom Computer Programming Services' },
  { code: '541512', title: 'Computer Systems Design Services' },
  { code: '541513', title: 'Computer Facilities Management Services' },
  { code: '541519', title: 'Other Computer Related Services' },
  { code: '561110', title: 'Office Administrative Services' },
  { code: '561210', title: 'Facilities Support Services' },
  { code: '561320', title: 'Temporary Help Services' },
  { code: '561612', title: 'Security Guards and Patrol Services' },
  { code: '541611', title: 'Administrative Management and General Management Consulting Services' },
  { code: '541618', title: 'Other Management Consulting Services' },
  { code: '541330', title: 'Engineering Services' },
  { code: '236220', title: 'Commercial and Institutional Building Construction' },
  { code: '238210', title: 'Electrical Contractors and Other Wiring Installation Contractors' },
  { code: '238220', title: 'Plumbing, Heating, and Air-Conditioning Contractors' },
];

function NaicsLookup() {
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return NAICS_DATA.filter(
      x => x.code.includes(term) || x.title.toLowerCase().includes(term)
    ).slice(0, 25);
  }, [q]);

  return (
    <div className="space-y-3">
      <div className="font-semibold">NAICS Lookup</div>
      <input
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        placeholder="Type a code or keyword (e.g., security, 5415)…"
        className="w-full border rounded p-2"
      />
      {q.trim() === '' ? (
        <div className="text-gray-500 text-sm">Start typing to see results.</div>
      ) : results.length === 0 ? (
        <div className="text-gray-500 text-sm italic">No matches.</div>
      ) : (
        <ul className="divide-y">
          {results.map(r => (
            <li key={r.code} className="py-2">
              <div className="font-medium">{r.code}</div>
              <div className="text-sm text-gray-700">{r.title}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ========= Main Info Component with Block Landing ========= */
export default function Info() {
  const [view, setView] = useState('landing'); // landing | glossary | kb | naics

  const Tile = ({ label, desc, onClick }) => (
    <button
      onClick={onClick}
      className="group relative w-56 sm:w-64 h-48 flex items-center justify-center
                 border-4 border-black rounded-2xl cursor-pointer
                 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800
                 transition shadow-sm"
    >
      <div className="text-center">
        <div className="text-lg font-semibold group-hover:underline">{label}</div>
        <div className="text-sm text-gray-600 mt-1">{desc}</div>
      </div>
    </button>
  );

  if (view === 'landing') {
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">Info</h2>
        <p className="text-sm text-gray-700">Choose a section:</p>
        <div className="flex flex-wrap gap-4">
          <Tile label="Government Contracting Glossary" desc="A–Z, search, add/edit/delete" onClick={()=>setView('glossary')} />
          <Tile label="Knowledge Base" desc="Upload & open PDFs" onClick={()=>setView('kb')} />
          <Tile label="NAICS Lookup" desc="Quick code / keyword search" onClick={()=>setView('naics')} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={()=>setView('landing')} className="px-3 py-1 border rounded">← Back</button>
        <div className="font-semibold">
          {view === 'glossary' ? 'Government Contracting Glossary' :
           view === 'kb' ? 'Knowledge Base' :
           'NAICS Lookup'}
        </div>
        <div />
      </div>

      {view === 'glossary' && <Glossary />}
      {view === 'kb' && <KnowledgeBase />}
      {view === 'naics' && <NaicsLookup />}
    </div>
  );
}
