// components/LoginForm.js

import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Logging in with:', { email, password });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px', backgroundColor: '#222', padding: '2rem', borderRadius: '8px' }}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '0.5rem' }}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: '0.5rem' }}
        required
      />
      <button type="submit" style={{ padding: '0.5rem', backgroundColor: '#555', color: 'white', border: 'none', cursor: 'pointer' }}>
        Login
      </button>
    </form>
  );
}
