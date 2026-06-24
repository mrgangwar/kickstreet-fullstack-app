import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../services/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'kick-street-auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          setUser(saved.user);
          setToken(saved.token);
          setAuthToken(saved.token);
        }
      } finally {
        setBooting(false);
      }
    };
    restore();
  }, []);

  const persistAuth = async (payload) => {
    setUser(payload.user);
    setToken(payload.token);
    setAuthToken(payload.token);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const login = async (credentials) => {
    const data = await api.login(credentials);
    await persistAuth(data);
  };

  const register = async (details) => {
    const data = await api.register(details);
    await persistAuth(data);
  };

  const updateProfile = async (payload) => {
    const data = await api.updateProfile(payload);
    await persistAuth(data);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => ({
    user,
    token,
    booting,
    login,
    register,
    updateProfile,
    logout
  }), [user, token, booting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);