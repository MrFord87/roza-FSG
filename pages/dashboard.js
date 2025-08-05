export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-brown-900 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-yellow-500">Roza Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="text-white bg-brown-700 hover:bg-brown-800 rounded px-4 py-2">Opportunities</button>
            <button className="text-white bg-brown-700 hover:bg-brown-800 rounded px-4 py-2">Saved</button>
            <button className="text-white bg-brown-700 hover:bg-brown-800 rounded px-4 py-2">Team</button>
          </div>
        </div>
      </header>
      
      <main className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-yellow-500">Welcome to Roza</h2>
          <p className="text-lg">Your Contract Intelligence Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-brown-800 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Opportunities</h3>
            <p>Search and view recent contracts.</p>
          </div>
          <div className="bg-brown-800 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Saved</h3>
            <p>All your saved proposals in one place.</p>
          </div>
          <div className="bg-brown-800 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Team</h3>
            <p>Manage who can access your dashboard.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
