import { useState, useEffect } from 'react';
import { fetchSAMData } from '../utils/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [samResults, setSamResults] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [randomPhrase, setRandomPhrase] = useState('');

  useEffect(() => {
    const phrases = [
      'Win Today',
      'One Contract at a Time',
      'Roza is scanning the federal skies... ✨',
      'Securing your next opportunity!',
      'Let Roza work for you!'
    ];
    setRandomPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
  }, []);

  const handleSearch = async () => {
    const data = await fetchSAMData(searchTerm);
    if (data && data.results && data.results.length > 0) {
      setSamResults(data.results);
      setFetchError(null);
    } else {
      setSamResults([]);
      setFetchError('No results found — try a different keyword or refine your search.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold mb-6">Roza Dashboard</h1>
        <nav className="flex flex-col space-y-2">
          {['overview', 'calendar', 'tasks', 'contacts', 'proposals'].map((tab) => (
            <button
              key={tab}
              className={`text-left px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">
          {activeTab === 'overview' && 'Overview is looking good!'}
          {activeTab === 'calendar' && 'Your schedule is set!'}
          {activeTab === 'tasks' && 'You are getting things done!'}
          {activeTab === 'contacts' && 'Connections are strong!'}
          {activeTab === 'proposals' && 'Proposal Template'}
        </h1>

        {activeTab === 'proposals' && (
          <>
            <p className="mb-2">[Placeholder for contract data input]</p>
            <p className="mb-4 font-semibold">Let's find your next opportunity!</p>
            <p className="italic mb-4">{randomPhrase}</p>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                placeholder="Search keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded text-black"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
              >
                Search SAM.gov
              </button>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Recent Opportunities:</h2>
              {fetchError && (
                <p className="text-red-500">🚫 {fetchError}</p>
              )}
              <ul className="space-y-2">
                {samResults.map((op, index) => (
                  <li key={index} className="border p-4 rounded bg-gray-800">
                    <h3 className="text-lg font-semibold">{op.title || 'No title available'}</h3>
                    <p>{op.naics || 'NAICS not provided'}</p>
                    <p>{op.type || 'Type not provided'}</p>
                    <a
                      href={op.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      View Details
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

