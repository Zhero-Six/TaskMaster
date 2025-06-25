import React from 'react';
import ProjectCard from '../components/ProjectCard';

const Home = () => (
  <div style={{ backgroundColor: 'var(--gray-100)', padding: '16px', minHeight: '100vh' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--gray-900)', textAlign: 'center', marginBottom: '32px' }}>
      Manage Your Team with TaskMaster
    </h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', maxWidth: '1200px', margin: '0 auto' }}>
      <ProjectCard title="Website Redesign" description="Redesign company website" creator="John Doe" status="Active" />
      <ProjectCard title="Mobile App" description="Build new app" creator="Jane Smith" status="Active" />
      <ProjectCard title="API Integration" description="Connect to CRM" creator="Bob Johnson" status="Pending" />
    </div>
  </div>
);

export default Home;