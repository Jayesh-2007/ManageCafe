/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
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
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!currentUser;

  const refreshUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return null;
    }
    try {
      const response = await api.get('/auth/me');
      const user = response.data.user;
      setCurrentUser(user);
      setRole(user.role);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Failed to refresh user', error);
      // If 401, the interceptor will handle the logout
      if (error.response?.status !== 401) {
        setToken(null);
        setCurrentUser(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshUser();
  }, [refreshUser]);

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

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    setRole(null);
    window.location.href = '/login';
  };

  const getCurrentUser = () => currentUser;

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      role, 
      token, 
      loading, 
      isAuthenticated,
      login, 
      register,
      logout, 
      getCurrentUser,
      refreshUser
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
