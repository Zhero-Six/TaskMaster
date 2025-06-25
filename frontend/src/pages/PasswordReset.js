import React, { useState } from 'react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // Mock API call
    if (email) {
      setMessage('Password reset link sent to your email.');
      setError('');
    } else {
      setError('Email is required');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--gray-100)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '24px' }}>
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={error}
            placeholder="Enter your email"
          />
          {message && <p style={{ color: 'var(--green-500)', fontSize: '14px', marginBottom: '16px' }}>{message}</p>}
          <Button variant="primary" type="submit" style={{ width: '100%', marginTop: '16px' }}>
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;