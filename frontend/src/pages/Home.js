import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';
import axios from 'axios';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(response => {
        setProjects(response.data.projects);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h1 className="hero-title">
        {user ? `Welcome, ${user.username}!` : 'Manage Your Team with TaskMaster'}
      </h1>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div className="featured-projects">
          {projects.length > 0 ? (
            projects.map(project => <ProjectCard key={project.id} {...project} />)
          ) : (
            <p>No featured projects available.</p>
          )}
        </div>
      )}
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