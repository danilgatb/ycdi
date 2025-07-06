import React, { useState, useEffect } from 'react';

export default function Goals({ user, userData, setUserData, db }) {
  const [weeklyDays, setWeeklyDays] = useState(userData.weeklyDays || '');
  const [mainGoal, setMainGoal] = useState(userData.mainGoal || '');
  const [additionalGoals, setAdditionalGoals] = useState(userData.additionalGoals || []);
  const [personalGoal, setPersonalGoal] = useState(userData.personalGoal || '');

  useEffect(() => {
    setWeeklyDays(userData.weeklyDays || '');
    setMainGoal(userData.mainGoal || '');
    setAdditionalGoals(userData.additionalGoals || []);
    setPersonalGoal(userData.personalGoal || '');
  }, [userData]);

  const goalOptions = ['Hypertrophy', 'Max Strength', 'Weight Loss', 'Weight Gain'];

  const toggleAdditionalGoal = (goal) => {
    if (additionalGoals.includes(goal)) {
      setAdditionalGoals(additionalGoals.filter((g) => g !== goal));
    } else {
      setAdditionalGoals([...additionalGoals, goal]);
    }
  };

  const saveGoals = async () => {
    if (!user) return;
    try {
      await db.collection('users').doc(user.uid).set(
        {
          weeklyDays,
          mainGoal,
          additionalGoals,
          personalGoal,
        },
        { merge: true }
      );
      setUserData((prev) => ({
        ...prev,
        weeklyDays,
        mainGoal,
        additionalGoals,
        personalGoal,
      }));
      alert('Goals saved!');
    } catch (err) {
      alert('Failed to save goals: ' + err.message);
    }
  };

  return (
    <div className="page-container">
      <h1>Set Your Goals</h1>

      <label>
        Days per week to work out:
        <select
          value={weeklyDays}
          onChange={(e) => setWeeklyDays(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        >
          <option value="">Select days</option>
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </label>

      <div style={{ marginTop: '1rem' }}>
        <label>Main workout goal:</label>
        <select
          value={mainGoal}
          onChange={(e) => setMainGoal(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        >
          <option value="">Select goal</option>
          {goalOptions.map((goal) => (
            <option key={goal} value={goal}>
              {goal}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>Additional goals:</label>
        <div>
          {goalOptions
            .filter((goal) => goal !== mainGoal)
            .map((goal) => (
              <label key={goal} style={{ marginRight: '1rem' }}>
                <input
                  type="checkbox"
                  checked={additionalGoals.includes(goal)}
                  onChange={() => toggleAdditionalGoal(goal)}
                />{' '}
                {goal}
              </label>
            ))}
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>
          Personal written goal:
          <textarea
            value={personalGoal}
            onChange={(e) => setPersonalGoal(e.target.value)}
            rows={3}
            style={{ width: '100%', marginTop: '0.3rem' }}
            placeholder="E.g. Wake up at 6am every day this week"
          />
        </label>
      </div>

      <button onClick={saveGoals} style={{ marginTop: '1rem' }}>
        Save Goals
      </button>
    </div>
  );
}