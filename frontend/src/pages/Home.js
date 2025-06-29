import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';
import axios from 'axios';

const featuredDefaults = [
  {
    id: 201,
    title: "AI-Powered Chatbot",
    description: "A conversational assistant built with NLP and Flask APIs.",
    status: "active",
    creator: { username: "tech_lead" }
  },
  {
    id: 202,
    title: "DevOps CI/CD Pipeline",
    description: "Automated deployment setup using GitHub Actions and Docker.",
    status: "active",
    creator: { username: "devops_master" }
  },
  {
    id: 203,
    title: "React Admin Dashboard",
    description: "A responsive admin interface with charts, filters, and auth.",
    status: "in-progress",
    creator: { username: "ui_designer" }
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
