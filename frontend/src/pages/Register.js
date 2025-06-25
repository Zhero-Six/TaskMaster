import React, { useState } from 'react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Mock API call
    if (formData.username && formData.email && formData.password) {
      alert('Registration successful');
    } else {
      setErrors({
        username: !formData.username ? 'Username is required' : '',
        email: !formData.email ? 'Email is required' : '',
        password: !formData.password ? 'Password is required' : '',
      });
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--gray-100)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '24px' }}>
          Register
        </h2>
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
      </div>
    </div>
  );
};

export default Register;