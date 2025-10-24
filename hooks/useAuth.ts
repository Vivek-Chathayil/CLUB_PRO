import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<User>;
  logout: () => void;
  onProfileUpdated: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'clubpro_user_local';
const SESSION_STORAGE_KEY = 'clubpro_user_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      setLoading(true);
      try {
        const storedUserLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
        const storedUserSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
        
        if (storedUserLocal) {
          setUser(JSON.parse(storedUserLocal));
        } else if (storedUserSession) {
          setUser(JSON.parse(storedUserSession));
        }
      } catch (error) {
        console.error("Failed to parse user from storage", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    const loggedInUser = await api.login(email, password);
    setUser(loggedInUser);
    const storage = rememberMe ? localStorage : sessionStorage;
    const key = rememberMe ? LOCAL_STORAGE_KEY : SESSION_STORAGE_KEY;
    storage.setItem(key, JSON.stringify(loggedInUser));
    return loggedInUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);
  
  const onProfileUpdated = useCallback((updatedUser: User) => {
      setUser(updatedUser);
      // Update both storages if they exist to keep sync, though typically only one will be set.
      if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUser));
      }
      if (sessionStorage.getItem(SESSION_STORAGE_KEY)) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));
      }
  }, []);

  const value = { user, loading, login, logout, onProfileUpdated };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};