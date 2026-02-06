// src/utils/auth.js
export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

export function isLoggedIn() {
  return !!getAuthToken();
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  } catch (e) {
    // ignore
  }
}

export async function logout() {
  if (typeof window === "undefined") return { success: false, message: "no-window" };

  const token = getAuthToken();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  if (!token) {
    clearAuth();
    return { success: true, message: "no-token" };
  }

  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => null);

    // If logout succeeded or token already invalid/expired, clear local client auth.
    if (res.ok || res.status === 401) {
      clearAuth();
    }

    return {
      success: !!(data && data.success) || res.ok,
      status: res.status,
      message: data?.message || (res.ok ? "Logged out" : "Logout failed"),
    };
  } catch (err) {
    // network error — still clear local auth to force login
    clearAuth();
    return { success: false, message: "network_error" };
  }
}
