import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/register', formData);
      navigate('/login');
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Registration failed' });
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--gray-100)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '24px' }}>
          Register
        </h2>
        {errors.general && <p style={{ color: 'var(--red-500)', fontSize: '14px' }}>{errors.general}</p>}
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="Enter username"
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter email"
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter password"
          />
          <Button variant="primary" type="submit" style={{ width: '100%', marginTop: '16px' }}>
            Register
          </Button>
        </form>
        <Link to="/login" style={{ color: 'var(--blue-600)', fontSize: '14px', marginTop: '8px', display: 'inline-block' }}>
          Already have an account? Log in
        </Link>
      </div>
    </div>
  );
};

export default Register;