import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setAdmin(data.data);
    } catch { setAdmin(null); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    setAdmin(data.data);
  };
  const logout = async () => { await api.post('/auth/logout'); setAdmin(null); };

  return <AuthContext.Provider value={{ admin, loading, login, logout, refresh }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
