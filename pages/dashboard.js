import React, { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import Contacts from "../components/Contacts";
import Glossary from "../components/Glossary";
import Info from"../components/Info";
import Sources from"../components/Sources";
  
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Load saved tab on first render
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save tab every time it changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <div>Welcome to ROZA! Select a tab to get started.</div>;
      case "calendar":
        return <Calendar />;
      case "contacts":
        return <Contacts />;
      case "sources":
        return <Sources />;
      case "proposals":
        return <div>📝 Proposal builder coming soon...</div>;
      case "contracts":
        return <div>📂 Contract folders and details coming soon...</div>;
      case "tasks":
        return (
          <div>✅ Task tracking with color-coded responsibility coming soon...</div>
        );
      case "assistant":
        return <div>🤖 AI Proposal Assistant launching soon...</div>;
      case "info":
        return <Info />;
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

      <nav className="flex flex-wrap gap-3 px-6 py-3 bg-gray-800 border-b border-gray-700">
        {[
          { key: "home", label: "Home" },
          { key: "calendar", label: "Calendar" },
          { key: "contacts", label: "Contacts" },
          { key: "proposals", label: "Proposals" },
          { key: "contracts", label: "Contracts" },
          { key: "sources", label: "Sources" },
          { key: "tasks", label: "Tasks" },
          { key: "assistant", label: "AI Assistant" },
          { key: "info", label: "Info" },
          { key: "bookmarks", label: "Bookmarks" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded ${
              activeTab === tab.key ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="p-6">{renderTabContent()}</main>
    </div>
  );
};

export default Dashboard;
