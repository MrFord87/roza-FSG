import { useEffect, useState } from 'react'; 
import { fetchSAMData } from '../utils/api';

export default function Dashboard() { 
  const [activeTab, setActiveTab] = useState('overview'); const [samResults, setSamResults] = useState([]); const [fetchError, setFetchError] = useState(null); const [filters, setFilters] = useState({ keyword: '', naics: '', state: '', postedFrom: '', postedTo: '' });

const handleSearch = async () => { const data = await fetchSAMData(filters); if (data && data.results && data.results.length > 0) { setSamResults(data.results); setFetchError(null); } else { setSamResults([]); setFetchError('No opportunities found or unexpected response structure.'); } };

return ( <div className="flex min-h-screen bg-gray-900 text-white"> <aside className="w-64 bg-gray-800 p-6 space-y-4"> <h2 className="text-2xl font-bold mb-4">Roza Dashboard</h2> {['overview', 'calendar', 'tasks', 'contacts', 'proposals'].map((tab) => ( <button key={tab} onClick={() => setActiveTab(tab)} className={text-left w-full p-2 rounded hover:bg-gray-700 ${ activeTab === tab ? 'bg-gray-700' : '' }} > {tab.charAt(0).toUpperCase() + tab.slice(1)} </button> ))} </aside>

<main className="flex-1 p-8">
    <h1 className="text-3xl font-semibold mb-6">
      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
    </h1>

    {activeTab === 'proposals' && (
      <div className="bg-gray-700 p-6 rounded space-y-4">
        <h3 className="text-xl font-semibold mb-4">Search for Federal Contracts</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Keyword"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="text"
            placeholder="NAICS Code"
            value={filters.naics}
            onChange={(e) => setFilters({ ...filters, naics: e.target.value })}
            className="p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="text"
            placeholder="State (e.g., TX)"
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            className="p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="date"
            placeholder="Posted From"
            value={filters.postedFrom}
            onChange={(e) => setFilters({ ...filters, postedFrom: e.target.value })}
            className="p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="date"
            placeholder="Posted To"
            value={filters.postedTo}
            onChange={(e) => setFilters({ ...filters, postedTo: e.target.value })}
            className="p-2 rounded bg-gray-800 text-white"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Search
          </button>
        </div>

        {fetchError && <p className="text-red-400">{fetchError}</p>}

        {samResults.length > 0 ? (
          samResults.map((item, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded mb-2">
              <p className="font-bold">{item.title || 'Untitled Opportunity'}</p>
              <p className="text-sm text-gray-400">NAICS: {item.naics || 'N/A'} | State: {item.state || 'N/A'}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No results yet.</p>
        )}
      </div>
    )}
  </main>
</div>

); }

