import React from 'react';

export default function LogoutConfirm({ onConfirm, onCancel }) {
  return (
    <div className="page-container">
      <h1>Log Out</h1>
      <p>Are you sure you want to log out?</p>
      <button onClick={onConfirm}>Yes, Log Out</button>
      <button onClick={onCancel} style={{ marginLeft: '1rem' }}>Cancel</button>
    </div>
  );
}