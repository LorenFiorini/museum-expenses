import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthResponse } from "../types";
import { loadFromStorage, persistToStorage } from "../utils/storage";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = loadFromStorage<string | null>("auth_token", null);
    if (savedToken) {
      setToken(savedToken);
      // Verify token and fetch user
      fetchUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchUser(authToken: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        // Token invalid, clear it
        setToken(null);
        persistToStorage("auth_token", null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setToken(null);
      persistToStorage("auth_token", null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    }

    const data: AuthResponse = await res.json();
    setToken(data.token);
    setUser(data.user);
    persistToStorage("auth_token", data.token);
  }

  async function register(name: string, email: string, password: string) {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Registration failed");
    }

    const data: AuthResponse = await res.json();
    setToken(data.token);
    setUser(data.user);
    persistToStorage("auth_token", data.token);
  }

  function logout() {
    setToken(null);
    setUser(null);
    persistToStorage("auth_token", null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
