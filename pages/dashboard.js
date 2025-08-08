// pages/dashboard.js (or wherever your Dashboard lives)
import React, { useState } from "react";

// Adjust paths as needed:
import Calendar from "../components/Calendar";
import Contacts from "../components/Contacts";
import Info from "../components/Info";        // your Info hub (Glossary + KB)
import Sources from "../components/Sources";  // if you created it; otherwise remove

const Dashboard = () => {
  // Always start on Dashboard; no localStorage, no hash restore
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Welcome to ROZA</h2>
            <p className="opacity-80">Choose a tab to get started.</p>
          </div>
        );

      case "calendar":
        return <Calendar />;

      case "contacts":
        return <Contacts />;

      case "info":
        return <Info />; // shows Glossary + Knowledge Base

      case "sources":
        return <Sources />; // remove this case if you didn't add the component yet

      case "proposals":
        return <div>📝 Proposal builder coming soon...</div>;

      case "contracts":
        return <div>📂 Contract folders and details coming soon...</div>;

      case "tasks":
        return <div>✅ Task tracking coming soon...</div>;

      case "assistant":
        return <div>🤖 AI Proposal Assistant coming soon...</div>;

      case "bookmarks":
        return <div>🔖 Bookmarks coming soon...</div>;

      default:
        return <div>Unknown tab.</div>;
    }
  };

  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "calendar", label: "Calendar" },
    { key: "contacts", label: "Contacts" },
    { key: "info", label: "Info" },
    { key: "sources", label: "Sources" },   // remove if not using
    { key: "proposals", label: "Proposals" },
    { key: "contracts", label: "Contracts" },
    { key: "tasks", label: "Tasks" },
    { key: "assistant", label: "AI Assistant" },
    { key: "bookmarks", label: "Bookmarks" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 px-6 py-4 shadow">
        <h1 className="text-xl font-semibold">ROZA Dashboard</h1>
      </header>

      <nav className="flex flex-wrap gap-3 px-6 py-3 bg-gray-800 border-b border-gray-700">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded ${
              activeTab === t.key ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="p-6">{renderTabContent()}</main>
    </div>
  );
};

export default Dashboard;
