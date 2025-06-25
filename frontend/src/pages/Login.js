import React from 'react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const Login = () => (
  <div style={{ backgroundColor: 'var(--gray-100)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
    <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '24px' }}>Log In</h2>
      <FormInput label="Email" placeholder="Enter email" type="email" />
      <FormInput label="Password" placeholder="Enter password" type="password" error="Invalid password" />
      <Button variant="primary" style={{ width: '100%', marginTop: '16px' }}>Login</Button>
      <a href="/password-reset" style={{ color: 'var(--blue-600)', fontSize: '14px', marginTop: '8px', display: 'inline-block' }}>
        Forgot Password?
      </a>
    </div>
  </div>
);

export default Login;