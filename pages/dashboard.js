'use client'

import { useState, useEffect } from 'react'
import Calendar from '@/components/Calendar'
import Tasks from '@/components/Tasks'
import Contacts from '@/components/Contacts'
import Proposals from '@/components/Proposals'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [dailyPhrase, setDailyPhrase] = useState('')

  // List of 35 motivational phrases
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
    'Fighter Jets Only',
  ]

  // Set daily phrase based on day of year
  useEffect(() => {
    const today = new Date()
    const start = new Date(today.getFullYear(), 0, 0)
    const diff = today - start
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    const index = dayOfYear % phrases.length
    setDailyPhrase(phrases[index])
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Roza Dashboard</h2>
        {['overview', 'calendar', 'tasks', 'contacts', 'proposals'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === tab ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-3xl font-bold capitalize">{activeTab}</h1>

        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded text-xl font-semibold text-center">
              {dailyPhrase}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded">Total Clients</div>
              <div className="bg-gray-700 p-4 rounded">Open Tasks</div>
              <div className="bg-gray-700 p-4 rounded">Upcoming Deadlines</div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && <Calendar />}
        {activeTab === 'tasks' && <Tasks />}
        {activeTab === 'contacts' && <Contacts />}
        {activeTab === 'proposals' && <Proposals />}
      </main>
    </div>
  )
}
