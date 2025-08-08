// Dashboard.js
import React, { useEffect, useState } from 'react';

// ⬇️ Adjust paths if needed based on your project structure
import MyCalendar from '../components/Calendar';
import Contacts from '../components/Contacts';
import Glossary from '../components/Glossary';

const DEFAULT_TAB = 'dashboard'; // 'dashboard' | 'calendar' | 'contacts' | 'glossary'

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

  // On mount, restore from URL hash or localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fromHash = window.location.hash ? window.location.hash.replace('#', '') : '';
    const fromStorage = localStorage.getItem('rozaActiveTab') || '';
    const initial = fromHash || fromStorage || DEFAULT_TAB;
    setActiveTab(initial);
  }, []);

  // Keep URL hash + localStorage in sync with activeTab
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!activeTab) return;
    window.location.hash = activeTab;                 // e.g., /app#calendar
    localStorage.setItem('rozaActiveTab', activeTab); // persist selection
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case 'calendar':
        return <MyCalendar />;
      case 'contacts':
        return <Contacts />;
      case 'glossary':
        return <Glossary />;
      case 'dashboard':
      default:
        return <DashboardHome />;
    }
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'calendar',  label: 'Calendar'  },
    { key: 'contacts',  label: 'Contacts'  },
    { key: 'glossary',  label: 'Glossary'  },
  ];

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
        {tabs.map((t) => (
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
