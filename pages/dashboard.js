'use client';

import React from 'react';

export default function Dashboard() {
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

  return (
    <div className="p-4 space-y-6">
      <div className="text-2xl font-bold text-center text-lime-400">{randomPhrase}</div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-700 p-4 rounded">Total Clients</div>
        <div className="bg-gray-700 p-4 rounded">Open Tasks</div>
        <div className="bg-gray-700 p-4 rounded">Upcoming Deadlines</div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-700 p-4 rounded">Task 1</div>
        <div className="bg-gray-700 p-4 rounded">Task 2</div>
        <div className="bg-gray-700 p-4 rounded">Task 3</div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-700 p-4 rounded">Settings Panel</div>
      </div>
    </div>
  );
}
