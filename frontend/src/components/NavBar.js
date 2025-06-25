import React from 'react';

const NavBar = ({ isAuthenticated }) => {
  return (
    <nav className="navbar">
      <h1>TaskMaster</h1>
      <div>
        <a href="/">Home</a>
        <a href="/projects">Projects</a>
        {isAuthenticated ? (
          <>
            <a href="/profile">Profile</a>
            <a href="/logout">Logout</a>
          </>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;