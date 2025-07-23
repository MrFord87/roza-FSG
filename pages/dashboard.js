"use client";

import { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Win today</h1>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded">Total Clients</div>
              <div className="bg-gray-700 p-4 rounded">Open Tasks</div>
              <div className="bg-gray-700 p-4 rounded">Upcoming Deadlines</div>
            </div>
          </div>
        );
      case "calendar":
        return (
          <div>
            <h2 className="text-xl font-bold mb-2">Calendar</h2>
            <p>Google Calendar integration coming soon.</p>
          </div>
        );
      case "tasks":
        return (
          <div>
            <h2 className="text-xl font-bold mb-2">Tasks</h2>
            <p>Task management interface.</p>
          </div>
        );
      case "contacts":
        return (
          <div>
            <h2 className="text-xl font-bold mb-2">Contacts</h2>
            <p>Client and lead contacts list.</p>
          </div>
        );
      case "proposals":
        return (
          <div>
            <h2 className="text-xl font-bold mb-2">Proposals</h2>
            <p>Proposal templates and tracking.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Roza Dashboard</h2>
        {["overview", "calendar", "tasks", "contacts", "proposals"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${
                activeTab === tab ? "bg-gray-700" : ""
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
}
