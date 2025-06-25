import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetails = () => {
  const { id } = useParams();
  const project = {
    id,
    title: `Project ${id}`,
    description: 'Sample project description',
    creator: 'Test User',
    tasks: [
      { id: 1, title: 'Task 1', status: 'Pending' },
      { id: 2, title: 'Task 2', status: 'Complete' },
    ],
  };

  return (
    <div className="container" style={{ backgroundColor: 'var(--gray-100)', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '16px' }}>
        {project.title}
      </h1>
      <p>{project.description}</p>
      <p>Creator: {project.creator}</p>
      <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '16px 0 8px' }}>Tasks</h2>
      <ul>
        {project.tasks.map(task => (
          <li key={task.id}>
            {task.title} - {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDetails;