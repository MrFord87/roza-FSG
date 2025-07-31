import { useEffect, useState } from 'react'; import axios from 'axios';

export default function Dashboard() { const [activeTab, setActiveTab] = useState('overview'); const [samResults, setSamResults] = useState([]); const [fetchError, setFetchError] = useState(null); const [searchTerm, setSearchTerm] = useState(''); const [quote, setQuote] = useState('');

const phrases = [ 'Win Today', 'One Contract at a Time', 'FSG Solutions is the Solution', 'Step by Step, Fellas', 'It Takes ALL of Us', 'Billion Dollar Company', 'Keep Digging', 'Let’s Eat', 'Own the Morning', 'Nobody’s Coming — It’s On Us', 'Let the Work Speak', 'Build What They Said You Couldn’t', 'Rain or Shine, We Move', 'Dream Bigger, Execute Sharper', 'All Gas, No Brakes', 'Be the Standard', 'Earned, Not Given', 'Clock In With Purpose', 'One More Rep', 'Built for the Hard Days', 'Brick by Brick', 'Clean Bins, Clean Wins', 'Talk Less, Clean More', 'Focus. Grind. Grow.', 'Built in the Trenches', 'Respect the Process', 'Leadership Looks Like This', 'Championship Habits Only', 'Team FSG. Full Throttle.', 'We Don’t Fold', 'Roza Built. Roza Backed.', 'Handle Business, Humbly', 'We’re Not Done Yet', 'Purpose Over Pressure', 'Fighter Jets Only' ];

useEffect(() => { const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)]; setQuote(randomPhrase); }, []);

const handleSearch = async () => { try { const url = https://api.openopps.gsa.gov/api/public/opportunities/search; // endpoint const response = await axios.get(url, { params: { q: searchTerm, api_key: 'GAPIibFeKRJPKpjkhxUlCRU1fjkynbAQ2tfyMVEj', size: 10, }, }); if (response.data && response.data.opportunities) { setSamResults(response.data.opportunities); setFetchError(null); } else { setSamResults([]); setFetchError('No opportunities found.'); } } catch (error) { console.error('API Error:', error); setSamResults([]); setFetchError('Failed to fetch data.'); } };

return ( <div className="flex min-h-screen bg-gray-900 text-white"> <aside className="w-64 bg-gray-800 p-6 space-y-4"> <h2 className="text-2xl font-bold mb-4">Roza Dashboard</h2> {['overview', 'calendar', 'tasks', 'contacts', 'proposals'].map((tab) => ( <button key={tab} onClick={() => setActiveTab(tab)} className={text-left w-full p-2 rounded hover:bg-gray-700 ${ activeTab === tab ? 'bg-gray-700' : '' }} > {tab.charAt(0).toUpperCase() + tab.slice(1)} </button> ))} </aside>

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

    {activeTab === 'calendar' && (
      <div className="bg-gray-700 p-8 rounded text-center">[ Calendar Component Placeholder ]</div>
    )}

    {activeTab === 'tasks' && (
      <div className="space-y-2">
        <div className="bg-gray-700 p-4 rounded">Task 1</div>
        <div className="bg-gray-700 p-4 rounded">Task 2</div>
        <div className="bg-gray-700 p-4 rounded">Task 3</div>
      </div>
    )}

    {activeTab === 'contacts' && (
      <div className="space-y-2">
        <div className="bg-gray-700 p-4 rounded">John Doe - Builder</div>
        <div className="bg-gray-700 p-4 rounded">Crystal - Realtor</div>
      </div>
    )}

    {activeTab === 'proposals' && (
      <div className="bg-gray-700 p-6 rounded space-y-4">
        <h3 className="text-xl font-semibold mb-4">Proposal Template</h3>
        <input
          type="text"
          placeholder="Enter search term..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded w-full text-black"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          Search
        </button>

        {fetchError && <p className="text-red-400">{fetchError}</p>}

        <div>
          <h4 className="text-lg font-semibold mb-2">Recent Opportunities:</h4>
          {samResults.length > 0 ? (
            samResults.map((item, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded mb-2">
                <p className="font-bold">{item.title || 'Untitled'}</p>
                <p className="text-sm text-gray-400">{item.naics_code || 'No NAICS'}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No results yet...</p>
          )}
        </div>
      </div>
    )}
  </main>
</div>

); }

