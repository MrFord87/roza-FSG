import { useEffect, useState } from 'react';
import { fetchSAMData } from '../utils/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [samResults, setSamResults] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [randomPhrase, setRandomPhrase] = useState('');

  const phrases = [
    "Roza is scanning the federal skies... ✨",
    "Seeking fresh opportunities from Uncle Sam... 🕵️‍♂️",
    "Running intel on new contracts... 📡",
    "Gathering government gold... 💰",
    "Roza's on the hunt for contracts... 🛰️"
  ];

  useEffect(() => {
    const random = phrases[Math.floor(Math.random() * phrases.length)];
    setRandomPhrase(random);
  }, []);

  const handleSearch = async () => {
    try {
      const url = `https://api.open.gsa.gov/opportunities/v1/search/?api_key=GAPIibFeKRJPKpjkhxUlCRU1fjkynbAQ2tfyMVEj&q=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log('API Response:', data);
      setSamResults(data.opportunities || []);
      setFetchError(null);
    } catch (error) {
      console.error('Error fetching SAM.gov data:', error);
      setFetchError('Failed to fetch data. Please try again.');
      setSamResults([]);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">Roza Dashboard</h1>

        <div className="space-x-4 mb-6">
          {['overview', 'calendar', 'tasks', 'contacts', 'proposals'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-white text-black' : 'bg-gray-700'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && <p className="text-green-400">✅ Overview is looking good!</p>}

        {activeTab === 'proposals' && (
          <>
            <h2 className="text-xl font-bold">Proposal Template</h2>
            <p className="mb-4">[Placeholder for contract data input]</p>

            <h3 className="text-lg font-semibold mb-2">Let's find your next opportunity!</h3>
            <p className="italic text-yellow-400 mb-4">{randomPhrase}</p>

            <div className="flex space-x-2 mb-6">
              <input
                type="text"
                placeholder="e.g., janitorial, security"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-black px-2 py-1 rounded"
              />
              <button onClick={handleSearch} className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-700">
                Search SAM.gov
              </button>
            </div>

            <h3 className="text-lg font-bold mb-2">Recent Opportunities:</h3>

            {fetchError && <p className="text-red-500">{fetchError}</p>}

            {samResults.length === 0 ? (
              <p className="text-red-400">🚫 No results found — try a different keyword or refine your search.</p>
            ) : (
              samResults.map((item, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded mb-2">
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-gray-400">{item.naics || 'No NAICS listed'}</p>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
