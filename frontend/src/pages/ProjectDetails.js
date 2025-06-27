import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import FormInput from '../components/FormInput';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', due_date: '', assigned_to: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(response => {
        setProject(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate('/projects');
      });
  }, [id, navigate]);

  const handleTaskChange = e => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleTaskSubmit = async e => {
    e.preventDefault();
    const newErrors = {};
    if (!taskForm.title) newErrors.title = 'Title is required';
    if (!taskForm.description) newErrors.description = 'Description is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/projects/${id}/tasks`,
        taskForm,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTaskForm({ title: '', description: '', due_date: '', assigned_to: '' });
      setErrors({});
      // Refresh project data
      const response = await axios.get(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProject(response.data);
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Failed to create task' });
    }
  };

  return (
    <div className="container">
      {loading ? (
        <p>Loading project...</p>
      ) : project ? (
        <>
          <h1 className="hero-title">{project.title}</h1>
          <p>{project.description}</p>
          <p>Created by: {project.creator.username}</p>
          <p>Created at: {new Date(project.created_at).toLocaleDateString()}</p>
          <Button
            variant="primary"
            onClick={() => navigate(`/edit-project/${project.id}`)}
            style={{ marginBottom: '16px' }}
          >
            Edit Project
          </Button>
          <h2 style={{ fontSize: '24px', marginTop: '24px' }}>Tasks</h2>
          {project.tasks.length > 0 ? (
            <ul>
              {project.tasks.map(task => (
                <li key={task.id} style={{ marginBottom: '16px' }}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Status: {task.status}</p>
                  <p>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</p>
                  <p>Assigned to: {task.assigned_to?.username || 'Unassigned'}</p>
                  <p>Categories: {task.categories.map(c => c.name).join(', ') || 'None'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks available.</p>
          )}
          <h2 style={{ fontSize: '24px', marginTop: '24px' }}>Create Task</h2>
          {errors.general && <p style={{ color: 'var(--red-500)' }}>{errors.general}</p>}
          <form onSubmit={handleTaskSubmit}>
            <FormInput
              label="Task Title"
              name="title"
              type="text"
              value={taskForm.title}
              onChange={handleTaskChange}
              error={errors.title}
              placeholder="Enter task title"
            />
            <FormInput
              label="Description"
              name="description"
              type="text"
              value={taskForm.description}
              onChange={handleTaskChange}
              error={errors.description}
              placeholder="Enter task description"
            />
            <FormInput
              label="Due Date"
              name="due_date"
              type="date"
              value={taskForm.due_date}
              onChange={handleTaskChange}
              placeholder="Select due date"
            />
            <FormInput
              label="Assigned To (User ID)"
              name="assigned_to"
              type="number"
              value={taskForm.assigned_to}
              onChange={handleTaskChange}
              placeholder="Enter user ID"
            />
            <Button variant="primary" type="submit" style={{ marginTop: '16px' }}>
              Create Task
            </Button>
          </form>
        </>
      ) : (
        <p>Project not found.</p>
      )}
    </div>
  );
};

export default ProjectDetails;