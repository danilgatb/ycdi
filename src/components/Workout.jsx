import React, { useState, useEffect } from 'react';

export default function Workout({ user, userData, setUserData, db }) {
  const [workoutSplit, setWorkoutSplit] = useState(userData.split || '');

  useEffect(() => {
    setWorkoutSplit(userData.split || '');
  }, [userData.split]);

  const saveSplit = async () => {
    if (!user) return;
    try {
      await db.collection('users').doc(user.uid).set({ split: workoutSplit }, { merge: true });
      alert('Workout split saved!');
      setUserData(prev => ({ ...prev, split: workoutSplit }));
    } catch (error) {
      alert('Error saving split: ' + error.message);
    }
  };

  return (
    <div className="page-container">
      <h1>Workout Split</h1>
      <textarea
        value={workoutSplit}
        onChange={(e) => setWorkoutSplit(e.target.value)}
        rows={6}
        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        placeholder="Enter your workout split details here..."
      />
      <button onClick={saveSplit} style={{ marginTop: '1rem' }}>
        Save Split
      </button>
    </div>
  );
}