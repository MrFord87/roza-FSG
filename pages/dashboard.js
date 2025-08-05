// pages/login.js export default function Login() { return ( <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4"> <h1 className="text-4xl font-bold mb-2">Welcome to Roza</h1> <p className="text-lg text-gray-400 mb-8">Your Contract Execution & Intelligence Hub</p>

<div className="bg-white text-black p-6 rounded-xl shadow-md w-full max-w-md">
    <h2 className="text-2xl font-semibold mb-4">Login</h2>
    <form>
      <div className="mb-4">
        <label htmlFor="email" className="block font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mt-4"
      >
        Login
      </button>
    </form>
  </div>
</div>

); }

