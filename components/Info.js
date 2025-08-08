// components/Info.js
import React, { useEffect, useState } from 'react';
import Glossary from './Glossary';

const KB_KEY = 'rozaKnowledgeBasePDFs'; // [{id,name,size,addedAt,base64}]

const humanSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/1024/1024).toFixed(1)} MB`;
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function Info() {
  const [section, setSection] = useState(null); // 'glossary' | 'kb' | null
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Load KB on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KB_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.warn('Failed to load KB:', e);
    }
  }, []);

  // Persist KB
  useEffect(() => {
    try {
      localStorage.setItem(KB_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save KB:', e);
    }
  }, [items]);

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setError('');
    setBusy(true);
    try {
      const newOnes = [];
      for (const f of files) {
        if (f.type !== 'application/pdf') { setError('Only PDF files are allowed.'); continue; }
        if (f.size > 5 * 1024 * 1024) { setError('Max size is 5 MB per PDF (MVP limit).'); continue; }
        const base64 = await fileToBase64(f);
        newOnes.push({
          id: Date.now() + Math.random().toString(16).slice(2),
          name: f.name,
          size: f.size,
          addedAt: new Date().toISOString(),
          base64,
        });
      }
      if (newOnes.length) setItems(prev => [...newOnes, ...prev]);
      e.target.value = '';
    } finally {
      setBusy(false);
    }
  };

  const onDelete = (id) => setItems(prev => prev.filter(x => x.id !== id));
  const onOpen = (item) => {
    const win = window.open();
    if (!win) return alert('Popup blocked—allow popups to view PDFs.');
    win.document.write(
      `<iframe src="${item.base64}" title="${item.name}" style="border:0;position:fixed;inset:0;width:100%;height:100%"></iframe>`
    );
  };

  // Landing chooser UI
  if (!section) {
    return (
      <div className="p-4 grid gap-4 md:grid-cols-2">
        <button
          onClick={() => setSection('glossary')}
          className="text-left bg-white text-black border border-gray-300 rounded-lg p-4 hover:shadow"
        >
          <h2 className="text-lg font-semibold">Government Contracting Glossary</h2>
          <p className="text-sm text-gray-600 mt-1">Tap to open the full glossary A–Z.</p>
        </button>

        <button
          onClick={() => setSection('kb')}
          className="text-left bg-white text-black border border-gray-300 rounded-lg p-4 hover:shadow"
        >
          <h2 className="text-lg font-semibold">Knowledge Base (PDFs)</h2>
          <p className="text-sm text-gray-600 mt-1">Upload and view FAQ/reference PDFs.</p>
        </button>
      </div>
    );
  }

  // Glossary section
  if (section === 'glossary') {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Government Contracting Glossary</h2>
          <button
            onClick={() => setSection(null)}
            className="px-3 py-1 rounded bg-gray-800 text-white"
          >
            ← Back
          </button>
        </div>
        <div className="bg-white text-black rounded-md border border-gray-300 p-4">
          <Glossary />
        </div>
      </div>
    );
  }

  // KB section
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Knowledge Base (PDFs)</h2>
        <button
          onClick={() => setSection(null)}
          className="px-3 py-1 rounded bg-gray-800 text-white"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white text-black rounded-md border border-gray-300">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={onUpload}
              disabled={busy}
              className="hidden"
              id="kb-uploader"
            />
            <span
              onClick={() => document.getElementById('kb-uploader')?.click()}
              className={`px-3 py-1 rounded ${busy ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              {busy ? 'Uploading…' : 'Upload PDF(s)'}
            </span>
          </label>
        </div>

        <div className="p-4">
          {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}

          {items.length === 0 ? (
            <div className="text-gray-600 text-sm">
              No PDFs yet. Click <b>Upload PDF(s)</b> to add FAQs, policies, or reference docs.
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item.id} className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-xs text-gray-600">
                      {humanSize(item.size)} • Added {new Date(item.addedAt).toLocaleString()}
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
            Tip: This MVP stores PDFs in your browser (localStorage). Keep files under ~5 MB each.
            We’ll move to S3/Supabase later for larger files + search.
          </div>
        </div>
      </div>
    </div>
  );
}
