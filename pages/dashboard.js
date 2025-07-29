import { useEffect, useState } from 'react';
import { fetchSAMData } from '../utils/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [samResults, setSamResults] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [rawData, setRawData] = useState(null);

  const handleSearch = async () => {
    const data = await fetchSAMData(searchTerm);
    setRawData(data);

    if (data && data.opportunities && data.opportunities.length > 0) {
      setSamResults(data.opportunities);
      setFetchError(null);
    } else {
      setSamResults([]);
      setFetchError('No results found — try a different keyword or refine your search.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Roza Dashboard</h1>

        <div className="flex space-x-2 mb-6">
          {['overview', 'calendar', 'tasks', 'contacts', 'proposals'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${
                activeTab === tab ? 'bg-white text-black' : 'bg-gray-800 text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="text-green-400">✅ Overview is looking good!</div>
        )}

        {activeTab === 'calendar' && (
          <div className="text-blue-400">📅 You’ve got events coming up.</div>
        )}

        {activeTab === 'tasks' && (
          <div className="text-yellow-400">📝 Don’t forget to wrap up pending tasks.</div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-2">
            <div className="bg-gray-700 p-4 rounded">John Doe - Builder</div>
            <div className="bg-gray-700 p-4 rounded">Crystal - Realtor</div>
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="bg-gray-700 p-6 rounded space-y-4">
            <h3 className="text-xl font-semibold mb-2">Proposal Template</h3>
            <p className="text-gray-300">[Placeholder for contract data input]</p>

            <h4 className="text-lg font-semibold mt-4">Let’s find your next opportunity!</h4>
            <p>Roza is scanning the federal skies...✨</p>

            <div className="flex space-x-2 mt-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. janitorial, security"
                className="px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
              >
                Search SAM.gov
              </button>
            </div>

            <pre className="text-xs text-yellow-400 whitespace-pre-wrap bg-gray-800 p-2 rounded">
              {JSON.stringify(rawData, null, 2)}
            </pre>

            <h4 className="text-lg font-semibold">Recent Opportunities:</h4>
            {fetchError ? (
              <p className="text-red-400 text-sm">🚫 {fetchError}</p>
            ) : (
              samResults.map((item, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded mb-2">
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-gray-400">{item.naics}</p>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
