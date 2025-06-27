import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import axios from 'axios';

const CreateProject = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setErrors({
        title: !formData.title ? 'Title is required' : '',
        description: !formData.description ? 'Description is required' : '',
      });
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/projects', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/projects');
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Failed to create project' });
    }
  };

  return (
    <div className="container">
      <h1 className="hero-title">Create New Project</h1>
      {errors.general && <p style={{ color: 'var(--red-500)', fontSize: '14px' }}>{errors.general}</p>}
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Enter project title"
        />
        <FormInput
          label="Description"
          name="description"
          type="text"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="Enter project description"
        />
        <Button variant="primary" type="submit" style={{ marginTop: '16px' }}>
          Create Project
        </Button>
      </form>
    </div>
  );
};

export default CreateProject;