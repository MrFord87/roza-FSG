import React, { useEffect, useState } from 'react';

export default function Sources() {
  const [urls, setUrls] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('roza_sources') || '[]');
    } catch {
      return [];
    }
  });
  const [label, setLabel] = useState('');
  const [href, setHref] = useState('');

  useEffect(() => {
    localStorage.setItem('roza_sources', JSON.stringify(urls));
  }, [urls]);

  const add = () => {
    if (!label.trim() || !href.trim()) return;
    setUrls([...urls, { id: crypto.randomUUID(), label: label.trim(), href: href.trim() }]);
    setLabel(''); setHref('');
  };

  const del = (id) => setUrls(urls.filter((u) => u.id !== id));

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Sources</h2>
      <div className="flex gap-2 mb-3">
        <input className="border rounded px-2 py-1 flex-1" placeholder="Label (e.g., SAM.gov)" value={label} onChange={(e)=>setLabel(e.target.value)} />
        <input className="border rounded px-2 py-1 flex-[2]" placeholder="https://…" value={href} onChange={(e)=>setHref(e.target.value)} />
        <button className="px-3 py-1 border rounded bg-black text-white" onClick={add}>Add</button>
      </div>
      <ul className="space-y-2">
        {urls.map((u)=>(
          <li key={u.id} className="flex items-center justify-between border rounded px-3 py-2">
            <a className="text-blue-700 underline" href={u.href} target="_blank" rel="noreferrer">{u.label}</a>
            <button className="text-sm px-2 py-1 border rounded border-red-500 text-red-600" onClick={()=>del(u.id)}>Delete</button>
          </li>
        ))}
        {urls.length===0 && <li className="text-sm text-gray-500">No sources yet.</li>}
      </ul>
    </div>
  );
}
