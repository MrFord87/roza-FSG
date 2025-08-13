// components/Info.js
import React, { useEffect, useState, useCallback } from 'react';
import Glossary from './Glossary';

// ---------- Helpers (Knowledge Base)
const KB_KEY = 'rozaKnowledgeBasePDFs';
const humanSize = (bytes) =>
  bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result)); // "data:application/pdf;base64,...."
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// Accepts either full data URL or raw base64 and returns a real PDF Blob
function toPdfBlob(data) {
  const hasHeader = /^data:application\/pdf;base64,/i.test(data);
  const base64 = hasHeader ? data.split(',')[1] : data;
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: 'application/pdf' });
}

export default function Info() {
  const [section, setSection] = useState(null); // null | 'glossary' | 'kb' | 'naics'

  // ---------- Knowledge Base (PDFs)
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [kbError, setKbError] = useState('');

  // PDF Modal viewer state
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');

  // Load/save KB list
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KB_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(KB_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setKbError('');
    setBusy(true);
    try {
      const newOnes = [];
      for (const f of files) {
        if (f.type !== 'application/pdf') { setKbError('Only PDF files allowed.'); continue; }
        if (f.size > 5 * 1024 * 1024) { setKbError('Max 5 MB per PDF (MVP limit).'); continue; }
        const dataUrl = await fileToDataUrl(f);
        newOnes.push({
          id: Date.now() + Math.random().toString(16).slice(2),
          name: f.name,
          size: f.size,
          addedAt: new Date().toISOString(),
          base64: dataUrl, // store full data URL for portability
        });
      }
      if (newOnes.length) setItems((prev) => [...newOnes, ...prev]);
      e.target.value = '';
    } finally {
      setBusy(false);
    }
  };

  const onDelete = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

  // Open PDF inside a modal (no new tab)
  const onOpen = (item) => {
    try {
      const blob = toPdfBlob(item.base64);
      const url = URL.createObjectURL(blob);
      setPdfTitle(item.name);
      setPdfBlobUrl(url);
      setPdfModalOpen(true);
    } catch (e) {
      console.error('PDF open error:', e);
      alert('Could not open PDF.');
    }
  };

  const closePdfModal = useCallback(() => {
    setPdfModalOpen(false);
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setPdfBlobUrl('');
    setPdfTitle('');
  }, [pdfBlobUrl]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closePdfModal(); };
    if (pdfModalOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pdfModalOpen, closePdfModal]);

  // ---------- NAICS Look Up (keyword only; /api/naics uses local dataset)
  const [q, setQ] = useState('');
  const [naicsLoading, setNaicsLoading] = useState(false);
  const [naicsError, setNaicsError] = useState('');
  const [naicsResults, setNaicsResults] = useState([]);

  const handleNaicsSearch = async () => {
    const term = q.trim();
    if (!term) return;
    
    setNaicsLoading(true);
    setNaicsError('');
    setNaicsResults([]);
    
    const handleNaicsSearch = async () => {
  const term = q.trim();
  if (!term) return;

  setNaicsLoading(true);
  setNaicsError('');
  setNaicsResults([]);

  try {
    // NOTE: leading slash is important
    const r = await fetch(`/api/naics?q=${encodeURIComponent(term)}`);
    // Avoid throw on .json() if server sent non-JSON
    const json = await r.json().catch(() => ({}));
    if (!r.ok) {
      throw new Error(json?.error || `HTTP ${r.status}`);
    }
    setNaicsResults(Array.isArray(json.results) ? json.results : []);
  } catch (err) {
    setNaicsError(err?.message || 'Lookup failed');
  } finally {
    setNaicsLoading(false);
  }
};

  // ---------- Landing cards
  if (section === null) {
    return (
      <div className="p-4 grid gap-4 md:grid-cols-3">
        <button onClick={() => setSection('glossary')} className="text-left bg-white text-black border border-gray-300 rounded-lg p-4 hover:shadow">
          <h2 className="text-lg font-semibold">Government Contracting Glossary</h2>
          <p className="text-sm text-gray-600 mt-1">Open the A–Z glossary (editable).</p>
        </button>

        <button onClick={() => setSection('kb')} className="text-left bg-white text-black border border-gray-300 rounded-lg p-4 hover:shadow">
          <h2 className="text-lg font-semibold">Knowledge Base (PDFs)</h2>
          <p className="text-sm text-gray-600 mt-1">Upload and view FAQ/reference PDFs.</p>
        </button>

        <button onClick={() => setSection('naics')} className="text-left bg-white text-black border border-gray-300 rounded-lg p-4 hover:shadow">
          <h2 className="text-lg font-semibold">NAICS Look Up</h2>
          <p className="text-sm text-gray-600 mt-1">Search NAICS codes by keyword or code.</p>
        </button>
      </div>
    );
  }

  // ---------- Glossary section
  if (section === 'glossary') {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Government Contracting Glossary</h2>
          <button onClick={() => setSection(null)} className="px-3 py-1 rounded bg-gray-800 text-white">← Back</button>
        </div>
        <div className="bg-white text-black rounded-md border border-gray-300 p-4">
          <Glossary />
        </div>
      </div>
    );
  }

  // ---------- Knowledge Base section
  if (section === 'kb') {
    return (
      <>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Knowledge Base (PDFs)</h2>
            <button onClick={() => setSection(null)} className="px-3 py-1 rounded bg-gray-800 text-white">← Back</button>
          </div>

          <div className="bg-white text-black rounded-md border border-gray-300">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="file" accept="application/pdf" multiple onChange={onUpload} disabled={busy} className="hidden" id="kb-uploader" />
                <span onClick={() => document.getElementById('kb-uploader')?.click()} className={`px-3 py-1 rounded ${busy ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                  {busy ? 'Uploading…' : 'Upload PDF(s)'}
                </span>
              </label>
            </div>

            <div className="p-4">
              {kbError && <div className="mb-3 text-red-600 text-sm">{kbError}</div>}

              {items.length === 0 ? (
                <div className="text-gray-600 text-sm">No PDFs yet. Click <b>Upload PDF(s)</b> to add FAQs or reference docs.</div>
              ) : (
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{item.name}</div>
                        <div className="text-xs text-gray-600">
                          {humanSize(item.size)} • Added {new Date(item.addedAt || item.added || Date.now()).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => onOpen(item)} className="px-2 py-1 text-sm bg-gray-800 text-white rounded">View</button>
                        <button onClick={() => onDelete(item.id)} className="px-2 py-1 text-sm border border-red-500 text-red-600 rounded">Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-3 text-xs text-gray-600">
                Tip: PDFs are stored in your browser (localStorage) for this MVP. We’ll move to cloud storage later.
              </div>
            </div>
          </div>
        </div>

        {/* PDF Modal */}
        {pdfModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
            <div className="relative bg-white rounded-lg w-[95vw] h-[90vh] shadow-2xl overflow-hidden">
              <button
                onClick={closePdfModal}
                className="absolute top-2 right-2 px-3 py-1 rounded bg-gray-900 text-white"
                aria-label="Close PDF"
              >
                Close
              </button>
              <div className="h-full w-full">
                {/* Use iframe to render the PDF blob */}
                <iframe
                  title={pdfTitle || 'PDF'}
                  src={pdfBlobUrl}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // ---------- NAICS Look Up section
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">NAICS Look Up</h2>
        <button onClick={() => setSection(null)} className="px-3 py-1 rounded bg-gray-800 text-white">← Back</button>
      </div>

      <div className="bg-white text-black rounded-md border border-gray-300 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="px-3 py-2 border border-gray-300 rounded md:col-span-2"
            placeholder="Enter keyword or code (e.g., consulting, construction, 541512)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNaicsSearch()}
          />
          <button
            onClick={handleNaicsSearch}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            disabled={naicsLoading || !q.trim()}
          >
            {naicsLoading ? 'Searching…' : 'Search'}
          </button>
        </div>

        {naicsError && <div className="mt-3 text-sm text-red-600">{naicsError}</div>}

        <div className="mt-4 grid gap-3">
  {Array.isArray(naicsResults) && naicsResults.length > 0 ? (
    naicsResults.map((r) => (
      <div key={`${r.code}-${r.title}`} className="border border-gray-200 rounded p-3">
        <div className="font-semibold">{r.code} — {r.title}</div>
        {(r.desc || r.index) && (
          <div className="text-xs text-gray-600 mt-1">
            {r.desc || (Array.isArray(r.index) ? r.index.join(', ') : r.index)}
          </div>
        )}
      </div>
    ))
  ) : (
    !naicsLoading && !naicsError && (
      <div className="text-sm text-gray-600">
        No results yet. Try “IT”, “construction”, or code “541512”.
      </div>
  }
</div>

