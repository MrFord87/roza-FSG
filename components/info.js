import React, { useState, useEffect } from 'react';

export default function Info() {
  // ---- Glossary state ----
  const [terms, setTerms] = useState([]);
  const [newTerm, setNewTerm] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editTerm, setEditTerm] = useState('');
  const [editDefinition, setEditDefinition] = useState('');

  // ---- NAICS Look Up state ----
  const [q, setQ] = useState('');
  const [naicsLoading, setNaicsLoading] = useState(false);
  const [naicsError, setNaicsError] = useState('');
  const [naicsResults, setNaicsResults] = useState([]);

  // ---- Load glossary from localStorage
  useEffect(() => {
    const savedTerms = JSON.parse(localStorage.getItem('glossaryTerms')) || [];
    setTerms(savedTerms);
  }, []);

  // ---- Save glossary to localStorage
  useEffect(() => {
    localStorage.setItem('glossaryTerms', JSON.stringify(terms));
  }, [terms]);

  // ---- Add term
  const handleAddTerm = () => {
    if (!newTerm.trim() || !newDefinition.trim()) return;
    const updatedTerms = [...terms, { term: newTerm, definition: newDefinition }];
    setTerms(updatedTerms);
    setNewTerm('');
    setNewDefinition('');
  };

  // ---- Edit term
  const handleEditTerm = (index) => {
    setEditIndex(index);
    setEditTerm(terms[index].term);
    setEditDefinition(terms[index].definition);
  };

  const handleSaveEdit = () => {
    if (!editTerm.trim() || !editDefinition.trim()) return;
    const updatedTerms = [...terms];
    updatedTerms[editIndex] = { term: editTerm, definition: editDefinition };
    setTerms(updatedTerms);
    setEditIndex(null);
    setEditTerm('');
    setEditDefinition('');
  };

  // ---- Delete term
  const handleDeleteTerm = (index) => {
    const updatedTerms = terms.filter((_, i) => i !== index);
    setTerms(updatedTerms);
  };

  // ---- NAICS Lookup
  const handleSearch = async () => {
    if (!q.trim()) return;
    setNaicsLoading(true);
    setNaicsError('');
    try {
      const res = await fetch(`/api/naics?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setNaicsResults(data.results || []);
    } catch (error) {
      setNaicsError(error.message);
    } finally {
      setNaicsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Glossary */}
      <div className="p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">Government Contracting Glossary</h2>
        <div className="mb-4 flex space-x-2">
          <input
            type="text"
            placeholder="Term"
            className="border p-2 flex-1"
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="Definition"
            className="border p-2 flex-1"
            value={newDefinition}
            onChange={(e) => setNewDefinition(e.target.value)}
          />
          <button onClick={handleAddTerm} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
        <ul>
          {terms.map((item, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              {editIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editTerm}
                    onChange={(e) => setEditTerm(e.target.value)}
                    className="border p-1 flex-1 mr-2"
                  />
                  <input
                    type="text"
                    value={editDefinition}
                    onChange={(e) => setEditDefinition(e.target.value)}
                    className="border p-1 flex-1 mr-2"
                  />
                  <button onClick={handleSaveEdit} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                </>
              ) : (
                <>
                  <span><strong>{item.term}</strong>: {item.definition}</span>
                  <div>
                    <button onClick={() => handleEditTerm(index)} className="text-blue-500 mr-2">Edit</button>
                    <button onClick={() => handleDeleteTerm(index)} className="text-red-500">Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* NAICS Lookup */}
      <div className="p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">NAICS Look Up</h2>
        <div className="mb-4 flex space-x-2">
          <input
            type="text"
            placeholder="Enter keyword..."
            className="border p-2 flex-1"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
            Search
          </button>
        </div>
        {naicsLoading && <p>Loading...</p>}
        {naicsError && <p className="text-red-500">{naicsError}</p>}
        <ul>
          {naicsResults.map((result, idx) => (
            <li key={idx} className="mb-2">
              <strong>{result.code}</strong>: {result.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Reference PDFs */}
      <div className="p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">Reference PDFs</h2>
        <ul className="list-disc pl-5">
          <li>
            <a href="/pdfs/Example1.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-500">
              Example 1
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
