import React from 'react';

const ProjectCard = ({ title, description, creator, status }) => {
  return (
    <div className="project-card">
      <h2>{title}</h2>
      <p>{description}</p>
      <p>By: {creator}</p>
      <span className="status">{status}</span>
    </div>
  );
};

export default ProjectCard;