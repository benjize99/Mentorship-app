import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../../utils/api';


const Avatar = ({ name }) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';
  return (
    <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-white">
      {initials}
    </div>
  );
};

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_URL}${url}`;
};
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [hour, minute] = timeStr.split(':');
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


const MentorsMentee = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', skills: [], image: null });
  const [skillsList] = useState(['JavaScript', 'Python', 'Node.js', 'React', 'SQL']);
  const [message, setMessage] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [requestedMentors, setRequestedMentors] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
  if (!token) {
    navigate('/pages/Login');
    return;
  }

  // Fetch user profile
  fetch(`${API_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Fetched user:', data); // Debugging line
      let skills = typeof data.skills === 'string' ? JSON.parse(data.skills) || [] : data.skills;
      setUser({ ...data, skills });
      setEditForm({
        name: data.name || '',
        bio: data.bio || '',
        skills: skills || [],
        image: null,
      });
      setPreviewSrc(getImageUrl(data.imageUrl));
    })
    .catch((err) => {
      console.error('User fetch error', err);
      localStorage.removeItem('token');
      navigate('/pages/Login');
    });

  // ✅ Fetch mentors (no availability required)
 fetch(`${API_URL}/api/mentors/available`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => setMentors(data.mentors || []))
    .catch(err => console.error('Fetch error:', err));
}, []);


  const handleRequest = async (mentorId) => {
    try {
      const res = await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mentorId,
        }),
      });

      if (!res.ok) throw new Error('Failed to send request');
      setRequestedMentors((prev) => [...prev, mentorId]);
    } catch (err) {
      console.error('Request failed', err);
      alert('❌ Mentor Unavailable or Engaged');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('bio', editForm.bio);
      formData.append('skills', JSON.stringify(editForm.skills));
      if (editForm.image) formData.append('image', editForm.image);

      const res = await fetch(`${API_URL}/api/users/me/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Update failed');

      const updated = await res.json();
      setUser(updated.user);
      setEditMode(false);
      setMessage('✅ Profile updated successfully!');
      setPreviewSrc(getImageUrl(updated.user.imageUrl) + '?t=' + new Date().getTime());
    } catch (err) {
      setMessage('❌ Failed to update profile');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleSkill = (skill) => {
    setEditForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  if (!user) return <p className="text-center mt-20">Loading Dashboard...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center w-full">
        <span className="font-bold text-xl">Mentorship App</span>
        <div className="space-x-4">
          <Link to="/pages/Dashboard" className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-100">
            Dashboard
          </Link>
          <button onClick={() => setEditMode(true)} className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-100">
            Profile
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/pages/Login');
            }}
            className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-100"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Layout */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-80 bg-white shadow-md p-8 flex flex-col items-center">
          {user.imageUrl ? (
            <img
              src={`${API_URL}${user.imageUrl}?t=${new Date().getTime()}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
          ) : (
            <Avatar name={user.name} />
          )}
          <h2 className="text-xl font-bold">{user.name || 'No Name'}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="mt-2 text-sm text-gray-500">{user.bio || 'No bio set.'}</p>
          <div className="mt-2">
            <span className="font-semibold">Skills:</span>
            <span className="ml-1 text-gray-700">
              {user.skills && user.skills.length > 0 ? user.skills.join(', ') : 'None'}
            </span>
          </div>
          {message && <p className="mt-4 text-green-600">{message}</p>}
        </aside>

        {/* Main Content */}
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mx-5 mb-4">
  <h1 className="text-2xl font-bold">Find a Mentor</h1>
  <select
    className="border border-gray-300 rounded px-3 py-2"
    onChange={(e) => setSelectedSkill(e.target.value)}
  >
    <option value="">Filter by Skill</option>
    {skillsList.map((skill) => (
      <option key={skill} value={skill}>{skill}</option>
    ))}
  </select>
</div>

          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6 m-5">
            {mentors
  .filter((mentor) =>
    selectedSkill === '' ||
    (mentor.skills && mentor.skills.includes(selectedSkill))
  )
  .map((mentor) => (

  <div key={mentor.id} className="bg-white p-6 rounded shadow flex flex-col items-center">
    {mentor.imageUrl ? (
  <img
    src={getImageUrl(mentor.imageUrl)}
    alt={mentor.name}
    className="w-24 h-24 rounded-full object-cover mb-2"
  />
) : (
  <Avatar name={mentor.name} />
)}

    <h2 className="font-semibold">{mentor.name}</h2>
    <p className="text-sm text-gray-500 mb-1">{mentor.email}</p>
    {mentor.skills && mentor.skills.length > 0 ? (
  <p className="text-sm text-gray-600 mb-2">
    <strong>Skills:</strong> {mentor.skills.join(', ')}
  </p>
) : (
  <p className="text-sm text-red-500 mb-2">No skills listed</p>
)}


    {/* Show availability if it exists */}
    {mentor.availabilities && mentor.availabilities.length > 0 ? (
      <div className="text-sm text-green-700 mb-2">
        <strong>Availability:</strong>
        <ul className="mt-1">
          {mentor.availabilities.map((slot, i) => (
            <li key={i}>
              {slot.weekday}: {slot.start_time} - {slot.end_time}
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <p className="text-sm text-red-500 mb-2">No availability listed</p>
    )}
 
    <button
      className={`px-4 py-1 rounded ${
        requestedMentors.includes(mentor.id)
          ? 'bg-gray-400 text-white cursor-default'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
      disabled={requestedMentors.includes(mentor.id)}
      onClick={() => handleRequest(mentor.id)}
    >
      {requestedMentors.includes(mentor.id) ? 'Requested' : 'Request Mentorship'}
    </button>
  </div>
))}

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 text-red py-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">© 2025 Mentorship App. All rights reserved.</p>
          <p className="text-xs">Built with by Abrefah Benjamin</p>
        </div>
      </footer>

      {/* Edit Profile Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill) => (
                    <label key={skill} className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={editForm.skills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                      />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Profile Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
                {previewSrc && (
                  <img src={previewSrc} alt="Preview" className="w-20 h-20 rounded-full object-cover mt-2" />
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                  Save
                </button>
                <button type="button" onClick={() => setEditMode(false)} className="text-gray-500">
                  Cancel
                </button>
              </div>
            </form>
            <button onClick={() => setEditMode(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl">
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorsMentee;