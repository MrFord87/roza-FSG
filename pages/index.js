export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">📊 Roza Dashboard</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Opportunities</h2>
          <p className="text-sm text-gray-300">Search and view recent contracts.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Saved</h2>
          <p className="text-sm text-gray-300">All your saved proposals in one place.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Team</h2>
          <p className="text-sm text-gray-300">Manage who can access your dashboard.</p>
        </div>
      </section>
    </main>
  );
}
