// Backend-ready API abstraction. Set VITE_API_BASE_URL when the production API is available.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.status === 204 ? null : response.json();
}

export const api = {
  getAvailability: () => request('/api/availability'),
  saveAvailability: (payload) => request('/api/availability', { method: 'PUT', body: JSON.stringify(payload) }),
  getCleaners: (params = {}) => request(`/api/cleaners?${new URLSearchParams(params)}`),
  createAssignment: (payload) => request('/api/assignments', { method: 'POST', body: JSON.stringify(payload) }),
  getAssignments: () => request('/api/assignments')
};
