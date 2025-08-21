// pages/dashboard.js
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// ✅ All paths are strings and point into ../components/...
import MiniWeekLite from '../components/MiniWeekLite';
import Calendar     from '../components/Calendar';
import Info         from '../components/Info';
import Contacts     from '../components/Contacts';
import Sources      from '../components/Sources';

// ✅ Use dynamic import for Contracts (avoid SSR issues)
const Contracts = dynamic(() => import('../components/Contracts'), { ssr: false });

export default function Dashboard() {
  // Default to the main dashboard view
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load last-opened tab from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('roza_active_tab');
    if (saved) setActiveTab(saved);
  }, []);

  // Persist active tab
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('roza_active_tab', activeTab);
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">This Week</h2>

            {/* Mini calendar */}
            <MiniWeekLite
              onOpenCalendar={(date) => {
                // (optional) open full calendar on date
                // console.log('Open calendar on:', date);
              }}
            />

            {/* Quick Takes box (same gray feel) */}
            <section
              className="mt-4 rounded border border-gray-300 p-4"
              style={{ backgroundColor: '#f0f0f0' }}
            >
              <h3 className="m-0 text-lg font-semibold">FSG LLC Solutions Quick Takes</h3>
              <div className="mt-2 space-y-1">
                <p><strong>EIN:</strong> 33-2704239</p>
                <p><strong>Business Address:</strong> 3100 Joplin RD APT 10305, Kennedale, TX 76060</p>
                <p><strong>CAGE Code:</strong> 0V5Q8</p>
                <p><strong>Unique Entity ID:</strong> N4RCQC3WB4V7</p>
              </div>
            </section>
          </div>
        );

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <MiniCalendar />
  <QuickTakes />
</div>

{/* Proposal Template Viewer */}
<section
  className="mt-4 rounded border border-gray-300 p-4"
  style={{ backgroundColor: '#f0f0f0' }}
>
  <h3 className="m-0 text-lg font-semibold">FSG Proposal Template</h3>
  <iframe
    src="/proposals/FSG-template.html"
    width="100%"
    height="900px"
    style={{ border: "none", marginTop: "10px" }}
    title="Proposal Template"
  />
</section>

  
      case 'calendar':
        return <Calendar />;

      case 'info':
        return <Info />;

      case 'contacts':
        return <Contacts />;

      case 'sources':
        return <Sources />;

      case 'contracts':
        return <Contracts />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Tabs */}
      <nav className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1 rounded ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-3 py-1 rounded ${activeTab === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
        >
          Calendar
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`px-3 py-1 rounded ${activeTab === 'info' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
        >
          Info
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-3 py-1 rounded ${activeTab === 'contacts' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
        >
          Contacts
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`px-3 py-1 rounded ${activeTab === 'sources' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
        >
          Sources
        </button>
        <button
          onClick={() => setActiveTab('contracts')}
          className={`px-3 py-1 rounded ${activeTab === 'contracts' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
        >
          Contracts
        </button>
      </nav>

      {/* Content */}
      <main>{renderTab()}</main>
    </div>
  );
}
