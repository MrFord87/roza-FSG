// components/ProposalPanel.js
import React, { useEffect, useRef, useState } from 'react';

// ===== IndexedDB (separate from Contracts)
const DB_NAME = 'roza_proposals_db';
const STORE = 'proposals';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const s = db.createObjectStore(STORE, { keyPath: 'id' });
        s.createIndex('updatedAt', 'updatedAt');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function dbGetAll() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
async function dbPut(value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}
async function dbDelete(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

// ===== Put your real proposal HTML here once.
// You can paste your full template markup; this is a light scaffold placeholder.
const TEMPLATE_HTML = `
  <div style="font-family: Arial, sans-serif; line-height: 1.4;">
    <h1 style="margin:0;">FSG SOLUTION PROPOSAL</h1>
    <p><b>Client:</b> &lt;Insert Agency/Prime&gt;</p>
    <p><b>Opportunity:</b> &lt;RFP / RFQ / IFB&gt;</p>
    <hr/>
    <h2>Executive Summary</h2>
    <p>&lt;Your summary here…&gt;</p>
    <h2>Technical Approach</h2>
    <p>&lt;Approach…&gt;</p>
    <h2>Past Performance</h2>
    <ul>
      <li>&lt;Project 1&gt;</li>
      <li>&lt;Project 2&gt;</li>
    </ul>
    <h2>Pricing & Assumptions</h2>
    <p>&lt;Pricing notes…&gt;</p>
    <h2>Contact</h2>
    <p>a.ford@fsgsolutions.net • (512) 820-0653</p>
  </div>
`;

export default function ProposalPanel() {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [title, setTitle] = useState('');
  const editorRef = useRef(null);

  // Load saved proposals
  useEffect(() => {
    (async () => {
      const all = await dbGetAll();
      all.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      setItems(all);
      if (all.length) {
        const d = all[0];
        setActiveId(d.id);
        setTitle(d.title || '');
        if (editorRef.current) editorRef.current.innerHTML = d.html || '';
      }
    })();
  }, []);

  function newFromTemplate() {
    setActiveId(null);
    setTitle('Proposal Draft');
    if (editorRef.current) editorRef.current.innerHTML = TEMPLATE_HTML;
  }

  async function save() {
    const id = activeId || uid();
    const html = editorRef.current ? editorRef.current.innerHTML : '';
    const record = {
      id,
      title: title.trim() || 'Proposal Draft',
      html,
      updatedAt: Date.now(),
    };
    await dbPut(record);
    setItems(prev => {
      const rest = prev.filter(p => p.id !== id);
      return [record, ...rest].sort((a,b) => (b.updatedAt||0)-(a.updatedAt||0));
    });
    setActiveId(id);
  }

  function openDoc(d) {
    setActiveId(d.id);
    setTitle(d.title || '');
    if (editorRef.current) editorRef.current.innerHTML = d.html || '';
  }

  async function remove(id) {
    if (!confirm('Delete this proposal?')) return;
    await dbDelete(id);
    setItems(prev => prev.filter(p => p.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setTitle('');
      if (editorRef.current) editorRef.current.innerHTML = '';
    }
  }

  async function downloadDocx() {
    const { Document, Packer, Paragraph } = await import('docx'); // on-demand
    const html = editorRef.current ? editorRef.current.innerHTML : '';
    const text = html.replace(/<br\s*\/?>/gi, '\n')
                     .replace(/<\/p>/gi, '\n')
                     .replace(/<[^>]+>/g, '')
                     .replace(/&nbsp;/g, ' ');
    const paragraphs = text.split('\n').map(t => new Paragraph(t));
    const doc = new Document({ sections: [{ children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title.trim() || 'Proposal')}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function cmd(command) {
    document.execCommand(command, false, null);
    editorRef.current?.focus();
  }

  return (
    <section
      className="mt-4 rounded border border-gray-300 p-4"
      style={{ backgroundColor: '#f0f0f0' }}
    >
      <h3 className="m-0 text-lg font-semibold">Proposal Template (Editable)</h3>

      {/* Header + actions */}
      <div className="mt-3 flex flex-col md:flex-row gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-2 flex-1 bg-white"
          placeholder="Proposal title (e.g., City Parks Cleanup – RFP 12345)"
        />
        <div className="flex gap-2">
          <button onClick={newFromTemplate} className="px-3 py-1 rounded border">New from Template</button>
          <button onClick={save} className="px-3 py-1 rounded bg-blue-600 text-white">Save</button>
          <button onClick={downloadDocx} className="px-3 py-1 rounded border">Download .docx</button>
        </div>
      </div>

      {/* Tiny toolbar */}
      <div className="mt-2 flex gap-2">
        <button onClick={() => cmd('bold')} className="px-2 py-1 border rounded">B</button>
        <button onClick={() => cmd('italic')} className="px-2 py-1 border rounded italic">I</button>
        <button onClick={() => cmd('insertUnorderedList')} className="px-2 py-1 border rounded">• List</button>
      </div>

      {/* Editor — taller to be “about double the size” */}
      <div
        ref={editorRef}
        className="mt-2 bg-white border rounded p-2"
        style={{ outline: 'none', minHeight: 360 }} // ~double height
        contentEditable
        suppressContentEditableWarning
      />

      {/* Saved proposals list */}
      <div className="mt-4">
        <div className="font-semibold mb-1">Saved Proposals</div>
        {items.length === 0 ? (
          <div className="text-sm text-gray-600">No proposals yet. Click “New from Template”.</div>
        ) : (
          <ul className="space-y-2">
            {items.map((d) => (
              <li key={d.id} className="border rounded bg-white p-2 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-medium truncate">{d.title || 'Proposal Draft'}</div>
                  <div className="text-xs text-gray-500">Updated {new Date(d.updatedAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openDoc(d)} className="px-2 py-1 border rounded text-sm">Open</button>
                  <button onClick={() => remove(d.id)} className="px-2 py-1 border rounded text-sm text-red-600">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
