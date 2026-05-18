"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "@/services/api";

const AuthContext = createContext(null);

const STORAGE_KEY = "auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveUser = (userData) => {
    // localStorage صرف optimistic UI کے لیے — source of truth نہیں
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const clearUser = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const refresh = useCallback(async () => {
  
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

   
    try {
      const { data } = await api.me();
      saveUser(data); 
    } catch {
     
      clearUser();
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const login = useCallback(async (email, password) => {
    await api.login({ email, password });
    const { data } = await api.me();
    saveUser(data);
    return data;
  }, []);

  const sendOtp = useCallback(async (payload) => {
    return await api.sendOtp(payload);
  }, []);

  const signup = useCallback(async (payload) => {
    const data = await api.signup(payload);
    if (data.user) saveUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      clearUser();
    }
  }, []);

  const updateProfile = useCallback(async (payload) => {
    await api.updateProfile(payload);
    const res = await api.me();
    saveUser(res.data);
    return res;
  }, []);

  const updatePassword = useCallback(async (payload) => {
    return await api.updatePassword(payload);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        sendOtp,
        logout,
        refresh,
        updateProfile,
        updatePassword,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
