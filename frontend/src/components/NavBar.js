import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from './Button';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ backgroundColor: 'var(--gray-900)', padding: '16px', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
          TaskMaster
        </Link>
        <div>
          <Link to="/projects" style={{ color: 'white', marginRight: '16px' }}>
            Projects
          </Link>
          {user ? (
            <>
              <Link to="/profile" style={{ color: 'white', marginRight: '16px' }}>
                Profile
              </Link>
              <Link to="/create-project" style={{ color: 'white', marginRight: '16px' }}>
                Create Project
              </Link>
              <Button variant="secondary" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', marginRight: '16px' }}>
                Login
              </Link>
              <Link to="/register" style={{ color: 'white' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;