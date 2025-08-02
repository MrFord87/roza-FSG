import { useState } from 'react';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [naics, setNaics] = useState('');
  const [samResults, setSamResults] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [requestUrl, setRequestUrl] = useState('');
  const [activeTab, setActiveTab] = useState('proposals');

  const handleSearch = async () => {
    const fullUrl = `https://api.sam.gov/opportunities/v2/search?api_key=GAPIibFeKRJPKpjkhxUlCRU1fjkynbAQ2tfyMVEj&q=${searchTerm}&placeOfPerformance.stateCode=${location}&naics=${naics}&sort=modifiedDate&limit=10`;

    setRequestUrl(fullUrl);

    try {
      const response = await fetch(fullUrl);
      const data = await response.json();

      if (data && data.results && data.results.length > 0) {
        setSamResults(data.results);
        setFetchError(null);
      } else {
        setSamResults([]);
        setFetchError('No results found — try a different keyword or refine your search.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setFetchError('Error fetching data from SAM.gov');
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

          {activeTab === 'proposals' && (
            <div>
              <div className="mb-4 space-x-2">
                <input
                  type="text"
                  placeholder="Keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="State (e.g., TX)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="NAICS Code"
                  value={naics}
                  onChange={(e) => setNaics(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
              </div>

              {fetchError && (
                <div className="text-red-400 mt-4">
                  ⚠️ {fetchError}
                </div>
              )}

              {samResults.length > 0 && (
                <ul className="space-y-4">
                  {samResults.map((opportunity, index) => (
                    <li key={index}>
                      <strong>{opportunity.title || 'Untitled Opportunity'}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
