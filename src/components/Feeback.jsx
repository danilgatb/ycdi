import React, { useState } from 'react';

export default function Feedback({ user, db, onBack }) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!message.trim()) return alert('Please enter your feedback.');
    setSubmitting(true);
    try {
      await db.collection('feedback').add({
        userId: user.uid,
        message,
        createdAt: new Date()
      });
      alert('Thanks for your feedback!');
      setMessage('');
      onBack();
    } catch (error) {
      alert('Failed to submit feedback: ' + error.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="page-container">
      <h1>Send Feedback</h1>
      <form onSubmit={submitFeedback}>
        <textarea
          rows={5}
          style={{ width: '100%', padding: '0.5rem' }}
          placeholder="How would you improve this app?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={submitting}
        />
        <button type="submit" disabled={submitting} style={{ marginTop: '1rem' }}>
          {submitting ? 'Sending...' : 'Send'}
        </button>
        <button type="button" onClick={onBack} style={{ marginTop: '0.5rem' }}>
          Cancel
        </button>
      </form>
    </div>
  );
}