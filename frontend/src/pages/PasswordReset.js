import React, { useState } from 'react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PasswordReset = () => {
  const { token } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!token && !email) {
      setError('Email is required');
      return;
    }
    try {
      if (token) {
        // Reset password with token
        await axios.post(`http://localhost:5000/api/reset-password/${token}`, { password });
        setMessage('Password reset successfully. Please log in.');
      } else {
        // Request reset link
        await axios.post('http://localhost:5000/api/password-reset', { email });
        setMessage('If the email exists, a reset link has been sent.');
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--gray-100)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '24px' }}>
          {token ? 'Reset Password' : 'Request Password Reset'}
        </h2>
        <form onSubmit={handleSubmit}>
          {token ? (
            <FormInput
              label="New Password"
              name="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={error}
              placeholder="Enter new password"
            />
          ) : (
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={error}
              placeholder="Enter your email"
            />
          )}
          {message && <p style={{ color: 'var(--green-500)', fontSize: '14px', marginBottom: '16px' }}>{message}</p>}
          <Button variant="primary" type="submit" style={{ width: '100%', marginTop: '16px' }}>
            {token ? 'Reset Password' : 'Send Reset Link'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;