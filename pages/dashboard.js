import { useEffect, useState } from 'react';
import { fetchSAMData } from '../utils/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [quote, setQuote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [samResults, setSamResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const phrases = [
      'Win Today', 'One Contract at a Time', 'Step by Step, Fellas', 'Let the Work Speak',
      'Team FSG. Full Throttle.', 'Rain or Shine, We Move', 'Built in the Trenches',
      'Clock In With Purpose', 'Built for the Hard Days', 'Roza Built. Roza Backed.'
    ];
    setQuote(phrases[Math.floor(Math.random() * phrases.length)]);
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setFetchError(null);
    fetchSAMData(searchTerm.trim())
      .then((data) => {
        if (data?.opportunities?.length > 0) {
          setSamResults(data.opportunities);
        } else {
          setSamResults([]);
          setFetchError('No opportunities found or unexpected response structure.');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setFetchError('Failed to fetch data.');
        setSamResults([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
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

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h1>

        {activeTab === 'overview' && (
          <>
            <p className="mb-4 text-xl italic text-yellow-400">{quote}</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded">Total Clients</div>
              <div className="bg-gray-700 p-4 rounded">Open Tasks</div>
              <div className="bg-gray-700 p-4 rounded">Upcoming Deadlines</div>
            </div>
          </>
        )}

        {activeTab === 'proposals' && (
          <div className="bg-gray-700 p-6 rounded space-y-4">
            <h3 className="text-xl font-semibold">Proposal Template</h3>
            <p className="text-gray-300">[Placeholder for contract data input]</p>

            <div className="mt-4 space-y-2">
              <label htmlFor="search" className="block font-semibold">Search SAM.gov</label>
              <div className="flex space-x-2">
                <input
                  id="search"
                  type="text"
                  className="p-2 rounded text-black flex-1"
                  placeholder="Enter keyword (e.g., janitorial, construction)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>

            <h4 className="text-lg font-semibold mt-6">Recent Opportunities:</h4>

            <pre className="text-xs text-yellow-400 whitespace-pre-wrap bg-gray-800 p-2 rounded">
              {JSON.stringify(samResults, null, 2)}
            </pre>

            {isLoading && <p className="text-gray-400">Loading...</p>}
            {fetchError && <p className="text-red-400">{fetchError}</p>}

            {!isLoading && !fetchError && samResults.length > 0 && (
              <div className="space-y-2">
                {samResults.map((item, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded">
                    <p className="font-bold">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.naics}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
