import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../api/auth';
import { getMe as apiGetMe } from '../api/members';

const AuthContext = createContext({
  token: null,
  member: null,
  loading: false,
  login: async (_email, _password) => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token');
    } catch (e) {
      return null;
    }
  });

  const [member, setMember] = useState(() => {
    try {
      const raw = localStorage.getItem('member');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const persistToken = useCallback((value) => {
    setToken(value);
    try {
      if (value) {
        localStorage.setItem('token', value);
      } else {
        localStorage.removeItem('token');
      }
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  const persistMember = useCallback((value) => {
    setMember(value);
    try {
      if (value) {
        localStorage.setItem('member', JSON.stringify(value));
      } else {
        localStorage.removeItem('member');
      }
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  const logout = useCallback(() => {
    persistToken(null);
    persistMember(null);
    navigate('/login', { replace: true });
  }, [navigate, persistMember, persistToken]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await apiLogin({ email, password });
      const access = data?.access;
      if (!access) {
        throw new Error('No access token in response');
      }
      // Save token first, so subsequent requests include Authorization
      persistToken(access);

      // Fetch current member
      const meResp = await apiGetMe();
      persistMember(meResp?.data || null);

      // Redirect to profile as per requirements
      navigate('/profile', { replace: true });
    } catch (err) {
      // On any error, clear auth to avoid inconsistent state
      persistToken(null);
      persistMember(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate, persistMember, persistToken]);

  // Optional: when app loads and there is a token but no member, try to hydrate member quietly
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      if (token && !member) {
        try {
          const me = await apiGetMe();
          if (!cancelled) persistMember(me?.data || null);
        } catch (e) {
          if (!cancelled) {
            // Invalid token — reset
            persistToken(null);
            persistMember(null);
          }
        }
      }
    }
    hydrate();
    return () => {
      cancelled = true;
    };
  }, [token, member, persistMember, persistToken]);

  const value = useMemo(() => ({ token, member, loading, login, logout }), [token, member, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
