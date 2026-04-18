const TOKEN_KEY = "stemtechlab_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function apiUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `/api${p}`;
}

export async function adminLogin(
  email: string,
  username: string,
  password: string
): Promise<{ token: string; user: Record<string, unknown> }> {
  const res = await fetch(apiUrl("/auth/admin-login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });
  const data = (await res.json()) as { message?: string; token?: string; user?: Record<string, unknown> };
  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }
  if (!data.token || !data.user) throw new Error("Invalid response");
  return { token: data.token, user: data.user };
}

export async function adminFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(apiUrl(path), { ...init, headers });
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (res.status === 401) {
    clearAdminToken();
    throw new Error("Session expired — log in again.");
  }

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    if (typeof data === "object" && data !== null) {
      const o = data as {
        message?: string;
        errors?: Array<{ msg?: string; path?: string }>;
      };
      if (typeof o.message === "string" && o.message.trim()) {
        msg = o.message;
      } else if (Array.isArray(o.errors) && o.errors.length > 0) {
        msg = o.errors
          .map((e) => {
            const p = e.path != null ? String(e.path) : "";
            const m = e.msg != null ? String(e.msg) : "";
            return p && m ? `${p}: ${m}` : m || p;
          })
          .filter(Boolean)
          .join("; ");
      }
    }
    throw new Error(msg);
  }

  return data as T;
}
