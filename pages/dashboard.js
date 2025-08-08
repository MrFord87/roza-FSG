// Dashboard.js
import React, { useEffect, useState } from 'react';

// ⬇️ Adjust paths if needed
import MyCalendar from '../components/Calendar';
import Contacts from '../components/Contacts';
import Contracts from '../components/Contracts';
import Bookmarks from '../components/Bookmarks';
import Glossary from '../components/Glossary'; // This is your Info tab

const DEFAULT_TAB = 'dashboard';

function DashboardHome() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>Welcome to ROZA</h2>
      <p style={{ opacity: 0.8 }}>
        
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);

  // Restore on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fromHash = window.location.hash ? window.location.hash.replace('#', '') : '';
    const fromStorage = localStorage.getItem('rozaActiveTab') || '';
    const initial = fromHash || fromStorage || DEFAULT_TAB;
    setActiveTab(initial);
  }, []);

  // Persist when activeTab changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!activeTab) return;
    window.location.hash = activeTab;
    localStorage.setItem('rozaActiveTab', activeTab);
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case 'calendar':
        return <MyCalendar />;
      case 'contacts':
        return <Contacts />;
      case 'contracts':
        return <Contracts />;
      case 'bookmarks':
        return <Bookmarks />;
      case 'info':
        return <Glossary />;
      case 'dashboard':
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Nav */}
      <nav
        style={{
          display: 'flex',
          gap: 8,
          padding: '0.75rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          position: 'sticky',
          top: 0,
          background: 'transparent',
          backdropFilter: 'blur(4px)',
          zIndex: 10,
        }}
      >
        {[
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'calendar', label: 'Calendar' },
          { key: 'contacts', label: 'Contacts' },
          { key: 'contracts', label: 'Contracts' },
          { key: 'bookmarks', label: 'Bookmarks' },
          { key: 'info', label: 'Info' }, // Shows Glossary
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: 8,
              border: activeTab === t.key ? '1px solid #2563eb' : '1px solid rgba(255,255,255,0.2)',
              background: activeTab === t.key ? '#2563eb' : 'transparent',
              color: activeTab === t.key ? 'white' : 'inherit',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ flex: 1 }}>{renderTab()}</main>
    </div>
  );
}
