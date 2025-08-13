// pages/dashboard.js
import React, { useEffect, useState } from 'react';

// Keep paths lowercase to match your components folder names exactly
import Calendar from '../components/Calendar';
import Contracts from '../components/Contracts';
import Contacts from '../components/Contacts';
import Info from '../components/Info';
import Sources from '../components/Sources';
import MiniWeek from '../components/MiniWeek';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // On mount, restore last tab & verify login (client-only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('activeTab');
      if (saved) setActiveTab(saved);

      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (!isLoggedIn) {
        window.location.href = '/login';
      }
    }
  }, []);

  // Persist current tab (client-only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case 'calendar':
        return <Calendar />;
      case 'contracts':
        return <Contracts />;
      case 'contacts':
        return <Contacts />;
      case 'dashboard':
        return (
          <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">This Week</h2>
        <MiniWeek/>
          </div>
        );
      case 'info':
        return <Info />;
      case 'sources':
        return <Sources />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">Welcome to ROZA</h1>
            <p>Select a tab to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 font-bold text-lg border-b border-gray-700">
          ROZA Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`block w-full text-left p-2 rounded ${activeTab === 'dashboard' ? 'bg-gray-700' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`block w-full text-left p-2 rounded ${activeTab === 'calendar' ? 'bg-gray-700' : ''}`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`block w-full text-left p-2 rounded ${activeTab === 'contracts' ? 'bg-gray-700' : ''}`}
          >
            Contracts
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`block w-full text-left p-2 rounded ${activeTab === 'contacts' ? 'bg-gray-700' : ''}`}
          >
            Contacts
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`block w-full text-left p-2 rounded ${activeTab === 'info' ? 'bg-gray-700' : ''}`}
          >
            Info
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`block w-full text-left p-2 rounded ${activeTab === 'sources' ? 'bg-gray-700' : ''}`}
          >
            Sources
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{renderTab()}</main>
    </div>
  );
}
