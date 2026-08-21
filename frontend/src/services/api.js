import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSystemStatus = async () => {
  const response = await apiClient.get('/status');
  return response.data;
};

export const getResources = async () => {
  const response = await apiClient.get('/resources');
  return response.data;
};

export const getOrders = async () => {
  const response = await apiClient.get('/orders');
  return response.data;
};

export const getBaselineSchedule = async () => {
  const response = await apiClient.get('/baseline');
  return response.data;
};

export const sendChatMessage = async (queryText) => {
  const response = await apiClient.post('/chat', { query: queryText });
  return response.data;
};

export const runOptimization = async (payload, instructionText = '') => {
  const url = instructionText ? `/optimize?instructionText=${encodeURIComponent(instructionText)}` : '/optimize';
  const response = await apiClient.post(url, payload || {});
  return response.data;
};
