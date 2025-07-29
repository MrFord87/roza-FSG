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
    setRawData(data); // For debugging display

    if (data && data.opportunities && data.opportunities.length > 0) {
      setSamResults(data.opportunities);
      setFetchError(null);
    } else {
      setSamResults([]);
      setFetchError('❌ No results found — try a different keyword or refine your search.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Roza Dashboard</h1>

        <div className="flex space-x-4 mb-6">
          {['overview', 'calendar', 'tasks', 'contacts', 'proposals'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${
                activeTab === tab ? 'bg-white text-black font-semibold' : 'bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="bg-green-700 p-4 rounded">
            <p className="text-white">✅ Overview is looking good!</p>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-blue-700 p-4 rounded">
            <p className="text-white">📅 Calendar is synced and active.</p>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-purple-700 p-4 rounded">
            <p className="text-white">📋 Tasks are up to date.</p>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-2">
            <div className="bg-gray-700 p-4 rounded">John Doe - Builder</div>
            <div className="bg-gray-700 p-4 rounded">Crystal - Realtor</div>
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="bg-gray-700 p-6 rounded space-y-4">
            <h3 className="text-xl font-semibold">Proposal Template</h3>
            <p className="text-gray-300">[Placeholder for contract data input]</p>

            <div className="mb-4">
              <h3 className="text-lg font-bold">Let’s find your next opportunity!</h3>
              <p>Roza is scanning the federal skies... ✨</p>
              <div className="flex space-x-2 mt-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search SAM.gov"
                  className="px-2 py-1 text-black rounded"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Search SAM.gov
                </button>
              </div>
            </div>

            <h4 className="text-lg font-semibold">Recent Opportunities:</h4>

            {/* DEBUG RAW JSON */}
            <pre className="text-xs text-yellow-400 whitespace-pre-wrap bg-gray-800 p-2 rounded">
              {rawData === null ? 'null' : JSON.stringify(rawData, null, 2)}
            </pre>

            {fetchError && <p className="text-red-400">{fetchError}</p>}

            {samResults.length > 0 ? (
              samResults.map((item, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded mb-2">
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-gray-400">{item.naics}</p>
                </div>
              ))
            ) : (
              !fetchError && <p className="text-gray-400">No data yet or still loading...</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
