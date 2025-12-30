// Simple auth store for JWT token management
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export const authStore = {
  // Get current token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Set token
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Remove token
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Get current user
  getUser(): User | null {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },

  // Set user
  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Remove user
  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.isAdmin || false;
  },

  // Clear all auth data
  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  },

  // Login - store token and user
  login(token: string, user: User): void {
    this.setToken(token);
    this.setUser(user);
  },

  // Logout - clear all auth data
  logout(): void {
    this.clearAuth();
  },
};

export default authStore;
