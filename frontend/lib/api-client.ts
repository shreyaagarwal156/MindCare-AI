import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds (for longer LLM chat and report generation queries)
});

// Interceptor for error handling can be configured here if necessary
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors or dispatch alerts
    console.error('API Error:', error.response?.data?.detail || error.message);
    return Promise.reject(error);
  }
);
