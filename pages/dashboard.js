// pages/dashboard.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Adjust these imports to your actual component paths
import MyCalendar from '../components/Calendar';
import Contacts from '../components/Contacts';
import Info from '../components/Info';
import Sources from '../components/Sources';
import Contracts from '../components/Contracts';

export default function Dashboard() {
  const router = useRouter();

  // Persist active tab across refreshes; default to Dashboard
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') return 'dashboard';
    return localStorage.getItem('activeTab') || 'dashboard';
  });

  useEffect(() => {
    try {
      localStorage.setItem('activeTab', activeTab);
    } catch {}
  }, [activeTab]);

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  const ProposalTile = () => (
    <div className="p-6">
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
        Open &amp; edit our official proposal template
      </p>

      <button
        onClick={() => router.push('/proposal-template')}
        aria-label="Open Proposal Template"
        className="group relative w-56 sm:w-64 h-72 flex items-center justify-center
                   border-4 border-black rounded-2xl cursor-pointer
                   bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800
                   transition shadow-sm"
      >
        {/* simple paper icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-28 h-36 text-black"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 3h7l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M13 3v5h5" />
          <path d="M8 12h8M8 16h8" />
        </svg>

        <div className="absolute bottom-4 left-0 right-0 text-center">
          <span className="font-semibold group-hover:underline">Proposal Template</span>
        </div>
      </button>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ProposalTile />;

      case 'calendar':
        return (
          <div className="p-4">
            <MyCalendar />
          </div>
        );

      case 'contacts':
        return (
          <div className="p-4">
            <Contacts />
          </div>
        );

      case 'info':
        return (
          <div className="p-4">
            <Info />
          </div>
        );

      case 'sources':
        return (
          <div className="p-4">
            <Sources />
          </div>
        );

      case 'contracts':
        return (
          <div className="p-4">
            <Contracts />
          </div>
        );

      default:
        return <div className="p-4">Select a tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-2xl font-bold p-4">ROZA Dashboard</h1>

      {/* Top tabs */}
      <div className="px-4 pb-4 flex flex-wrap gap-2">
        <TabButton id="dashboard" label="Dashboard" />
        <TabButton id="calendar" label="Calendar" />
        <TabButton id="contacts" label="Contacts" />
        <TabButton id="info" label="Info" />
        <TabButton id="sources" label="Sources" />
        <TabButton id="contracts" label="Contracts" />
      </div>

      {/* Content */}
      <div className="px-4 pb-8">{renderTabContent()}</div>
    </div>
  );
}
