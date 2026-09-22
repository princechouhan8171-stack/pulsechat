import api from './api';

export const registerUser = async (userData) => (await api.post('/auth/register', userData)).data;
export const loginUser = async (credentials) => (await api.post('/auth/login', credentials)).data;
export const getMe = async () => (await api.get('/auth/me')).data;
export const logoutUser = async () => (await api.post('/auth/logout')).data;