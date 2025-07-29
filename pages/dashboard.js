import { useEffect, useState } from 'react'; import { fetchSAMData } from '../utils/api';

export default function Dashboard() { const [activeTab, setActiveTab] = useState('overview'); const [samResults, setSamResults] = useState([]); const [fetchError, setFetchError] = useState(null); const [searchTerm, setSearchTerm] = useState('');

const handleSearch = async () => { const data = await fetchSAMData(searchTerm); console.log('API RAW JSON:', data); if (data && data.opportunities && data.opportunities.length > 0) { setSamResults(data.opportunities); setFetchError(null); } else { setSamResults([]); setFetchError('No opportunities found or unexpected response structure.'); } };

return ( <div className="flex min-h-screen bg-gray-900 text-white"> {/* Sidebar */} <aside className="w-64 bg-gray-800 p-6 space-y-4"> <h2 className="text-2xl font-bold mb-4">Roza Dashboard</h2> {['overview', 'calendar', 'tasks', 'contacts', 'proposals'].map((tab) => ( <button key={tab} onClick={() => setActiveTab(tab)} className={text-left w-full p-2 rounded hover:bg-gray-700 ${activeTab === tab ? 'bg-gray-700' : ''}} > {tab.charAt(0).toUpperCase() + tab.slice(1)} </button> ))} </aside>

{/* Main Content */}
  <main className="flex-1 p-8">
    {activeTab === 'overview' && <div className="bg-gray-700 p-4 rounded">Overview Content</div>}
    {activeTab === 'calendar' && <div className="bg-gray-700 p-4 rounded">Calendar Content</div>}
    {activeTab === 'tasks' && <div className="bg-gray-700 p-4 rounded">Task Content</div>}
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

        <h4 className="text-lg font-semibold mt-6">Search Opportunities:</h4>
        <div className="flex space-x-2">
          <input
            type="text"
            className="p-2 text-black rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter keyword (e.g., janitorial, construction)"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Search
          </button>
        </div>

        <h4

