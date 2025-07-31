import { useEffect, useState } from 'react'; import { fetchSAMData } from '../utils/api';

export default function Dashboard() { const [activeTab, setActiveTab] = useState('overview'); const [samResults, setSamResults] = useState([]); const [fetchError, setFetchError] = useState(null); const [searchTerm, setSearchTerm] = useState(''); const [randomPhrase, setRandomPhrase] = useState('');

useEffect(() => { const phrases = [ 'Win Today', 'One Contract at a Time', 'Roza is Scanning the Federal Skies... ✨', 'Opportunities Await — Let’s Find Them' ]; const random = phrases[Math.floor(Math.random() * phrases.length)]; setRandomPhrase(random); }, []);

const handleSearch = async () => { const data = await fetchSAMData(searchTerm); if (data && data.results && data.results.length > 0) { setSamResults(data.results); setFetchError(null); } else { setSamResults([]); setFetchError('No results found — try a different keyword or refine your search.'); } };

return ( <div className="flex min-h-screen bg-gray-900 text-white"> <main className="flex-1 p-8"> <h1 className="text-3xl font-semibold mb-6">Roza Dashboard</h1> <div className="space-x-4 mb-6"> <button onClick={() => setActiveTab('overview')}>Overview</button> <button onClick={() => setActiveTab('calendar')}>Calendar</button> <button onClick={() => setActiveTab('tasks')}>Tasks</button> <button onClick={() => setActiveTab('contacts')}>Contacts</button> <button onClick={() => setActiveTab('proposals')}>Proposals</button> </div>

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
        <p>✅ Tasks synced with project tracker.</p>
      </div>
    )}

    {activeTab === 'contacts' && (
      <div>
        <p>📇 Contacts integration coming soon.</p>
      </div>
    )}

    {activeTab === 'proposals' && (
      <div>
        <h2 className="text-xl font-semibold mt-4 mb-2">Proposal Template</h2>
        <p className="text-gray-300 mb-4">[Placeholder for contract data input]</p>
        <p className="text-lg mb-2 font-medium">Let’s find your next opportunity!</p>
        <p className="italic text-sm text-yellow-300 mb-4">{randomPhrase}</p>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g. construction, security, IT..."
          className="text-black px-2 py-1 rounded mr-2"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Search SAM.gov
        </button>

        <h3 className="text-lg mt-6 mb-2 font-semibold">Recent Opportunities:</h3>
        {fetchError ? (
          <p className="text-red-400">🚫 {fetchError}</p>
        ) : (
          <ul className="list-disc ml-6">
            {samResults.map((opp, index) => (
              <li key={index} className="mb-2">
                <span className="font-semibold">{opp.title || opp.noticeId}</span>
                <div className="text-sm text-gray-400">
                  {opp.agency?.name} | {opp.naics?.code} | {opp.type}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    )}
  </main>
</div>

); }

