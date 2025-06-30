import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import axios from 'axios';

const EditProject = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setFormData({ title: response.data.title, description: response.data.description });
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch project for editing:', error);
        alert(
          error.response?.data?.error ||
          'Could not load project for editing. You may not have permission or the project may not exist.'
        );
        navigate('/projects');
      });
  }, [id, token, navigate]);

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
      await axios.put(`http://localhost:5000/api/projects/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/projects');
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Failed to update project' });
    }
  };

  return (
    <div className="container">
      <h1 className="hero-title">Edit Project</h1>
      {loading ? (
        <p>Loading project...</p>
      ) : (
        <>
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
              Update Project
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default EditProject;
