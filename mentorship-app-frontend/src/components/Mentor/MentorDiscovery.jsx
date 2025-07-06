import React, { useState, useEffect } from 'react';

function MentorDiscovery() {
  const [mentors, setMentors] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch(`/api/mentors?filter=${filter}`)
      .then(res => res.json())
      .then(setMentors);
  }, [filter]);

  return (
    <div>
      <input placeholder="Filter by skill..." onChange={e => setFilter(e.target.value)} />
      <div className="grid">
        {mentors.map(mentor => (
          <div key={mentor.id} className="card">
            <h3>{mentor.name}</h3>
            <p>{mentor.expertise}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MentorDiscovery;
