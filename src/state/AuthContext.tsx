import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  id: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = "museum-auth";

type StoredAuth = {
  token: string;
  user: User;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredAuth;
        setUser(parsed.user);
        setToken(parsed.token);
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      token,
      loading,
      login: (nextToken, nextUser) => {
        setUser(nextUser);
        setToken(nextToken);
        const toStore: StoredAuth = { token: nextToken, user: nextUser };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      },
      logout: () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(STORAGE_KEY);
      }
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext missing");
  return ctx;
}


