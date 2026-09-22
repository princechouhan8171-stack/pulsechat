import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

const resolveSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL && import.meta.env.VITE_SOCKET_URL.trim()) return import.meta.env.VITE_SOCKET_URL.trim().replace(/\/$/, '');
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) {
    try { return new URL(import.meta.env.VITE_API_URL.trim()).origin; } catch {}
  }
  return window.location.origin;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let socketInstance = null;
    if (isAuthenticated && user) {
      const socketUrl = resolveSocketUrl();
      socketInstance = io(socketUrl, { transports:['websocket','polling'], withCredentials:true, reconnection:true, reconnectionAttempts:15, reconnectionDelay:1000, reconnectionDelayMax:5000, timeout:20000 });
      socketInstance.on('connect', () => { setIsConnected(true); socketInstance.emit('setup', user); });
      socketInstance.on('connected', (data) => { if (data?.onlineUsers) setOnlineUsers(data.onlineUsers); });
      socketInstance.on('online-users', (users) => setOnlineUsers(users));
      socketInstance.on('disconnect', () => setIsConnected(false));
      socketInstance.on('connect_error', (err) => console.warn('[Socket Connection Error]:', err.message));
      setSocket(socketInstance);
    } else if (socket) {
      socket.disconnect(); setSocket(null); setIsConnected(false); setOnlineUsers([]);
    }
    return () => { if (socketInstance) socketInstance.disconnect(); };
  }, [isAuthenticated, user?._id]);

  const isUserOnline = (userId) => !!userId && onlineUsers.includes(userId.toString());

  return <SocketContext.Provider value={{socket,onlineUsers,isUserOnline,isConnected}}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};