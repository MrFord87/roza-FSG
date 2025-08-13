import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Contracts from './contracts';
import Contacts from './contacts';
import Info from './info';
import Sources from './sources';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [date, setDate] = useState(new Date());

  return (
    <div className="p-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('contracts')}
          className={`px-4 py-2 rounded ${activeTab === 'contracts' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Contracts
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-4 py-2 rounded ${activeTab === 'contacts' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Contacts
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded ${activeTab === 'info' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Info
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`px-4 py-2 rounded ${activeTab === 'sources' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Sources
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mini Calendar */}
          <div className="p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4">This Week</h2>
            <Calendar value={date} onChange={setDate} />
          </div>

          {/* Capability Statement Block */}
          <div
            className="p-6 border-2 border-black rounded-lg shadow-md bg-white flex items-center justify-center cursor-pointer hover:bg-gray-100"
            onClick={() => window.open('/docs/CapabilityStatement.pdf', '_blank')}
          >
            <h2 className="text-lg font-bold text-center">Capability Statement</h2>
          </div>

          {/* Proposal Template Block */}
          <div
            className="p-6 border-2 border-black rounded-lg shadow-md bg-white flex items-center justify-center cursor-pointer hover:bg-gray-100"
            onClick={() => window.open('/docs/ProposalTemplate.html', '_blank')}
          >
            <h2 className="text-lg font-bold text-center">Proposal Template</h2>
          </div>
        </div>
      )}

      {/* Other Tabs */}
      {activeTab === 'contracts' && <Contracts />}
      {activeTab === 'contacts' && <Contacts />}
      {activeTab === 'info' && <Info />}
      {activeTab === 'sources' && <Sources />}
    </div>
  );
}
