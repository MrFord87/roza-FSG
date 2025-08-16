// components/Contracts.js
import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'roza_contracts_v2'; // v2 includes file support

// ---------- utils
const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const normalizeUrl = (u) => {
  if (!u) return '';
  const t = u.trim();
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
};

// ---------- tiny IndexedDB wrapper
const DB_NAME = 'roza_contract_files';
const DB_STORE = 'files';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
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

// ---------- folder icon (inline SVG)
const FolderIcon = ({ className = 'w-8 h-8 text-yellow-700' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M10 4a2 2 0 0 1 1.414.586l1 1A2 2 0 0 0 13.828 6H19a2 2 0 0 1 2 2v1H3V6a2 2 0 0 1 2-2h5z"></path>
    <path d="M3 9h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"></path>
  </svg>
);

export default function Contracts() {
  const [folders, setFolders] = useState([]);
  const [viewId, setViewId] = useState(null); // null=list, else folderId
  const [newFolderName, setNewFolderName] = useState('');
  const [error, setError] = useState('');

  // detail inputs
  const [noteText, setNoteText] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFolders(JSON.parse(raw));
    } catch {}
  }, []);
  // persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(folders)); } catch {}
  }, [folders]);

  const current = useMemo(
    () => folders.find(f => f.id === viewId) || null,
    [folders, viewId]
  );

  // ---- folder ops
  function addFolder(e) {
    e.preventDefault();
    setError('');
    const name = newFolderName.trim();
    if (!name) return setError('Folder name is required.');
    if (folders.some(f => f.name.toLowerCase() === name.toLowerCase()))
      return setError('Folder name already exists.');
    const now = Date.now();
    setFolders([{
      id: uid(),
      name,
      createdAt: now,
      updatedAt: now,
      notes: [],
      links: [],
      files: [], // {id, name, size, type, addedAt}
    }, ...folders]);
    setNewFolderName('');
  }

  function deleteFolder(id) {
    const f = folders.find(x => x.id === id);
    if (!confirm(`Delete folder "${f?.name || ''}" and all its files?`)) return;

    // also remove files from IndexedDB
    (async () => {
      for (const file of (f?.files || [])) {
        try { await idbDel(file.id); } catch {}
      }
    })();

    setFolders(folders.filter(f => f.id !== id));
    if (viewId === id) setViewId(null);
  }

  function renameFolder(id) {
    const f = folders.find(x => x.id === id);
    const name = prompt('New folder name:', f?.name || '');
    if (!name) return;
    if (folders.some(x => x.id !== id && x.name.toLowerCase() === name.trim().toLowerCase())) {
      alert('Another folder already uses that name.');
      return;
    }
    setFolders(folders.map(x => x.id === id ? { ...x, name: name.trim(), updatedAt: Date.now() } : x));
  }

  // ---- notes
  function addNote(e) {
    e.preventDefault();
    if (!current) return;
    const txt = noteText.trim();
    if (!txt) return;
    setFolders(folders.map(f => {
      if (f.id !== current.id) return f;
      return {
        ...f,
        notes: [{ id: uid(), text: txt, ts: Date.now() }, ...f.notes],
        updatedAt: Date.now()
      };
    }));
    setNoteText('');
  }
  function removeNote(nid) {
    if (!current) return;
    setFolders(folders.map(f => {
      if (f.id !== current.id) return f;
      return { ...f, notes: f.notes.filter(n => n.id !== nid), updatedAt: Date.now() };
    }));
  }

  // ---- links
  function addLink(e) {
    e.preventDefault();
    if (!current) return;
    const title = linkTitle.trim();
    const url = normalizeUrl(linkUrl);
    if (!title || !linkUrl.trim()) return;
    try { new URL(url); } catch { alert('Enter a valid URL'); return; }

    setFolders(folders.map(f => {
      if (f.id !== current.id) return f;
      if (f.links.some(l => l.url.toLowerCase() === url.toLowerCase())) return f;
      return {
        ...f,
        links: [{ id: uid(), title, url, ts: Date.now() }, ...f.links],
        updatedAt: Date.now()
      };
    }));
    setLinkTitle('');
    setLinkUrl('');
  }
  function removeLink(lid) {
    if (!current) return;
    setFolders(folders.map(f => {
      if (f.id !== current.id) return f;
      return { ...f, links: f.links.filter(l => l.id !== lid), updatedAt: Date.now() };
    }));
  }

  // ---- files (PDFs) in IndexedDB
  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!current || files.length === 0) return;

    setUploading(true);
    try {
      const accepted = files.filter(f => f.type === 'application/pdf');
      if (accepted.length === 0) {
        alert('Please select PDF files only.');
        return;
      }

      const metaToAdd = [];
      for (const file of accepted) {
        const id = uid();
        await idbPut(id, file);
        metaToAdd.push({
          id,
          name: file.name,
          size: file.size,
          type: file.type,
          addedAt: Date.now(),
        });
      }

      setFolders(folders.map(f => {
        if (f.id !== current.id) return f;
        return { ...f, files: [...metaToAdd, ...f.files], updatedAt: Date.now() };
      }));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function getFileUrl(fileId) {
    const blob = await idbGet(fileId);
    if (!blob) throw new Error('File not found');
    return URL.createObjectURL(blob);
  }

  async function viewFile(fileId) {
    try {
      const url = await getFileUrl(fileId);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      alert('Unable to open file.');
    }
  }

  async function deleteFile(fileId) {
    if (!current) return;
    if (!confirm('Delete this file?')) return;
    try { await idbDel(fileId); } catch {}
    setFolders(folders.map(f => {
      if (f.id !== current.id) return f;
      return { ...f, files: f.files.filter(fl => fl.id !== fileId), updatedAt: Date.now() };
    }));
  }

  // sorting
  const sorted = [...folders].sort((a,b) => (b.updatedAt||0) - (a.updatedAt||0));

  // ======= Renders
  if (current) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setViewId(null)} className="px-3 py-1 border rounded">
            ← Back to folders
          </button>
          <div className="flex gap-2">
            <button onClick={() => renameFolder(current.id)} className="px-3 py-1 border rounded">
              Rename
            </button>
            <button onClick={() => deleteFolder(current.id)} className="px-3 py-1 border rounded border-red-500 text-red-600">
              Delete
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FolderIcon className="w-6 h-6 text-yellow-700" />
          <h2 className="text-xl font-semibold">{current.name}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Notes */}
          <div className="border rounded p-3 bg-white dark:bg-gray-900">
            <div className="font-semibold mb-2">Notes</div>
            <form onSubmit={addNote} className="mb-3">
              <textarea
                value={noteText}
                onChange={(e)=>setNoteText(e.target.value)}
                className="w-full border rounded p-2 bg-white dark:bg-gray-800"
                rows={3}
                placeholder="Add a note..."
              />
              <div className="mt-2 flex justify-end">
                <button className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50" disabled={!noteText.trim()}>
                  Add Note
                </button>
              </div>
            </form>
            {current.notes.length === 0 ? (
              <div className="text-sm text-gray-500">No notes yet.</div>
            ) : (
              <ul className="space-y-2">
                {current.notes.map(n => (
                  <li key={n.id} className="border rounded p-2 flex items-start justify-between">
                    <div className="whitespace-pre-wrap">{n.text}</div>
                    <button onClick={()=>removeNote(n.id)} className="ml-3 text-red-600 text-sm">Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Links */}
          <div className="border rounded p-3 bg-white dark:bg-gray-900">
            <div className="font-semibold mb-2">Links / External Files</div>
            <form onSubmit={addLink} className="grid gap-2 mb-3">
              <input
                value={linkTitle}
                onChange={(e)=>setLinkTitle(e.target.value)}
                className="border rounded p-2 bg-white dark:bg-gray-800"
                placeholder="Title (e.g., SOW PDF on Drive)"
              />
              <input
                value={linkUrl}
                onChange={(e)=>setLinkUrl(e.target.value)}
                className="border rounded p-2 bg-white dark:bg-gray-800"
                placeholder="URL (https://...)"
              />
              <div className="flex justify-end">
                <button className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50" disabled={!linkTitle.trim() || !linkUrl.trim()}>
                  Add Link
                </button>
              </div>
            </form>
            {current.links.length === 0 ? (
              <div className="text-sm text-gray-500">No links yet.</div>
            ) : (
              <ul className="space-y-2">
                {current.links.map(l => (
                  <li key={l.id} className="border rounded p-2 flex items-center justify-between">
                    <div className="min-w-0">
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="underline break-words">
                        {l.title}
                      </a>
                      <div className="text-xs text-gray-500 break-words">{l.url}</div>
                    </div>
                    <button onClick={()=>removeLink(l.id)} className="ml-3 text-red-600 text-sm">Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Files */}
        <div className="border rounded p-3 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Folder Files (PDF)</div>
            <label className="px-3 py-1 border rounded cursor-pointer">
              {uploading ? 'Uploading…' : 'Upload PDF(s)'}
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {current.files.length === 0 ? (
            <div className="mt-2 text-sm text-gray-500">No PDFs uploaded yet.</div>
          ) : (
            <ul className="mt-3 space-y-2">
              {current.files.map(f => (
                <li key={f.id} className="border rounded p-2 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-medium break-words">{f.name}</div>
                    <div className="text-xs text-gray-500">
                      {(f.size/1024).toFixed(1)} KB • {new Date(f.addedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>viewFile(f.id)} className="px-3 py-1 border rounded">View</button>
                    <button onClick={()=>deleteFile(f.id)} className="px-3 py-1 border rounded border-red-500 text-red-600">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // ======= list view (compact, Windows-like; icon+name clickable)
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Contracts</h2>

      <form onSubmit={addFolder} className="flex flex-col md:flex-row gap-2 items-stretch md:items-end">
        <div className="flex-1">
          <label className="block text-sm mb-1">New Folder</label>
          <input
            value={newFolderName}
            onChange={(e)=>setNewFolderName(e.target.value)}
            className="w-full border rounded p-2 bg-white dark:bg-gray-800"
            placeholder="e.g., City Parks Cleanup – RFP #12345"
          />
        </div>
        <button className="px-4 py-2 rounded bg-blue-600 text-white self-end">Add</button>
      </form>
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {sorted.length === 0 ? (
        <div className="text-gray-600">No folders yet. Create your first project above.</div>
      ) : (
        <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
          {sorted.map(f => (
            <div
              key={f.id}
              className="border rounded p-2 bg-white dark:bg-gray-900 flex items-center justify-between text-sm"
            >
              {/* Clickable left section */}
              <button
                onClick={() => setViewId(f.id)}
                className="flex items-center gap-2 min-w-0 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-1 py-1 flex-1"
                title="Open folder"
              >
                <FolderIcon className="w-8 h-8 text-yellow-700" />
                <div className="min-w-0">
                  <div className="font-medium truncate" title={f.name}>{f.name}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(f.updatedAt || f.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </button>

              {/* Small actions on the right */}
              <div className="flex flex-col gap-1 ml-2">
                <button onClick={()=>renameFolder(f.id)} className="px-2 py-1 rounded border text-xs">Rename</button>
                <button onClick={()=>deleteFolder(f.id)} className="px-2 py-1 rounded border border-red-500 text-red-600 text-xs">Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
