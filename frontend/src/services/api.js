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
    const mockRes = getMockChatResponse(queryText);
    return {
      responseAdvice: mockRes.text,
      suggestedRequest: mockRes.suggestedRequest,
      timestamp: new Date().toISOString()
    };
  }
};

export const inspectIntent = async (textInstruction) => {
  try {
    const response = await apiClient.post('/intent/inspect', { textInstruction });
    return response.data;
  } catch (err) {
    const mockRes = getMockChatResponse(textInstruction);
    return {
      detectedIntent: mockRes.intent || 'MAKESPAN_MINIMIZATION',
      grounded: true,
      riskAssessment: 'DÜŞÜK RİSK',
      entityValidationResults: [
        { fieldName: 'objectiveType', rawValue: mockRes.suggestedRequest?.objectiveType || 'MAKESPAN', valid: true, errorMessage: null }
      ],
      validationMessage: 'Talebiniz fabrika kısıtları ve veri tabanı varlıkları ile doğrulandı (Grounded).'
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
