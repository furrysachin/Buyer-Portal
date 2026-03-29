import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../constants/storageKeys";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken("");
    setUser(null);
  }, []);

  const parseJwtPayload = useCallback((value) => {
    try {
      const [, payload] = String(value || "").split(".");
      if (!payload) {
        return null;
      }

      const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = window.atob(normalizedPayload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      return null;
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    const tokenPayload = parseJwtPayload(storedToken);
    const tokenExpired =
      typeof tokenPayload?.exp === "number" && tokenPayload.exp * 1000 <= Date.now();

    if (storedToken && tokenPayload && !tokenExpired) {
      setToken(storedToken);
    } else if (storedToken) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }

    if (storedUser) {
      try {
        if (storedToken && tokenPayload && !tokenExpired) {
          setUser(JSON.parse(storedUser));
        } else {
          localStorage.removeItem(AUTH_USER_KEY);
        }
      } catch (error) {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }

    setLoading(false);
  }, [parseJwtPayload]);

  useEffect(() => {
    const handleUnauthorizedSession = () => {
      clearSession();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorizedSession);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorizedSession);
    };
  }, [clearSession]);

  const saveSession = (nextToken, nextUser) => {
    localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const sanitizeEmail = (value) => {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
  };

  const sanitizePassword = (value) => {
    return typeof value === "string" ? value.trim() : "";
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", {
      name: typeof payload?.name === "string" ? payload.name.trim() : "",
      email: sanitizeEmail(payload?.email),
      password: sanitizePassword(payload?.password),
    });
    saveSession(response.data.token, response.data.user);
    return response.data;
  };

  const login = async (payload) => {
    const response = await api.post("/auth/login", {
      email: sanitizeEmail(payload?.email),
      password: sanitizePassword(payload?.password),
    });
    saveSession(response.data.token, response.data.user);
    return response.data;
  };

  const logout = () => {
    clearSession();
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      loading,
      register,
      login,
      logout,
      setUser,
    }),
    [token, user, loading, clearSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
};
