import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginWithGoogle as apiLogin, logout as apiLogout } from '../api/auth.js';
import { setTokenGetter } from '../api/client.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'clipify_access_token';
const USER_KEY = 'clipify_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadFromStorage = useCallback(() => {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      const u = sessionStorage.getItem(USER_KEY);
      if (t && u) {
        setToken(t);
        setUser(JSON.parse(u));
      } else {
        setToken(null);
        setUser(null);
      }
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    setTokenGetter(() => token);
  }, [token]);

  useEffect(() => {
    const handle401 = () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    };
    window.addEventListener('auth:401', handle401);
    return () => window.removeEventListener('auth:401', handle401);
  }, []);

  const login = useCallback(async (credential) => {
    const res = await apiLogin(credential);
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem(TOKEN_KEY, res.access_token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(res.user));
    return res;
  }, []);

  const loginAsDev = useCallback(() => {
    const devUser = { id: 'dev', email: 'dev@clipify.local', name: 'Developer' };
    const devToken = 'dev-token-' + Date.now();
    setToken(devToken);
    setUser(devUser);
    localStorage.setItem(TOKEN_KEY, devToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(devUser));
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    loginAsDev,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
