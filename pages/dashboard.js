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
    setRawData(data); // keep for debugging

    if (data && data.opportunities && data.opportunities.length > 0) {
      setSamResults(data.opportunities);
      setFetchError(null);
    } else {
      setSamResults([]);
      setFetchError('🚫 No results found — try a different keyword or refine your search.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Roza Dashboard</h2>
        {['overview', 'calendar', 'tasks', 'contacts', 'proposals'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-left w-full p-2 rounded hover:bg-gray-700 ${
              activeTab === tab ? 'bg-gray-700' : ''
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === 'overview' && <div className="bg-gray-700 p-4 rounded">✅ Overview is looking good!</div>}
        {activeTab === 'calendar' && <div className="bg-gray-700 p-4 rounded">📅 Calendar loaded!</div>}
        {activeTab === 'tasks' && <div className="bg-gray-700 p-4 rounded">📝 Task center online!</div>}
        {activeTab === 'contacts' && (
          <div className="space-y-2">
            <div className="bg-gray-700 p-4 rounded">John Doe - Builder</div>
            <div className="bg-gray-700 p-4 rounded">Crystal - Realtor</div>
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="bg-gray-700 p-6 rounded space-y-4">
            <h3 className="text-xl font-semibold mb-4">Proposal Template</h3>
            <p className="text-gray-300">[Placeholder for contract data input]</p>

            <div className="mt-6">
              <h4 className="text-lg font-semibold">Let’s find your next opportunity!</h4>
              <p className="text-sm text-gray-400 mb-2">Roza is scanning the federal skies... ✨</p>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Try 'janitorial', 'construction', 'staffing'..."
                  className="p-2 bg-gray-800 border border-gray-600 rounded text-white w-64"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                >
                  Search SAM.gov
                </button>
              </div>

              {/* DEBUG RAW DATA */}
              <pre className="text-xs text-yellow-400 whitespace-pre-wrap bg-gray-800 p-2 rounded mt-4">
                {JSON.stringify(rawData, null, 2)}
              </pre>

              <div className="mt-4">
                <h4 className="text-lg font-semibold">Recent Opportunities:</h4>
                {fetchError && (
                  <p className="text-red-400 mt-2">{fetchError}</p>
                )}
                {samResults.length > 0 ? (
                  samResults.map((item, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded mb-2">
                      <p className="font-bold">{item.title}</p>
                      <p className="text-sm text-gray-400">{item.naics}</p>
                    </div>
                  ))
                ) : (
                  !fetchError && <p className="text-gray-400 mt-2">⏳ Results loading... stand by.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
