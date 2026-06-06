import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const predictImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await api.post('/predict', formData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to process image. Please try again.'
    );
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch {
    throw new Error('API is not responding');
  }
};

export default api;
