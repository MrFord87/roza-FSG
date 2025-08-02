import React, { useState, useEffect } from 'react'; import fetchSAMData from '../utils/api';

export default function Dashboard() { const [searchTerm, setSearchTerm] = useState(''); const [location, setLocation] = useState(''); const [naics, setNaics] = useState(''); const [results, setResults] = useState([]); const [randomPhrase, setRandomPhrase] = useState(''); const [requestUrl, setRequestUrl] = useState(''); const [samResults, setSamResults] = useState([]); const [fetchError, setFetchError] = useState(null); const [activeTab, setActiveTab] = useState('overview');

useEffect(() => { const phrases = [ 'Win Today', 'One Contract at a Time', 'Roza is Scanning the Federal Skies...', 'Let’s Find Your Next Opportunity', 'Success Starts with One Search' ]; const randomIndex = Math.floor(Math.random() * phrases.length); setRandomPhrase(phrases[randomIndex]); }, []);

const handleSearch = async () => { const fullUrl = https://api.sam.gov/opportunities/v2/search?api_key=GAPIibFeKRJPKpjkhxUlCRU1fjkynbAQ2tfyMVEj&q=${searchTerm}&placeOfPerformance.stateCode=${location}&naics=${naics}&sort=modifiedDate&limit=10; setRequestUrl(fullUrl);

const data = await fetchSAMData(searchTerm, location, naics);
if (data && data.results && data.results.length > 0) {
  setSamResults(data.results);
  setFetchError(null);
} else {
  setSamResults([]);
  setFetchError('No results found — try a different keyword or refine your search.');
}

};

return ( <div> {/* 🔍 DEBUG: Display the full request URL */} {requestUrl && ( <div className="text-sm text-green-400 my-4"> 🔍 <strong>Request URL:</strong> <br /> <code className="break-words">{requestUrl}</code> </div> )}

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
          <input
            type="text"
            placeholder="Keyword"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="State Code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="NAICS"
            value={naics}
            onChange={(e) => setNaics(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>

          {fetchError && <p className="text-red-500">{fetchError}</p>}
          <ul>
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
</div>

); }

