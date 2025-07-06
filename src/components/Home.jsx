import React from 'react';

export default function Home({ user, userData, setUserData, db }) {
  return (
    <div className="page-container">
      <h1>Happy to have you back, {userData.name || user.displayName || user.email} 👋</h1>
      <p>Welcome to your dashboard. Use the tabs below to navigate through your workouts, goals, progress photos, and more.</p>

      {/* Optionally add quick stats or reminders here */}

    </div>
  );
}