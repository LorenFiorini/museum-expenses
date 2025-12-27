import { useAuth } from "../state/AuthContext";

// Use relative path in production (Vercel), absolute path in development
const API_BASE = import.meta.env.VITE_API_BASE || 
  (import.meta.env.PROD ? "" : "http://localhost:4000");

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const message = isJson ? ((await res.json()) as { message?: string }).message : res.statusText;
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  return (isJson ? res.json() : (null as unknown)) as Promise<T>;
}

export function useApi() {
  const { token } = useAuth();

  return {
    get: <T>(path: string) => request<T>(path, { method: "GET" }, token),
    post: <T>(path: string, body: unknown) =>
      request<T>(
        path,
        {
          method: "POST",
          body: JSON.stringify(body)
        },
        token
      ),
    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }, token),
    rawFetch: (path: string, init: RequestInit) =>
      fetch(`${API_BASE}${path}`, {
        ...init,
        headers: {
          ...(init.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })
  };
}





