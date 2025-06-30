import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import axios from 'axios';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [projectsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/projects', { headers }),
          axios.get('http://localhost:5000/api/categories', { headers }),
        ]);

        const fetchedProjects = projectsRes.data.projects.map(project => ({
          ...project,
          tasks: project.tasks || [],
        }));

        setProjects(fetchedProjects);
        setCategories(categoriesRes.data.categories);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesTitle = project.title.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = categoryFilter
      ? project.tasks?.some(task =>
          task.categories?.some(category => category.id === parseInt(categoryFilter))
        )
      : true;
    return matchesTitle && matchesCategory;
  });

  return (
    <div className="container">
      <h1 className="hero-title">All Projects</h1>
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Filter by title..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ padding: '8px', marginRight: '16px', width: '200px' }}
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          style={{ padding: '8px', width: '200px' }}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div className="featured-projects">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => <ProjectCard key={project.id} {...project} />)
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectList;