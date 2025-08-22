import React, { useEffect, useState } from 'react';

import MiniWeekLite from '../components/MiniWeekLite';
import Calendar from '../components/Calendar';
import Info from '../components/Info';
import Contacts from '../components/Contacts';
import Sources from '../components/Sources';
import Contracts from '../components/Contracts';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // ✅ don’t redirect until we’ve checked client

  // restore tab
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('roza_active_tab');
    if (saved) setActiveTab(saved);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('roza_active_tab', activeTab);
  }, [activeTab]);

  // check login on the client, then mark ready
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('roza_user');
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.email) {
        setUser(parsed);
      }
    } catch {
      // corrupt value? clear it
      localStorage.removeItem('roza_user');
    } finally {
      setReady(true);
    }
  }, []);

  // redirect only after we’re ready and found no user
  useEffect(() => {
    if (!ready) return;
    if (!user) window.location.replace('/login');
  }, [ready, user]);

  const handleLogout = () => {
    try { localStorage.removeItem('roza_user'); } catch {}
    window.location.replace('/login');
  };

  // While we’re deciding, render nothing (prevents flicker + loops)
  if (!ready) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-200 dark:border-gray-800">
        <nav className="flex gap-2">
          {['dashboard','calendar','info','contacts','sources','contracts'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              {tab.charAt(0).toUpperCase()+tab.slice(1)}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {user?.email ? `Signed in as ${user.email}` : ''}
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </div>

      <main>
        {activeTab === 'dashboard' && (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">This Week</h2>
            <MiniWeekLite />
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
        )}
        {activeTab === 'calendar' && <Calendar />}
        {activeTab === 'info' && <Info />}
        {activeTab === 'contacts' && <Contacts />}
        {activeTab === 'sources' && <Sources />}
        {activeTab === 'contracts' && <Contracts />}
      </main>
    </div>
  );
}
