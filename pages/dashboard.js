import { useEffect, useState } from 'react';
import { fetchSAMData } from '../utils/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [samResults, setSamResults] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [naics, setNaics] = useState('');
  const [results, setResults] = useState([]);
  
  const [requestUrl, setRequestUrl] = useState(''); // 👈🏾 ADD THIS HE

  const [randomPhrase, setRandomPhrase] = useState('');

  useEffect(() => {
    const phrases = [
      'Win Today',
      'One Contract at a Time',
      'Roza is Scanning the Federal Skies...',
      'Let’s Find Your Next Opportunity',
      'Success Starts with One Search'
    ];
    const randomIndex = Math.floor(Math.random() * phrases.length);
    setRandomPhrase(phrases[randomIndex]);
  }, []);

  const handleSearch = async () => {
 const fullUrl =`https://api.sam.gov/opportunities/v2/search?api_key=GAPIibFeKRJPKpjkhxUlCRU1fjkynbAQ2tfyMVEj&q=${searchTerm}&placeOfPerformance.stateCode=${location}&naics=${naics}&sort=modifiedDate&limit=10`;
    setRequestUrl(fullUrl);
    const data = await fetchSAMData(searchTerm, location, naics);
    if (data && data.results && data.results.length > 0) {
      setSamResults(data.results);
      setFetchError(null);
    } else {
      setSamResults([]);
      setFetchError('No results found — try a different keyword or refine your search.');
    }
  };

  return (
    <div>
    {/* 🔍 DEBUG: Display the full request URL */}
{requestUrl && (
  <div className="text-sm text-green-400 my-4">
    🔍 <strong>Request URL:</strong> <br />
    <code className="break-words">{requestUrl}</code>
  </div>
)}
    <div className="flex min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">Roza Dashboard</h1>

        <div className="mb-4 space-x-4">
          <button onClick={() => setActiveTab('overview')}>Overview</button>
          <button onClick={() => setActiveTab('calendar')}>Calendar</button>
          <button onClick={() => setActiveTab('tasks')}>Tasks</button>
          <button onClick={() => setActiveTab('contacts')}>Contacts</button>
          <button onClick={() => setActiveTab('proposals')}>Proposals</button>
        </div>

        {activeTab === 'overview' && (
          <div>
            <p className="text-green-400 font-medium">✅ Overview is looking good!</p>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div>
            <p>📅 Calendar events loading soon.</p>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div>
            <p>📋 Tasks synced with project tracker.</p>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <p>📇 Contacts integration coming soon.</p>
          </div>
        )}

        {activeTab === 'proposals' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Proposal Template</h2>
            <p className="mb-4">[Placeholder for contract data input]</p>

            <h3 className="text-lg font-semibold mb-2">{randomPhrase}</h3>

            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                placeholder="Keyword (e.g. janitorial)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 text-black"
              />
              <input
                type="text"
                placeholder="Location (e.g. TX)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="p-2 text-black"
              />
              <input
                type="text"
                placeholder="NAICS Code"
                value={naics}
                onChange={(e) => setNaics(e.target.value)}
                className="p-2 text-black"
              />
              <button
                onClick={handleSearch}
                className="px-4 bg-blue-600 text-white rounded"
              >
                Search SAM.gov
              </button>
            </div>

            {fetchError && (
              <p className="text-red-500">🚫 {fetchError}</p>
            )}

            <h4 className="mt-6 text-lg font-semibold">Recent Opportunities:</h4>
            <ul className="list-disc ml-6 mt-2">
              {samResults.map((opportunity, index) => (
                <li key={index}>
                  <strong>{opportunity.title || 'Untitled Opportunity'}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
