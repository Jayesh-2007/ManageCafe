/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const getInitialState = () => {
  const token = localStorage.getItem('token');
  let user = null;
  const userStr = localStorage.getItem('user');
  if (userStr && token) {
    try {
      user = JSON.parse(userStr);
    } catch (error) {
      console.error('Failed to parse user from local storage', error);
    }
  }
  return { token, user, role: user?.role || null };
};

export const AuthProvider = ({ children }) => {
  const initialState = getInitialState();
  const [currentUser, setCurrentUser] = useState(initialState.user);
  const [token, setToken] = useState(initialState.token);
  const [role, setRole] = useState(initialState.role);
  // loading is false initially because we got state synchronously from localStorage
  const [loading] = useState(false);

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token: newToken, user } = response.data;
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    setToken(newToken);
    setCurrentUser(user);
    setRole(user.role);
    
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    setRole(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
