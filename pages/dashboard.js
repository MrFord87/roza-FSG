import React, { useState } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Welcome to Roza 🖤</h2>
            <p className="text-gray-300 mb-6">
              Your Contract Execution & Intelligence Hub
            </p>
          </div>
        );
      case 'calendar':
        return <p>📅 Calendar: View your upcoming deadlines and milestones.</p>;
      case 'tasks':
        return <p>✅ Tasks: Track your to-do list and project progress.</p>;
      case 'contacts':
        return <p>📇 Contacts: Manage contractor and client details.</p>;
      case 'proposals':
        return (
          <div>
            <h2 className="text-xl font-bold mb-2">Proposal Template</h2>
            <p className="mb-4">[Placeholder for contract data input]</p>
            <h3 className="text-lg font-semibold mb-2">One Contract at a Time</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Keyword (e.g. janitorial)"
                className="p-2 rounded bg-gray-700 text-white w-full"
              />
              <input
                type="text"
                placeholder="Location (e.g. TX)"
                className="p-2 rounded bg-gray-700 text-white w-full"
              />
              <input
                type="text"
                placeholder="NAICS Code"
                className="p-2 rounded bg-gray-700 text-white w-full"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
                Search SAM.gov
              </button>
            </div>
            <p className="mt-4 text-red-500">
              🚫 No results found — try a different keyword or refine your search.
            </p>
          </div>
        );
      case 'folders':
        return <p>📁 Folders: Store and organize key project documents here.</p>;
      case 'bookmarks':
        return <p>🔖 Bookmarks: Quick links to helpful contracting websites.</p>;
      case 'info':
        return <p>📘 Info Tab: Contracting definitions, guides, and glossary.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <h1 className="text-4xl font-bold mb-6">Roza Dashboard</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          'overview',
          'calendar',
          'tasks',
          'contacts',
          'proposals',
          'folders',
          'bookmarks',
          'info',
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Login Box (only visible on overview) */}
      {activeTab === 'overview' && (
        <form className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm mb-10">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="you@example.com"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mt-4"
          >
            Login
          </button>
        </form>
      )}

      {/* Tab Content */}
      <div>{renderTab()}</div>
    </div>
  );
}
