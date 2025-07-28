import { useEffect, useState } from 'react';
import { fetchSAMData } from '../utils/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [quote, setQuote] = useState('');
  const [samResults, setSamResults] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const phrases = [
      'Win Today',
      'One Contract at a Time',
      'FSG Solutions is the Solution',
      'Step by Step, Fellas',
      'It Takes ALL of Us',
      'Billion Dollar Company',
      'Keep Digging',
      'Let’s Eat',
      'Own the Morning',
      'Nobody’s Coming — It’s On Us',
      'Let the Work Speak',
      'Build What They Said You Couldn’t',
      'Rain or Shine, We Move',
      'Dream Bigger, Execute Sharper',
      'All Gas, No Brakes',
      'Be the Standard',
      'Earned, Not Given',
      'Clock In With Purpose',
      'One More Rep',
      'Built for the Hard Days',
      'Brick by Brick',
      'Clean Bins, Clean Wins',
      'Talk Less, Clean More',
      'Focus. Grind. Grow.',
      'Built in the Trenches',
      'Respect the Process',
      'Leadership Looks Like This',
      'Championship Habits Only',
      'Team FSG. Full Throttle.',
      'We Don’t Fold',
      'Roza Built. Roza Backed.',
      'Handle Business, Humbly',
      'We’re Not Done Yet',
      'Purpose Over Pressure',
      'Fighter Jets Only'
    ];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setQuote(randomPhrase);
  }, []);

  useEffect(() => {
    if (activeTab === 'proposals') {
      fetchSAMData('janitorial')
        .then((data) => {
          console.log('SAM.gov response:', data); // Debug log

          if (data && data.opportunitiesData && data.opportunitiesData.length > 0) {
            setSamResults(data.opportunitiesData);
            setFetchError(null);
          } else {
            setSamResults([]);
            setFetchError('No opportunities found or unexpected response structure.');
          }
        })
        .catch((err) => {
          console.error('Fetch error:', err);
          setFetchError('Failed to fetch data.');
        });
    }
  }, [activeTab]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Roza Dashboard</h2>
        {['overview', 'calendar', 'tasks', 'contacts', 'proposals'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-left w-full p-2 rounded hover:bg-gray-700 ${
              activeTab === tab ? 'bg-gray-700' : ''
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </aside>

      {/* Main Content */}
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
    <p className="text-gray-300">[Placeholder for contract data input]</p>

    <h4 className="text-lg font-semibold mt-6">Recent Opportunities:</h4>

    {/* DEBUG DATA BLOCK */}
    <pre className="text-xs text-yellow-400 whitespace-pre-wrap bg-gray-800 p-2 rounded">
      {JSON.stringify(samResults, null, 2)}
    </pre>

    {samResults.length > 0 ? (
      samResults.map((item, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded mb-2">
          <p className="font-bold">{item.title}</p>
          <p className="text-sm text-gray-400">{item.naics}</p>
        </div>
      ))
    ) : (
      <p className="text-gray-400">No data yet or still loading...</p>
    )}
  </div>
)}
      </main>
    </div>
  );
}
