import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('workout_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('workout_token');
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('workout_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.error('Session expired or error fetching profile:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const { token, ...userData } = res.data.data;
      localStorage.setItem('workout_token', token);
      localStorage.setItem('workout_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    if (res.data.success) {
      const { token, ...userData } = res.data.data;
      localStorage.setItem('workout_token', token);
      localStorage.setItem('workout_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const logout = () => {
    localStorage.removeItem('workout_token');
    localStorage.removeItem('workout_user');
    setUser(null);
  };

  const updateProfile = async (formData) => {
    const res = await authAPI.updateProfile(formData);
    if (res.data.success) {
      setUser((prev) => ({ ...prev, ...res.data.data }));
      localStorage.setItem('workout_user', JSON.stringify({ ...user, ...res.data.data }));
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

