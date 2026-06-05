import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

export const getExpenses = (filters = {}) => {
  return api.get('/expenses', { params: filters });
};

export const getSummary = () => {
  return api.get('/expenses/summary');
};

export const createExpense = (data) => {
  return api.post('/expenses', data);
};

export const updateExpense = (id, data) => {
  return api.put(`/expenses/${id}`, data);
};

export const deleteExpense = (id) => {
  return api.delete(`/expenses/${id}`);
};