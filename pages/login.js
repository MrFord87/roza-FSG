import React, { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Attempt:', { email, password });
    // Here you’d typically call an API or auth function
  };

  return (
    <div style={{ backgroundColor: '#222', padding: '2rem', borderRadius: '8px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.5rem', backgroundColor: '#444', color: 'white', border: 'none' }}>
          Login
        </button>
      </form>
    </div>
  );
}
