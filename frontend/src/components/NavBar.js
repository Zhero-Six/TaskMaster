import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="navbar">
      <h1>TaskMaster</h1>
      <div>
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} className="button secondary" style={{ marginLeft: '16px' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;