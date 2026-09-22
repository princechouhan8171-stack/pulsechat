import React from 'react';
import { useAuth } from '../context/AuthContext';
export default function ProfilePage(){const {user}=useAuth();return <div className="p-8"><h1 className="text-2xl font-bold">Profile</h1><p>{user?.name}</p><p>@{user?.username}</p><p>{user?.email}</p></div>}