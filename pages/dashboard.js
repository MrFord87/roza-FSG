import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  // TEMPORARY: allow login bypass
  const [loggedIn, setLoggedIn] = useState(true); // replace with actual session/auth check later

  if (!loggedIn) {
    router.push('/login');
    return null;
  }

  const tabs = ['Overview', 'Calendar', 'Tasks', 'Contacts', 'Contracts', 'Proposals'];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Roza Dashboard</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 py-2 rounded ${
              activeTab === tab.toLowerCase()
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* === Tab Content === */}
      <div className="bg-gray-800 p-6 rounded shadow-lg">
        {activeTab === 'overview' && (
          <>
            <h2 className="text-xl font-semibold mb-2">Welcome to Roza 🖤</h2>
            <p className="mb-4">Your Contract Execution & Intelligence Hub</p>
          </>
        )}

        {activeTab === 'calendar' && (
          <>
            <h2 className="text-xl font-semibold mb-2">📅 Calendar</h2>
            <p>Track deadlines, meetings, and project milestones.</p>
          </>
        )}

        {activeTab === 'tasks' && (
          <>
            <h2 className="text-xl font-semibold mb-2">✅ Tasks</h2>
            <p>Manage your task list and stay on top of action items.</p>
          </>
        )}

        {activeTab === 'contacts' && (
          <>
            <h2 className="text-xl font-semibold mb-2">📇 Contacts</h2>
            <p>Maintain your network of agency reps, partners, and vendors.</p>
          </>
        )}

        {activeTab === 'contracts' && (
          <>
            <h2 className="text-xl font-semibold mb-2">📁 Contracts</h2>
            <p>
              Browse, search, and manage your contract folders.
              (Coming soon: folder creation, file upload, and categorization).
            </p>
          </>
        )}

        {activeTab === 'proposals' && (
          <>
            <h2 className="text-xl font-semibold mb-2">📝 Proposal Templates</h2>
            <p>
              Start drafting, editing, and managing proposals for upcoming contracts.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
