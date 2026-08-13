const API_BASE = 'http://localhost:5000/api';

export const apiFetch = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Ensures HttpOnly cookies are sent
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.warn(`API Error on ${endpoint}:`, err);
    return { ok: false, status: 500, data: { message: 'Network or API error' } };
  }
};
