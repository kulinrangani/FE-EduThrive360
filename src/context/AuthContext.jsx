import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { setAuthToken } from "../api/client.js";
import * as authApi from "../api/auth.js";
import { isStaffRole } from "../config/roles.js";

const STORAGE_KEY = "et_user_token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem(STORAGE_KEY));

  const setToken = useCallback((next) => {
    if (next) {
      localStorage.setItem(STORAGE_KEY, next);
      setAuthToken(next);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setAuthToken(null);
    }
    setTokenState(next);
  }, []);

  const refreshProfile = useCallback(async () => {
    const profile = await authApi.fetchProfile();
    setUser(profile);
    return profile;
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { token: jwt, user: loggedIn } = await authApi.login(email, password);
      if (loggedIn.role === "super_admin") {
        throw new Error("Super admin uses the Admin console");
      }
      setToken(jwt);
      setUser(loggedIn);
      return loggedIn;
    },
    [setToken],
  );

  const register = useCallback(
    async (payload) => {
      const body = {
        ...payload,
        role: "user",
      };
      const { token: jwt, user: registered } = await authApi.register(body);
      if (registered.role !== "user") {
        throw new Error("Invalid registration response");
      }
      setToken(jwt);
      setUser(registered);
      return registered;
    },
    [setToken],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthToken(token);
    refreshProfile()
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token, refreshProfile, setToken]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      isAuthenticated: !!token && !!user,
      isStaff: user ? isStaffRole(user.role) : false,
    }),
    [token, user, loading, login, register, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
