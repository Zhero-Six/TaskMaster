import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const assignedProjects = [
    { id: 1, title: 'Website Redesign', description: 'Redesign site', creator: user.username, status: 'Active' },
  ];
  const assignedTasks = [
    { id: 1, title: 'Design Homepage', status: 'Pending' },
  ];

  return (
    <div className="container" style={{ backgroundColor: 'var(--gray-100)', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '16px' }}>
        {user.username}'s Profile
      </h1>
      <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '16px 0 8px' }}>Assigned Projects</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
        {assignedProjects.map(project => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '16px 0 8px' }}>Assigned Tasks</h2>
      <ul>
        {assignedTasks.map(task => (
          <li key={task.id}>
            {task.title} - {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;