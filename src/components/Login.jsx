import React, { useState } from 'react';

export default function Login({ onSwitch, onLogin, firebaseAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await firebaseAuth.signInWithEmailAndPassword(email, password);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="auth-form">
      <h1>Log In</h1>
      <label>Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">Log In</button>
      <p>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch} className="link-button">
          Sign Up
        </button>
      </p>
      {error && <p className="error">{error}</p>}
    </form>
  );
}