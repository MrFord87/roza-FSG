// pages/dashboard.js
import React, { useState } from 'react';

import Calendar from '../components/calendar';
import Contacts from '../components/contacts';
import Contracts from '../components/contracts';
import Info from '../components/info';
import Sources from '../components/sources';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-3 py-2 rounded border mr-2 mb-2 ${
        activeTab === id ? 'bg-black text-white' : 'bg-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-black mb-4">ROZA Dashboard</h1>

      <div className="flex flex-wrap mb-6">
        <TabButton id="dashboard" label="Dashboard" />
        <TabButton id="calendar" label="Calendar" />
        <TabButton id="contacts" label="Contacts" />
        <TabButton id="info" label="Info" />
        <TabButton id="sources" label="Sources" />
        <TabButton id="contracts" label="Contracts" />
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="p-8 border-2 border-black rounded-xl shadow-sm hover:shadow cursor-pointer flex items-center justify-center"
            onClick={() => window.open('/docs/CapabilityStatement.pdf', '_blank')}
          >
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Capability Statement</div>
              <div className="text-gray-600">Open & view our one-pager</div>
            </div>
          </div>

          <div
            className="p-8 border-2 border-black rounded-xl shadow-sm hover:shadow cursor-pointer flex items-center justify-center"
            onClick={() => window.open('/docs/ProposalTemplate.html', '_blank')}
          >
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Proposal Template</div>
              <div className="text-gray-600">Open & edit our template</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && <Calendar />}
      {activeTab === 'contacts' && <Contacts />}
      {activeTab === 'info' && <Info />}
      {activeTab === 'sources' && <Sources />}
      {activeTab === 'contracts' && <Contracts />}
    </div>
  );
}
