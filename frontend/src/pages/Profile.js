import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios
        .get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(response => {
          setProfile(response.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="container">
      <h1 className="hero-title">User Profile</h1>
      {loading ? (
        <p>Loading profile...</p>
      ) : profile ? (
        <>
          <p>Username: {profile.user.username}</p>
          <p>Email: {profile.user.email}</p>
          <p>Joined: {new Date(profile.user.created_at).toLocaleDateString()}</p>
          <p>Projects Created: {profile.projects_created}</p>
          <p>Tasks Assigned: {profile.tasks_assigned}</p>
          <p>Tasks Completed: {profile.tasks_completed}</p>
        </>
      ) : (
        <p>Profile not available.</p>
      )}
    </div>
  );
};

export default Profile;