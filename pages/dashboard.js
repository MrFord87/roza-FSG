import React, { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <div>Welcome to ROZA! Select a tab to get started.</div>;
      case "calendar":
        return <div>📅 Calendar coming soon...</div>;
      case "contacts":
        return <div>📇 Contacts management coming soon...</div>;
      case "proposals":
        return <div>📝 Proposal builder coming soon...</div>;
      case "contracts":
        return <div>📁 Contract folders and details coming soon...</div>;
      case "tasks":
        return <div>✅ Task tracking with color-coded responsibility coming soon...</div>;
      case "assistant":
        return <div>🤖 AI Proposal Assistant launching soon...</div>;
      case "info":
        return <div>📚 Contracting terms and definitions coming soon...</div>;
      case "bookmarks":
        return <div>🔖 Bookmark and quick links coming soon...</div>;
      default:
        return <div>Welcome to ROZA! Select a tab to get started.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 text-white px-6 py-4 shadow">
        <h1 className="text-xl font-semibold">ROZA Dashboard</h1>
      </header>

      <nav className="flex flex-wrap gap-3 px-6 py-3 bg-gray-800 border-b border-gray-700 text-sm">
        {[
          { label: "Home", key: "home" },
          { label: "Calendar", key: "calendar" },
          { label: "Contacts", key: "contacts" },
          { label: "Proposals", key: "proposals" },
          { label: "Contracts", key: "contracts" },
          { label: "Tasks", key: "tasks" },
          { label: "AI Assistant", key: "assistant" },
          { label: "Info", key: "info" },
          { label: "Bookmarks", key: "bookmarks" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-yellow-700 text-white"
                : "bg-gray-700 hover:bg-yellow-800"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="p-6">{renderTabContent()}</main>
    </div>
  );
}
