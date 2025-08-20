import React from 'react';

export default function ProposalBox() {
  return (
    <div className="bg-gray-800 text-white rounded-2xl p-4 shadow-md mt-6">
      <h2 className="text-lg font-semibold mb-2">FSG Proposal Template</h2>
      <iframe
        src="https://docs.google.com/document/d/1t9k20OSXccYBshG-S8F4lHeFSizTOaak/edit"
        style={{ width: '100%', height: '600px', border: '1px solid #444', borderRadius: '12px' }}
        allowFullScreen
      ></iframe>
    </div>
  );
}
