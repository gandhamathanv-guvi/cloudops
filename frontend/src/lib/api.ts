import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  signup: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },
  getUser: async () => {
    const response = await api.get('/auth/user');
    console.log("response", response)
    return response.data;
  },
};

export const coursesApi = {
  getAll: async () => {
    const response = await api.get('/courses');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
  getCheckpoints: async (courseId: string) => {
    const response = await api.get(`/courses/${courseId}/checkpoints`);
    return response.data;
  },
  verifyCheckpoint: async (courseId: string, checkpointId: string) => {
    const response = await api.post(`/courses/${courseId}/checkpoints/${checkpointId}/verify`);
    return response.data;
  },
};


export const labApi = {
  getById: async (id: string) => {
    const response = await api.get(`/labs/${id}`);
    return response.data;
  },
  getLabStatus: async (id: string) => {
    const response = await api.get(`/labs/checkstatus/${id}`);
    return response.data;
  },
};

export const testApi = {
  startLab: async (labId: string) => {
    try {
      const response = await api.post('/lab/start', { lab_id: labId });
      return response.data;
    } catch (error) {
      console.error('Error starting lab:', error);
      throw error;
    }
  },

  endLab: async (testId: string) => {
    try {
      const response = await api.post('/lab/end', { test_id: testId });
      return response.data;
    } catch (error) {
      console.error('Error ending lab:', error);
      throw error;
    }
  },
};

export default api;