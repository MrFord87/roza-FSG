import { fetchSAMData } from '../utils/api';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [quote, setQuote] = useState('');

  useEffect(() => {//
    const phrases = [
      'Win Today',
      'One Contract at a Time',
      'FSG Solutions is the Solution',
      'Step by Step Fellas',
      'It Takes ALL of Us',
      'Billion Dollar Company',
      'Let’s Eat',
      'Trust the Process',
      'No Shortcuts, Just Work',
      'Focus Builds Fortunes',
      'We Build. We Scale. We Serve.',
      'Rise. Grind. Repeat.',
      'Built for This',
      'Keep Going',
      'Don’t Count the Days, Make Them Count',
      'Dream. Plan. Execute.',
      'Everything Counts',
      'Make It Happen',
      'Discipline Over Everything',
      'Don’t Waste a Rep',
      'Sweat Equity Pays Dividends',
      'Built by Grit',
      'Level Up Today',
      'Mind Right, Moves Tight',
      'Push Forward Always',
      'Earn Your Stripe',
      'Teamwork = Dreamwork',
      'No Excuses, Just Results',
      'All In Everyday',
      'Brick by Brick',
      'Execute Relentlessly',
      'The Goal is Growth',
      'Strive for Greatness',
      'Start Strong, Finish Stronger',
      'Let’s Go Get It'
    ];
    const randomIndex = Math.floor(Math.random() * phrases.length);
    setQuote(phrases[randomIndex]);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Roza Dashboard</h2>
        {['overview', 'calendar', 'tasks', 'contacts', 'proposals'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${
              activeTab === tab ? 'bg-gray-700 font-semibold' : ''
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {activeTab === 'overview' && (
          <>
            <h1 className="text-3xl font-bold mb-6">{quote}</h1>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded">Total Clients</div>
              <div className="bg-gray-700 p-4 rounded">Open Tasks</div>
              <div className="bg-gray-700 p-4 rounded">Upcoming Deadlines</div>
            </div>
          </>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-gray-700 p-4 rounded">
            {/* Google Calendar embed or logic to be added */}
            Calendar integration coming soon...
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-gray-700 p-4 rounded">
            <h2 className="text-xl font-bold mb-4">Tasks</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Follow up with HOA board</li>
              <li>Finalize pricing for mobile park proposal</li>
              <li>Schedule bin cleaning demo</li>
            </ul>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="bg-gray-700 p-4 rounded">
            <h2 className="text-xl font-bold mb-4">Contacts</h2>
            <ul className="space-y-2">
              <li>Crystal – Real Estate Agent</li>
              <li>Jose – Mobile Home Park Manager</li>
              <li>Ms. Thompson – HOA President</li>
            </ul>
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="bg-gray-700 p-4 rounded">
            <h2 className="text-xl font-bold mb-4">Proposal Template</h2>
            <p>Ready-to-fill proposal content and layout for new clients.</p>
          </div>
        )}
      </main>
    </div>
  );
}
