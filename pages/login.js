// pages/login.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn) {
        router.replace('/dashboard'); // replace avoids back going to /login
      }
    }
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();

    // TODO: replace with real auth later
    const ok =
      email === 'a.ford@fsgsolutions.net' && password === 'FSG123$%^';

    if (!ok) {
      setError('Invalid email or password');
      return;
    }

    // Mark session as logged in and choose initial tab
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('activeTab', 'dashboard'); // start on Dashboard
    }

    router.replace('/dashboard'); // use replace to avoid going back to login
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
