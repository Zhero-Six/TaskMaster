// context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios
        .get('https://taskmaster-6964.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          const userData = response.data.user;
          setUser({
            ...userData,
            id: Number(userData.id),
            is_admin: response.data.is_admin ?? false,
          });
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        });
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://taskmaster-6964.onrender.com/api/login', { email, password });
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser({
        ...user,
        id: Number(user.id),
        is_admin: user.is_admin ?? false,
      });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
