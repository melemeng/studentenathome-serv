/**
 * CSRF Token Management for Frontend
 * Handles automatic CSRF token injection in API requests
 */

let currentCsrfToken: string | null = null;

/**
 * Store CSRF token from response header
 */
export function storeCsrfToken(response: Response): void {
  const token = response.headers.get("X-CSRF-Token");
  if (token) {
    currentCsrfToken = token;
  }
}

/**
 * Get current CSRF token
 */
export function getCsrfToken(): string | null {
  return currentCsrfToken;
}

/**
 * Clear CSRF token
 */
export function clearCsrfToken(): void {
  currentCsrfToken = null;
}

/**
 * Fetch wrapper with automatic CSRF token handling
 */
export async function fetchWithCsrf(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);

  // Add CSRF token for state-changing requests
  if (options.method && !["GET", "HEAD", "OPTIONS"].includes(options.method)) {
    if (currentCsrfToken) {
      headers.set("X-CSRF-Token", currentCsrfToken);
    }
    // Also add custom header for simple CSRF protection
    headers.set("X-Requested-With", "XMLHttpRequest");
  }

  // Add credentials for cookies
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  // Store new CSRF token from response
  storeCsrfToken(response);

  return response;
}

/**
 * Get a new CSRF token from the server
 */
export async function refreshCsrfToken(): Promise<boolean> {
  try {
    // Call a safe endpoint that returns CSRF token
    const response = await fetch("/api/auth/csrf-token", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      storeCsrfToken(response);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to refresh CSRF token:", error);
    return false;
  }
}

/**
 * Handle CSRF errors and retry
 */
export async function handleCsrfError(
  error: any,
  retryFn: () => Promise<any>
): Promise<any> {
  // Check if it's a CSRF error
  if (
    error.code === "CSRF_INVALID" ||
    error.code === "CSRF_MISSING" ||
    error.error?.includes("CSRF")
  ) {
    // Try to refresh token and retry once
    const refreshed = await refreshCsrfToken();
    if (refreshed) {
      return retryFn();
    }
  }
  throw error;
}

export default {
  storeCsrfToken,
  getCsrfToken,
  clearCsrfToken,
  fetchWithCsrf,
  refreshCsrfToken,
  handleCsrfError,
};
