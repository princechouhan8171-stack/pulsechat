import api from './api';

export const getConversations = async () => (await api.get('/conversations')).data.conversations;
export const createOrGetConversation = async (userId) => (await api.post('/conversations', { userId })).data.conversation;
export const getConversationById = async (id) => (await api.get(`/conversations/${id}`)).data.conversation;
export const getMessages = async (conversationId) => (await api.get(`/messages/${conversationId}`)).data.messages;
export const sendMessage = async (messageData) => (await api.post('/messages', messageData)).data.message;
export const searchUsers = async (query = '') => (await api.get(`/users${query ? `?search=${encodeURIComponent(query)}` : ''}`)).data.users;
export const getUserById = async (id) => (await api.get(`/users/${id}`)).data.user;
export const updateProfile = async (profileData) => (await api.put('/users/profile', profileData)).data;