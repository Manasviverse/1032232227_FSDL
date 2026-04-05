const BASE_URL = "http://localhost:5000/api";

/**
 * Base fetch wrapper that automatically attaches Auth headers.
 * Throws on non-2xx responses with the server error message.
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("edusync_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("edusync_token");
    localStorage.removeItem("edusync_user");
    window.location.href = "/";
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((data as any)?.message || `HTTP ${res.status}`);
  }

  return data as T;
}
