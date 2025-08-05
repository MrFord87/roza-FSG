export default function Dashboard() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans">
      <header className="border-b border-neutral-700 px-8 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          <span role="img" aria-label="dashboard">📊</span> Roza Dashboard
        </h1>
        <nav className="space-x-6 text-sm font-medium text-neutral-300">
          <a href="#opportunities" className="hover:text-white">Opportunities</a>
          <a href="#saved" className="hover:text-white">Saved</a>
          <a href="#team" className="hover:text-white">Team</a>
        </nav>
      </header>

      <main className="px-8 py-12">
        <h2 className="text-2xl font-semibold mb-4">Welcome to Roza 🖤</h2>
        <p className="text-neutral-400 mb-12 text-lg">Your Contract Execution & Intelligence Hub</p>

        <section id="opportunities" className="mb-12">
          <h3 className="text-xl font-semibold mb-2"><span role="img" aria-label="opportunities">📂</span> Opportunities</h3>
          <p className="text-neutral-400">Search and view recent contracts tailored to your interests.</p>
        </section>

        <section id="saved" className="mb-12">
          <h3 className="text-xl font-semibold mb-2"><span role="img" aria-label="saved">🗂️</span> Saved</h3>
          <p className="text-neutral-400">Keep your favorite proposals organized in one place.</p>
        </section>

        <section id="team">
          <h3 className="text-xl font-semibold mb-2"><span role="img" aria-label="team">👥</span> Team</h3>
          <p className="text-neutral-400">Manage who has access and assign responsibilities.</p>
        </section>
      </main>
    </div>
  );
}
