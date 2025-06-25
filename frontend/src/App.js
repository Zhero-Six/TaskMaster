import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProjectCard from './components/ProjectCard';
import FormInput from './components/FormInput';
import Button from './components/Button';

const Home = () => (
  <div style={{ backgroundColor: 'var(--gray-100)', padding: '16px', minHeight: '100vh' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--gray-900)', textAlign: 'center', marginBottom: '32px' }}>
      Manage Your Team with TaskMaster
    </h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', maxWidth: '1200px', margin: '0 auto' }}>
      <ProjectCard title="Website Redesign" description="Redesign company website" creator="John Doe" status="Active" />
      <ProjectCard title="Mobile App" description="Build new app" creator="Jane Smith" status="Active" />
      <ProjectCard title="API Integration" description="Connect to CRM" creator="Bob Johnson" status="Pending" />
    </div>
  </div>
);

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

const App = () => {
  const isAuthenticated = false; // Replace with auth logic
  return (
    <Router>
      <NavBar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;