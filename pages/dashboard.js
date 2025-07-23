'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Roza Dashboard</h2>
        {['overview', 'calendar', 'tasks', 'contacts', 'proposals'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-left w-full p-2 rounded hover:bg-gray-700 ${
              activeTab === tab ? 'bg-gray-700' : ''
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
        <button className="text-left w-full p-2 rounded bg-red-700 hover:bg-red-800 mt-4">
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h1>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded">Total Clients</div>
            <div className="bg-gray-700 p-4 rounded">Open Tasks</div>
            <div className="bg-gray-700 p-4 rounded">Upcoming Deadlines</div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-gray-700 p-8 rounded text-center">
            [ Calendar Component Placeholder ]
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-2">
            <div className="bg-gray-700 p-4 rounded">Task 1</div>
            <div className="bg-gray-700 p-4 rounded">Task 2</div>
            <div className="bg-gray-700 p-4 rounded">Task 3</div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-2">
            <div className="bg-gray-700 p-4 rounded">John Doe - Builder</div>
            <div className="bg-gray-700 p-4 rounded">Crystal - Realtor</div>
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="bg-gray-700 p-6 rounded">
            <h3 className="text-xl font-semibold mb-4">Proposal Template</h3>
            <p className="text-gray-300">[Placeholder for contract data input]</p>
          </div>
        )}
      </main>
    </div>
  );
}
