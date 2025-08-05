export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="bg-[#4b3621] p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-yellow-400">📊 Roza Dashboard</h1>
          <nav className="space-x-6">
            <a href="#" className="text-white hover:text-yellow-300 transition">Opportunities</a>
            <a href="#" className="text-white hover:text-yellow-300 transition">Saved</a>
            <a href="#" className="text-white hover:text-yellow-300 transition">Team</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-yellow-400">Welcome to Roza 🖤</h2>
          <p className="text-gray-300">Your Contract Execution & Intelligence Hub</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#3c2f2f] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">📄 Opportunities</h3>
            <p className="text-gray-300">Search and view recent contracts tailored to your interests.</p>
          </div>

          <div className="bg-[#3c2f2f] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">💾 Saved</h3>
            <p className="text-gray-300">Keep your favorite proposals organized in one place.</p>
          </div>

          <div className="bg-[#3c2f2f] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">👥 Team</h3>
            <p className="text-gray-300">Manage who has access and assign responsibilities.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
