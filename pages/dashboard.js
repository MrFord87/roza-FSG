import { useEffect, useState } from 'react'; import { fetchSAMData } from '../utils/api';

export default function Dashboard() { const [activeTab, setActiveTab] = useState('overview'); const [searchTerm, setSearchTerm] = useState(''); const [samResults, setSamResults] = useState([]); const [fetchError, setFetchError] = useState(null); const [rawData, setRawData] = useState(null);

const handleSearch = async () => { if (!searchTerm.trim()) return; const data = await fetchSAMData(searchTerm); setRawData(data);

if (data && data.opportunities && data.opportunities.length > 0) {
  setSamResults(data.opportunities);
  setFetchError(null);
} else {
  setSamResults([]);
  setFetchError('No results found — try a different keyword or refine your search.');
}

};

return ( <div className="flex min-h-screen bg-gray-900 text-white"> <main className="flex-1 p-8"> <h1 className="text-3xl font-bold mb-6">Roza Dashboard</h1>

{/* Navigation Tabs */}
    <div className="space-x-2 mb-6">
      {['overview', 'calendar', 'tasks', 'contacts', 'proposals'].map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 rounded bg-white text-black font-semibold ${
            activeTab === tab ? 'bg-green-400' : 'bg-white'
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>

    {/* Tab Content */}
    {activeTab === 'overview' && (
      <div>
        <p className="text-green-400">✅ Overview is looking good!</p>
      </div>
    )}

    {activeTab === 'calendar' && (
      <div>
        <p className="text-blue-400">📅 Calendar coming soon...</p>
      </div>
    )}

    {activeTab === 'tasks' && (
      <div>
        <p className="text-yellow-400">📝 Tasks loading...</p>
      </div>
    )}

    {activeTab === 'contacts' && (
      <div>
        <div className="space-y-2">
          <div className="bg-gray-700 p-4 rounded">John Doe - Builder</div>
          <div className="bg-gray-700 p-4 rounded">Crystal - Realtor</div>
        </div>
      </div>
    )}

    {activeTab === 'proposals' && (
      <div className="bg-gray-700 p-6 rounded space-y-6">
        <h3 className="text-xl font-semibold">Proposal Template</h3>
        <p className="text-gray-300">[Placeholder for contract data input]</p>

        <h4 className="text-lg font-semibold">Let's find your next opportunity!</h4>
        <p className="text-sm text-gray-300">Roza is scanning the federal skies... ✨</p>

        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="e.g. janitorial, security, roofing"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-600 w-full"
          />
          <button
            onClick={handleSearch}
            className="px-4

