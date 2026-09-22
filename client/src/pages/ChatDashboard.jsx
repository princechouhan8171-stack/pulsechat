import React,{useEffect,useState}from'react';
import Sidebar from'../components/Sidebar';import ChatArea from'../components/ChatArea';import EmptyChat from'../components/EmptyChat';
import {getMessages} from'../services/chatService';import {useSocket} from'../context/SocketContext';import {useAuth} from'../context/AuthContext';
export default function ChatDashboard(){const[c,setC]=useState(null),[m,setM]=useState([]),{socket}=useSocket(),{user}=useAuth();
useEffect(()=>{if(c)getMessages(c._id).then(setM).catch(()=>{})},[c]);
useEffect(()=>{if(!socket)return;const fn=x=>setM(v=>v.some(y=>y._id===x._id)?v:[...v,x]);socket.on('message-received',fn);socket.on('message-sent',fn);return()=>{socket.off('message-received',fn);socket.off('message-sent',fn)}},[socket]);
const other=c?.participants?.find(p=>p._id!==user?._id);
return <div className="h-screen flex"><Sidebar activeConversation={c} onSelectConversation={setC}/>{c&&other?<ChatArea conversation={c} messages={m} onSendMessage={t=>socket.emit('send-message',{conversationId:c._id,text:t,receiverId:other._id,senderId:user._id})}/>:<EmptyChat/>}</div>}