import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'a.ford@fsgsolutions.net' && password === 'FSG123$%^') {
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <label className="block mb-4">
            <span className="block text-sm font-medium mb-1">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none"
              required
            />
          </label>
          <label className="block mb-6">
            <span className="block text-sm font-medium mb-1">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
