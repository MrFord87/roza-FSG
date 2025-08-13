// pages/dashboard.js
import React, { useEffect, useMemo, useState } from 'react';
import MyCalendar from '../components/Calendar';
import Contacts from '../components/Contacts';
import Info from '../components/Info';
import Sources from '../components/Sources';
import RozaAssistant from '../components/RozaAssistant';
import Contracts from '../components/Contracts';

const CAL_STORAGE_KEY = 'roza_calendar_events_v1'; // <-- if your calendar uses a different key, change this

// -------- Mini Week Calendar (read-only, pulls from localStorage)
function startOfWeek(d) {
  const date = new Date(d);
  const day = date.getDay(); // 0=Sun
  const diff = date.getDate() - day + 0; // start Sunday; change +1 for Monday
  const start = new Date(date.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
}
function formatDay(d) {
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}
function MiniWeek() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CAL_STORAGE_KEY);
      if (raw) setEvents(JSON.parse(raw));
    } catch {}
  }, []);

  const days = useMemo(() => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, []);

  // Normalize events (MyCalendar likely stores {title, start, end, completed?})
  const normalized = useMemo(() => {
    return (events || []).map(e => ({
      ...e,
      start: new Date(e.start),
      end: e.end ? new Date(e.end) : new Date(e.start),
    }));
  }, [events]);

  const byDay = useMemo(() => {
    return days.map(day => {
      const list = normalized.filter(ev => isSameDay(ev.start, day));
      // Sort by time ascending
      list.sort((a, b) => (a.start?.getTime?.() || 0) - (b.start?.getTime?.() || 0));
      return list;
    });
  }, [days, normalized]);

  return (
    <div className="border rounded-lg p-3 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">This Week</div>
        <div className="text-xs text-gray-500">
          {formatDay(days[0])} – {formatDay(days[6])}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => (
          <div key={day.toISOString()} className="border rounded p-2">
            <div className="text-xs font-semibold mb-1">
              {formatDay(day)}
            </div>
            <div className="space-y-1">
              {byDay[idx].length === 0 ? (
                <div className="text-[11px] text-gray-500 italic">No items</div>
              ) : (
                byDay[idx].slice(0, 3).map((ev, i) => (
                  <div
                    key={i}
                    className={`text-[11px] px-2 py-1 rounded border ${
                      ev.completed ? 'bg-green-50 border-green-200 text-green-700 line-through' : 'bg-gray-50 border-gray-200'
                    }`}
                    title={ev.title}
                  >
                    {ev.start instanceof Date && !isNaN(ev.start)
                      ? ev.start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + ' · '
                      : ''}
                    {ev.title}
                  </div>
                ))
              )}
              {byDay[idx].length > 3 && (
                <div className="text-[11px] text-blue-600">+ {byDay[idx].length - 3} more</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        (Mini view is read-only. Add or edit items in the Calendar tab.)
      </div>
    </div>
  );
}

// -------- Big grid quick links
function QuickBlocks() {
  // Adjust these targets to match your app
  const items = [
    {
      title: 'Capability Statement',
      desc: 'Open your latest one-pager',
      href: '/capability-statement.pdf', // put the PDF in /public/
      external: false,
      bg: 'bg-indigo-600',
    },
    {
      title: 'Proposal Template',
      desc: 'Start a new proposal draft',
      href: '/proposal-template', // create this page/route later
      external: false,
      bg: 'bg-emerald-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((it) => (
        <a
          key={it.title}
          href={it.href}
          target={it.external ? '_blank' : undefined}
          rel={it.external ? 'noopener noreferrer' : undefined}
          className={`${it.bg} rounded-xl p-5 text-white hover:opacity-95 transition block`}
        >
          <div className="text-lg font-semibold">{it.title}</div>
          <div className="text-sm opacity-90">{it.desc}</div>
        </a>
      ))}
    </div>
  );
}

export default function Dashboard() {
  // Persist active tab across refreshes
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-4 space-y-4">
            {/* Row 1: Quick blocks */}
            <QuickBlocks />

            {/* Row 2: Mini week calendar */}
            <MiniWeek />
          </div>
        );
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
      case 'roza':
        return (
          <div className="p-4">
            <RozaAssistant />
          </div>
        );
      default:
        return <div className="p-4">Select a tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-2xl font-bold p-4">ROZA Dashboard</h1>

      {/* Tabs */}
      <div className="px-4 pb-4 flex flex-wrap gap-2">
        <TabButton id="dashboard" label="Dashboard" />
        <TabButton id="calendar"  label="Calendar" />
        <TabButton id="contacts"  label="Contacts" />
        <TabButton id="info"      label="Info" />
        <TabButton id="sources"   label="Sources" />
        <TabButton id="contracts" label="Contracts" />
        <TabButton id="roza"      label="ROZA" />
      </div>

      {/* Content */}
      <div className="px-4 pb-8">{renderTabContent()}</div>
    </div>
  );
}
