// pages/dashboard.js

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <aside className="w-64 h-screen fixed bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Roza</h2>
        <nav className="space-y-4">
          <a href="#" className="block text-lg hover:text-blue-600">Dashboard</a>
          <a href="#" className="block text-lg hover:text-blue-600">Opportunities</a>
          <a href="#" className="block text-lg hover:text-blue-600">Saved</a>
          <a href="#" className="block text-lg hover:text-blue-600">Team</a>
        </nav>
      </aside>

      <main className="ml-64 p-10">
        <h1 className="text-3xl font-bold mb-4">Hello, Antoine 👋🏾</h1>
        <p className="text-lg mb-6">
          Welcome to <span className="font-semibold text-blue-600">Roza</span>, your Contract Intelligence Dashboard
        </p>
        
        <div className="bg-white rounded-lg shadow p-6 max-w-md">
          <h2 className="text-xl font-semibold mb-4">Login</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
