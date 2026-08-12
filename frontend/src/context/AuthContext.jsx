import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jobconnect_token') || '');
  const [loading, setLoading] = useState(true);

  // Fetch logged in user details if token exists
  const fetchCurrentUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
      localStorage.removeItem('jobconnect_token');
      setToken('');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('jobconnect_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (fullName, email, password, role = 'candidate') => {
    const res = await API.post('/auth/register', { fullName, email, password, role });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('jobconnect_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('jobconnect_token');
    setToken('');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
