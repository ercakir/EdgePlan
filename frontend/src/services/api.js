import axios from 'axios';
import {
  mockResources,
  mockOrders,
  simulateOptimization,
  getMockChatResponse
} from './mockData';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1500, // Quick timeout to detect offline/demo mode without lagging UI
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSystemStatus = async () => {
  try {
    const response = await apiClient.get('/status');
    return response.data;
  } catch (err) {
    console.warn('[EdgePlan-AI] Local Spring Boot unreachable. Operating in High-Fidelity Demo Simulation Mode.');
    return {
      status: 'UP',
      mode: 'SPRING_BOOT_SIMULATED',
      message: 'Spring Boot Simülatörü Aktif (Canlı Demo)'
    };
  }
};

export const getResources = async () => {
  try {
    const response = await apiClient.get('/resources');
    return response.data;
  } catch (err) {
    return mockResources;
  }
};

export const getOrders = async () => {
  try {
    const response = await apiClient.get('/orders');
    return response.data;
  } catch (err) {
    return mockOrders;
  }
};

export const getBaselineSchedule = async () => {
  try {
    const response = await apiClient.get('/baseline');
    return response.data;
  } catch (err) {
    return simulateOptimization({});
  }
};

export const sendChatMessage = async (queryText) => {
  try {
    const response = await apiClient.post('/chat', { query: queryText });
    return response.data;
  } catch (err) {
    return {
      response: getMockChatResponse(queryText),
      timestamp: new Date().toISOString()
    };
  }
};

export const runOptimization = async (payload, instructionText = '') => {
  try {
    const url = instructionText ? `/optimize?instructionText=${encodeURIComponent(instructionText)}` : '/optimize';
    const response = await apiClient.post(url, payload || {});
    return response.data;
  } catch (err) {
    return simulateOptimization(payload || {});
  }
};
