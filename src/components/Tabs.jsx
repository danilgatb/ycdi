import React from 'react';

export default function Tabs({ currentPage, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'workout', label: 'Workout' },
    { id: 'progressPhotos', label: 'Photos' },
    { id: 'goals', label: 'Goals' },
    { id: 'library', label: 'Library' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      background: '#f4f4f4cc',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid #ccc',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '0.5rem 0',
      fontWeight: '600'
    }}>
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            color: currentPage === id ? '#94ff0d' : '#333',
            cursor: 'pointer',
            borderBottom: currentPage === id ? '2px solid #94ff0d' : 'none',
            outline: 'none',
          }}
          aria-current={currentPage === id ? 'page' : undefined}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}