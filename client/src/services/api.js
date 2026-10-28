// Base URL configuration: uses Vite env variable or falls back to local /api proxy
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('student');
};

export const getStoredStudent = () => {
  const data = localStorage.getItem('student');
  try {
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setStoredStudent = (student) => {
  localStorage.setItem('student', JSON.stringify(student));
};

// API Helper wrapper
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // If token expired / unauthorized, clear local session
    if (response.status === 401 && endpoint !== '/auth/login') {
      clearAuth();
    }
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Auth API methods
export const registerUser = async (formData) => {
  return await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

export const loginUser = async (credentials) => {
  return await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

// Student API methods
export const getStudentProfile = async () => {
  return await apiRequest('/student/profile', {
    method: 'GET',
  });
};
