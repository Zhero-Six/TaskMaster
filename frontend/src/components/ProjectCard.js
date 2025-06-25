import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ id, title, description, creator, status }) => {
  return (
    <div className="project-card">
      <h2>{title}</h2>
      <p>{description}</p>
      <p>By: {creator}</p>
      <span className="status">{status}</span>
      {id && (
        <Link to={`/projects/${id}`} className="button secondary" style={{ marginTop: '8px', display: 'inline-block' }}>
          View Details
        </Link>
      )}
    </div>
  );
};

export default ProjectCard;