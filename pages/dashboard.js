// pages/dashboard.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import Contracts from '../components/contracts';
import Contacts from '../components/contacts';
import Info from '../components/info';
import Sources from '../components/sources';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [date, setDate] = useState(new Date());

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          ['dashboard', 'Dashboard'],
          ['contracts', 'Contracts'],
          ['contacts', 'Contacts'],
          ['info', 'Info'],
          ['sources', 'Sources'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded ${
              activeTab === id ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mini Calendar */}
          <div className="p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4">This Week</h2>
            <Calendar value={date} onChange={setDate} />
          </div>

          {/* Capability Statement */}
          <div
            className="p-6 border-2 border-black rounded-lg shadow-md bg-white flex items-center justify-center cursor-pointer hover:bg-gray-100"
            onClick={() => window.open('/docs/CapabilityStatement.pdf', '_blank')}
          >
            <h2 className="text-lg font-bold text-center">Capability Statement</h2>
          </div>

          {/* Proposal Template */}
          <div
            className="p-6 border-2 border-black rounded-lg shadow-md bg-white flex items-center justify-center cursor-pointer hover:bg-gray-100"
            onClick={() => window.open('/docs/ProposalTemplate.html', '_blank')}
          >
            <h2 className="text-lg font-bold text-center">Proposal Template</h2>
          </div>
        </div>
      )}

      {/* Other tabs */}
      {activeTab === 'contracts' && <Contracts />}
      {activeTab === 'contacts' && <Contacts />}
      {activeTab === 'info' && <Info />}
      {activeTab === 'sources' && <Sources />}
    </div>
  );
}
