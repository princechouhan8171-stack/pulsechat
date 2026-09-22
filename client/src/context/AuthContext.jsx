import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser, registerUser, logoutUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => { const saved = localStorage.getItem('user'); return saved ? JSON.parse(saved) : null; });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try { const res = await getMe(); if (res?.user) { setUser(res.user); localStorage.setItem('user', JSON.stringify(res.user)); } }
        catch { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); setToken(null); }
      }
      setLoading(false);
    };
    verifySession();
  }, []);

  const login = async (identifier, password) => {
    setAuthError(null);
    try { const data = await loginUser({ identifier, password }); setUser(data.user); setToken(data.token); localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); return {success:true,user:data.user}; }
    catch (err) { const message = err.response?.data?.message || 'Login failed. Please check your credentials.'; setAuthError(message); return {success:false,message}; }
  };

  const register = async (formData) => {
    setAuthError(null);
    try { const data = await registerUser(formData); setUser(data.user); setToken(data.token); localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); return {success:true,user:data.user}; }
    catch (err) { const message = err.response?.data?.message || 'Registration failed. Please try again.'; setAuthError(message); return {success:false,message}; }
  };

  const logout = async () => {
    try { await logoutUser(); } catch (err) { console.warn('Server logout notice failed:', err.message); }
    finally { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); setToken(null); }
  };

  const updateUser = (updatedFields) => setUser((prev) => { const updated={...prev,...updatedFields}; localStorage.setItem('user',JSON.stringify(updated)); return updated; });

  return <AuthContext.Provider value={{user,token,isAuthenticated:!!token&&!!user,loading,authError,setAuthError,login,register,logout,updateUser}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};