import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from './Button';
import axios from 'axios';

const ProjectCard = ({ id, title, description, creator = {}, status }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        navigate('/projects');
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to delete project');
      }
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gray-900)' }}>{title}</h3>
      <p style={{ color: 'var(--gray-600)' }}>{description}</p>
      <p style={{ color: 'var(--gray-600)' }}>Creator: {creator?.username || creator || 'Unknown'}</p>
      <p style={{ color: 'var(--gray-600)' }}>Status: {status || 'N/A'}</p>
      <Link to={`/projects/${id}`}>
        <Button variant="primary">View Details</Button>
      </Link>
      {user && user.id === creator?.id && (
        <>
          <Link to={`/edit-project/${id}`}>
            <Button variant="secondary" style={{ marginLeft: '8px' }}>
              Edit
            </Button>
          </Link>
          <Button variant="secondary" onClick={handleDelete} style={{ marginLeft: '8px' }}>
            Delete
          </Button>
        </>
      )}
    </div>
  );
};

export default ProjectCard;
