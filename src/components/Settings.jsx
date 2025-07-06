import React, { useState } from 'react';

export default function Settings({ user, firebaseAuth, db, onLogout }) {
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  // Reauthenticate user for sensitive operations
  const reauthenticate = async () => {
    const credential = firebaseAuth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await user.reauthenticateWithCredential(credential);
  };

  const updateEmail = async () => {
    try {
      await user.updateEmail(email);
      setMessage('Email updated successfully.');
    } catch (error) {
      setMessage('Error updating email: ' + error.message);
    }
  };

  const updatePassword = async () => {
    try {
      await reauthenticate();
      await user.updatePassword(newPassword);
      setMessage('Password updated successfully.');
    } catch (error) {
      setMessage('Error updating password: ' + error.message);
    }
  };

  const updateName = async () => {
    try {
      await user.updateProfile({ displayName: name });
      await db.collection('users').doc(user.uid).set({ name }, { merge: true });
      setMessage('Name updated successfully.');
    } catch (error) {
      setMessage('Error updating name: ' + error.message);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      await user.delete();
      onLogout();
    } catch (error) {
      setMessage('Error deleting account: ' + error.message);
    }
  };

  const resetAllData = async () => {
    if (!window.confirm('Are you sure you want to reset all your data?')) return;
    try {
      await db.collection('users').doc(user.uid).delete();
      setMessage('All data reset. You may need to reload the app.');
    } catch (error) {
      setMessage('Error resetting data: ' + error.message);
    }
  };

  return (
    <div className="page-container">
      <h1>Settings</h1>
      {message && <p>{message}</p>}
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
      </label>
      <button onClick={updateName}>Update Name</button>

      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
      </label>
      <button onClick={updateEmail}>Update Email</button>

      <hr />

      <label>
        Current Password:
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
      </label>

      <label>
        New Password:
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
      </label>
      <button onClick={updatePassword}>Change Password</button>

      <hr />

      <button style={{ color: 'red' }} onClick={deleteAccount}>
        Delete Account
      </button>
      <button style={{ marginLeft: '1rem' }} onClick={resetAllData}>
        Reset All Data
      </button>
    </div>
  );
}