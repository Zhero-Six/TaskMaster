import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';

const ProjectList = () => {
  // Mock data
  const projects = [
    { id: 1, title: 'Website Redesign', description: 'Redesign site', creator: 'John Doe', status: 'Active' },
    { id: 2, title: 'Mobile App', description: 'Build app', creator: 'Jane Smith', status: 'Active' },
    { id: 3, title: 'API', description: 'CRM integration', creator: 'Bob Johnson', status: 'Pending' },
  ];
  const [filter, setFilter] = useState('');

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container" style={{ backgroundColor: 'var(--gray-100)', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '16px' }}>
        All Projects
      </h1>
      <input
        type="text"
        placeholder="Filter by title..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="form-input"
        style={{ marginBottom: '16px' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;