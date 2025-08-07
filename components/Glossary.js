import React from 'react';

const glossaryData = {
  A: {
    term: 'Acquisition',
    definition: 'The process of acquiring goods or services for federal use.'
  },
  B: {
    term: 'Bid',
    definition: 'A proposal submitted in response to an invitation for bid (IFB).'
  },
  // 🔁 Continue through Z
};

export default function Glossary() {
  return (
    <div className="space-y-4">
      {Object.entries(glossaryData).map(([letter, { term, definition }]) => (
        <div key={letter} className="border-b border-gray-700 pb-2">
          <h3 className="text-yellow-400 font-bold text-lg">{letter} — {term}</h3>
          <p className="text-gray-300">{definition}</p>
        </div>
      ))}
    </div>
  );
}
