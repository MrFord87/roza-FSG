import React, { useState, useEffect } from 'react';

const ALLOWED_EMAILS = new Set([
  'a.sweet@fsgsolutions.net',
  'u.gonzales@fsgsolutions.net',
  'a.ford@fsgsolutions.net', // keep yours too if you want
]);
const PASSWORD = 'FSG123$%^';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('roza_user');
    try {
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.email) {
        window.location.replace('/dashboard');
      }
    } catch {}
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); // 🔴 important: avoid full page form POST

    const cleanEmail = email.trim().toLowerCase();
    if (!ALLOWED_EMAILS.has(cleanEmail) || pass !== PASSWORD) {
      setErr('Invalid email or password.');
      return;
    }

    // ✅ Save a clean JSON value under the exact key dashboard expects
    try {
      localStorage.setItem('roza_user', JSON.stringify({ email: cleanEmail, ts: Date.now() }));
    } catch {}

    // Navigate (replace avoids back button going to /login again)
    window.location.replace('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="border rounded p-4 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-3">Sign in to ROZA</h1>

        <label className="block text-sm mb-1">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2 mb-3"
          placeholder="name@fsgsolutions.net"
          autoComplete="username"
        />

        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="w-full border rounded p-2 mb-3"
          placeholder="Password"
          autoComplete="current-password"
        />

        {err && <div className="text-red-600 text-sm mb-2">{err}</div>}

        <button type="submit" className="w-full px-3 py-2 rounded bg-blue-600 text-white">
          Sign in
        </button>
      </form>
    </div>
  );
}
