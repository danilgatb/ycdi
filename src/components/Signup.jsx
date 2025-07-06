import React, { useState } from 'react';

export default function Signup({ onSwitch, onSignup, firebaseAuth, db }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    try {
      const cred = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });
      await db.collection('users').doc(cred.user.uid).set({
        name,
        split: '',
        goals: '',
        photos: []
      });
      onSignup();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="auth-form">
      <h1>Create Account</h1>
      <label>Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
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
      <button type="submit">Sign Up</button>
      <p>
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="link-button">
          Log In
        </button>
      </p>
      {error && <p className="error">{error}</p>}
    </form>
  );
}