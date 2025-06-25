import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Mock API call (replace with axios.get('/api/projects') when backend is ready)
    const mockProjects = [
      { id: 1, title: 'Website Redesign', description: 'Redesign company website', creator: 'John Doe', status: 'Active' },
      { id: 2, title: 'Mobile App', description: 'Build new app', creator: 'Jane Smith', status: 'Active' },
      { id: 3, title: 'API Integration', description: 'Connect to CRM', creator: 'Bob Johnson', status: 'Pending' },
    ];
    setProjects(mockProjects);
  }, []);

  return (
    <div className="container">
      <h1 className="hero-title">
        {user ? `Welcome, ${user.username}!` : 'Manage Your Team with TaskMaster'}
      </h1>
      <div className="featured-projects">
        {projects.length > 0 ? (
          projects.map(project => <ProjectCard key={project.id} {...project} />)
        ) : (
          <p>No featured projects available.</p>
        )}
      </div>
      {user && (
        <Link to="/create-project">
          <Button variant="primary" style={{ marginTop: '24px' }}>
            Create New Project
          </Button>
        </Link>
      )}
    </div>
  );
};

export default Home;