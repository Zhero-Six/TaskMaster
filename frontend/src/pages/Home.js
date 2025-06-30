import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';
import axios from 'axios';

const featuredDefaults = [
  {
    id: 'f1',
    title: 'AI Chatbot Assistant',
    description: 'A virtual assistant using NLP and machine learning to automate customer support.',
    creator: { username: 'DemoBot' },
    status: 'featured'
  },
  {
    id: 'f2',
    title: 'Smart Home IoT Dashboard',
    description: 'A real-time control and monitoring system for connected home devices.',
    creator: { username: 'SmartOps' },
    status: 'featured'
  },
  {
    id: 'f3',
    title: 'Blockchain Voting System',
    description: 'A decentralized, transparent election platform built on Ethereum.',
    creator: { username: 'VoteChain' },
    status: 'featured'
  }
];

const Home = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    axios.get('http://localhost:5000/api/projects', config)
      .then(response => {
        const fetched = response.data.projects;
        setProjects(fetched.length > 0 ? fetched : featuredDefaults);
        setLoading(false);
      })
      .catch(() => {
        setProjects(featuredDefaults);
        setLoading(false);
      });
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
          {projects.map(project => (
            <ProjectCard key={project.id} {...project} />
          ))}
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
