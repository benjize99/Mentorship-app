import React, { useState } from 'react';
import ReactStars from 'react-rating-stars-component';

function FeedbackForm({ sessionId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submitFeedback = () => {
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, rating, comment })
    }).then(() => alert('Feedback submitted!'));
  };

  return (
    <div>
      <ReactStars count={5} onChange={setRating} size={24} activeColor="#ffd700" />
      <textarea placeholder="Comments..." onChange={e => setComment(e.target.value)} />
      <button onClick={submitFeedback}>Submit</button>
    </div>
  );
}

export default FeedbackForm;
