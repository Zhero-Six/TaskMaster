import React, { useState } from 'react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const CreateProject = () => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Mock API call
    if (formData.title && formData.description) {
      alert('Project created');
    } else {
      setErrors({
        title: !formData.title ? 'Title is required' : '',
        description: !formData.description ? 'Description is required' : '',
      });
    }
  };

  return (
    <div className="container" style={{ backgroundColor: 'var(--gray-100)', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '16px' }}>
        Create Project
      </h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
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
        <Button variant="primary" type="submit" style={{ width: '100%', marginTop: '16px' }}>
          Create
        </Button>
      </form>
    </div>
  );
};

export default CreateProject;