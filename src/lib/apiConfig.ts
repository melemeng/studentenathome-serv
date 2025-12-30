// API configuration that switches between dev and production
// In production, API calls go to the Railway-hosted backend
// Update VITE_API_URL in GitHub Actions secrets or use the Railway URL directly
const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "https://studentenathome-api.up.railway.app"
  : "http://localhost:5000";

export const apiConfig = {
  baseUrl: API_BASE_URL,

  // Auth endpoints
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    verifyEmail: `${API_BASE_URL}/api/auth/verify-email`,
    resendVerification: `${API_BASE_URL}/api/auth/resend-verification`,
    requestPasswordReset: `${API_BASE_URL}/api/auth/request-password-reset`,
    resetPassword: `${API_BASE_URL}/api/auth/reset-password`,
    csrfToken: `${API_BASE_URL}/api/auth/csrf-token`,
  },

  // Post endpoints
  posts: {
    getAll: `${API_BASE_URL}/api/posts`,
    create: `${API_BASE_URL}/api/posts`,
    update: (id: string) => `${API_BASE_URL}/api/posts/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/posts/${id}`,
  },

  // Contact endpoint
  contact: `${API_BASE_URL}/api/contact`,
};

export default apiConfig;
