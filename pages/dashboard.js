import React, { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import Contracts from '../components/Contracts';
import Contacts from '../components/Contacts';
import Info from '../components/Info';
import Sources from '../components/Sources';
import Bookmarks from '../components/Bookmarks';
import Proposals from '../components/Proposals';
import RozaAssistant from '../components/RozaAssistant';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(() => {
    // Preserve last active tab across refresh
    return localStorage.getItem('activeTab') || 'dashboard';
  });

  useEffect(() => {
    // Store active tab in localStorage
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    // Ensure user is logged in before showing dashboard
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login';
    }
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'calendar':
        return <Calendar />;
      case 'contracts':
        return <Contracts />;
      case 'contacts':
        return <Contacts />;
      case 'info':
        return <Info />;
      case 'sources':
        return <Sources />;
      case 'bookmarks':
        return <Bookmarks />;
      case 'proposals':
        return <Proposals />;
      case 'roza':
        return <RozaAssistant />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome to ROZA</h1>
            <p>Select a tab to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 font-bold text-lg border-b border-gray-700">
          ROZA Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`block w-full text-left p-2 rounded ${
              activeTab === 'dashboard' ? 'bg-gray-700' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`block w-full text-left p-2 rounded ${
              activeTab === 'calendar' ? 'bg-gray-700' : ''
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`block w-full text-left p-2 rounded ${
              activeTab === 'contracts' ? 'bg-gray-700' : ''
            }`}
          >
            Contracts
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`block w-full text-left p-2 rounded ${
              activeTab === 'contacts' ? 'bg-gray-700' : ''
            }`}
          >
            Contacts
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`block w-full text-left p-2 rounded ${
              activeTab === 'info' ? 'bg-gray-700' : ''
            }`}
          >
            Info
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`block w-full text-left p-2 rounded ${
              activeTab === 'sources' ? 'bg-gray-700' : ''
            }`}
          >
            Sources
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`block w-full text-left p-2 rounded ${
              activeTab === 'bookmarks' ? 'bg-gray-700' : ''
            }`}
          >
            Bookmarks
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`block w-full text-left p-2 rounded ${
              activeTab === 'proposals' ? 'bg-gray-700' : ''
            }`}
          >
            Proposals
          </button>
          <button
            onClick={() => setActiveTab('roza')}
            className={`block w-full text-left p-2 rounded ${
              activeTab === 'roza' ? 'bg-gray-700' : ''
            }`}
          >
            ROZA AI
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">{renderTab()}</div>
    </div>
  );
}
