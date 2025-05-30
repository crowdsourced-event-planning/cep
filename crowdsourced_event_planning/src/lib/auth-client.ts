/**
 * Client-side authentication utilities
 */

export interface UserProfile {
  _id: string;
  name: string;
  email?: string;
  role?: string;
}

/**
 * Get user data from JWT token stored in cookie
 */
export function getCurrentUser(): UserProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const token = getCookie("access_token");
    if (!token) return null;

    // Decode JWT payload (base64)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      _id: payload._id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Get cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue || null;
  }
  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

/**
 * Remove authentication token (logout)
 */
export function logout(): void {
  if (typeof window === "undefined") return;

  document.cookie =
    "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
}
