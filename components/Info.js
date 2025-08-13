import React, { useState } from 'react';

// Convert base64 to PDF Blob
function toPdfBlob(base64) {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: 'application/pdf' });
}

export default function Info() {
  // Glossary state
  const [glossary, setGlossary] = useState({
    ADA: 'Americans with Disabilities Act – Prohibits discrimination against individuals with disabilities.',
    ADR: 'Alternative Dispute Resolution – Resolving disputes outside of traditional forums.',
    AFP: 'Annual Funding Profile – Projection of funds for a government program.'
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Knowledge Base PDFs
  const [pdfList, setPdfList] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rozaKnowledgeBase');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const savePdfList = (list) => {
    setPdfList(list);
    localStorage.setItem('rozaKnowledgeBase', JSON.stringify(list));
  };

  const onUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target.result.split(',')[1];
      const newItem = {
        id: crypto.randomUUID(),
        name: file.name,
        base64,
        size: file.size,
        added: new Date().toLocaleString()
      };
      const updated = [...pdfList, newItem];
      savePdfList(updated);
    };
    reader.readAsDataURL(file);
  };

  const onDelete = (id) => {
    const updated = pdfList.filter((item) => item.id !== id);
    savePdfList(updated);
  };

  const onOpen = (item) => {
    try {
      // 1) Turn the stored base64 into a real PDF Blob
      const pdfBlob = toPdfBlob(item.base64);
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // 2) Build a small HTML page that embeds the PDF fullscreen
      const html = `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${item.name}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>html,body{height:100%;margin:0} iframe{border:0;width:100%;height:100%;}</style>
          </head>
          <body>
            <iframe src="${pdfUrl}" title="${item.name}"></iframe>
            <script>
              // Revoke blob URL when closing the tab
              window.addEventListener('beforeunload', function () {
                try { URL.revokeObjectURL('${pdfUrl}'); } catch (e) {}
              });
            </script>
          </body>
        </html>
      `;

      // 3) Create a Blob URL for the HTML viewer and open it directly
      const htmlBlob = new Blob([html], { type: 'text/html' });
      const viewerUrl = URL.createObjectURL(htmlBlob);
      window.open(viewerUrl, '_blank'); // opens the viewer page directly
    } catch (e) {
      console.error('PDF open error:', e);
      alert('Could not open PDF.');
    }
  };

  // Filtered glossary
  const filteredGlossary = Object.keys(glossary)
    .filter((key) =>
      key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      glossary[key].toLowerCase().includes(searchTerm.toLowerCase())
    )
    .reduce((obj, key) => {
      obj[key] = glossary[key];
      return obj;
    }, {});

  return (
    <div className="p-4 space-y-6">
      {/* Government Contracting Glossary */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Government Contracting Glossary</h2>
        <input
          type="text"
          placeholder="Search terms or definitions..."
          className="border p-2 w-full mb-4 text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          {Object.keys(filteredGlossary).map((term) => (
            <div key={term} className="mb-2">
              <strong>{term}</strong>
              <div>{filteredGlossary[term]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Knowledge Base */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Knowledge Base (PDFs)</h2>
        <input type="file" accept="application/pdf" onChange={onUpload} />
        <ul className="mt-4 space-y-2">
          {pdfList.map((item) => (
            <li key={item.id} className="border p-2 rounded">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-gray-400">
                {(item.size / 1024).toFixed(1)} KB • Added {item.added}
              </div>
              <div className="space-x-2 mt-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => onOpen(item)}
                >
                  View
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-500 mt-2">
          Tip: This MVP stores PDFs in your browser (localStorage). Keep files under ~5 MB each.
        </p>
      </section>
    </div>
  );
}
