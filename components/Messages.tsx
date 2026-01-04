
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../services/mockDatabase';
import { Message, User, Post } from '../types';
import { Search, Send, ArrowLeft, MoreHorizontal, User as UserIcon, MessageSquare } from 'lucide-react';

interface MessagesProps {
    initialRecipient?: User | null;
    onClearRecipient?: () => void;
}

const Messages: React.FC<MessagesProps> = ({ initialRecipient, onClearRecipient }) => {
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const [conversations, setConversations] = useState<{ user: User, lastMessage: Message }[]>([]);
    const [activeConversation, setActiveConversation] = useState<User | null>(null);
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) {
            loadConversations();
            setAllPosts(db.getPosts());
            
            // If we came here from a "Message Author" or "Message Client" link
            if (initialRecipient) {
                setActiveConversation(initialRecipient);
                onClearRecipient?.();
            }
        }
    }, [user, initialRecipient]);

    useEffect(() => {
        if (activeConversation && user) {
            loadChatHistory();
        }
    }, [activeConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const loadConversations = () => {
        if (user) {
            const convs = db.getConversations(user.id);
            setConversations(convs);
        }
    };

    const loadChatHistory = () => {
        if (user && activeConversation) {
            const history = db.getChatHistory(user.id, activeConversation.id);
            setChatHistory(history);
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !user || !activeConversation) return;

        const msg: Message = {
            id: Date.now().toString(),
            senderId: user.id,
            receiverId: activeConversation.id,
            content: newMessage,
            createdAt: new Date().toISOString()
        };

        db.sendMessage(msg);
        setNewMessage('');
        loadChatHistory();
        loadConversations();
    };

    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60) return 'now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        return `${Math.floor(diffInSeconds / 86400)}d`;
    };

    if (!isAuthenticated) {
        return <div className="flex items-center justify-center min-h-[70vh] dark:text-slate-100">Please log in to use messages.</div>;
    }

    const filteredConversations = conversations.filter(c => 
        c.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSharedPost = (postId?: string) => {
        if (!postId) return null;
        return allPosts.find(p => p.id === postId);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)] flex gap-4 transition-colors">
            {/* Sidebar */}
            <div className={`w-full lg:w-1/3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden transition-all ${activeConversation ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-6 border-b border-slate-50 dark:border-slate-800">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-10 py-2.5 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 text-sm outline-none transition-all"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredConversations.length === 0 && !activeConversation ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                            <MessageSquare size={40} className="mb-4 opacity-20" />
                            <p className="font-bold">No conversations yet</p>
                            <p className="text-xs">Start a chat from the directory or feed!</p>
                        </div>
                    ) : (
                        <>
                            {activeConversation && !conversations.some(c => c.user.id === activeConversation.id) && (
                                <div 
                                    className={`p-4 flex items-center space-x-3 cursor-pointer bg-slate-50 dark:bg-slate-800/50 transition-colors border-l-4 border-emerald-500`}
                                >
                                    <img src={activeConversation.avatar} className="w-12 h-12 rounded-full object-cover border border-slate-100 dark:border-slate-700" alt="" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate text-sm">{activeConversation.name}</h3>
                                        </div>
                                        <p className="text-xs text-emerald-500 italic font-medium">New Conversation</p>
                                    </div>
                                </div>
                            )}
                            {filteredConversations.map(conv => (
                                <div 
                                    key={conv.user.id}
                                    onClick={() => setActiveConversation(conv.user)}
                                    className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-l-4 ${activeConversation?.id === conv.user.id ? 'border-emerald-500 bg-slate-50 dark:bg-slate-800/50' : 'border-transparent'}`}
                                >
                                    <img src={conv.user.avatar} className="w-12 h-12 rounded-full object-cover border border-slate-100 dark:border-slate-700" alt="" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate text-sm">{conv.user.name}</h3>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">{timeAgo(conv.lastMessage.createdAt)}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                                            {conv.lastMessage.senderId === user?.id ? 'You: ' : ''}{conv.lastMessage.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden transition-all ${!activeConversation ? 'hidden lg:flex items-center justify-center' : 'flex'}`}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
                            <div className="flex items-center space-x-3">
                                <button onClick={() => setActiveConversation(null)} className="lg:hidden text-slate-400 mr-2">
                                    <ArrowLeft size={24} />
                                </button>
                                <img src={activeConversation.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">{activeConversation.name}</h3>
                                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Online</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/20">
                            {chatHistory.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-30">
                                    <MessageSquare size={40} />
                                    <p className="text-sm font-bold">Start your conversation with {activeConversation.name}</p>
                                </div>
                            ) : (
                                chatHistory.map((msg, idx) => {
                                    const isMine = msg.senderId === user?.id;
                                    const sharedPost = getSharedPost(msg.sharedPostId);
                                    return (
                                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                            <div className={`max-w-[80%] lg:max-w-[70%] group`}>
                                                <div className={`rounded-2xl p-4 shadow-sm ${isMine ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-700'}`}>
                                                    
                                                    {sharedPost && (
                                                        <div className={`mb-3 rounded-xl overflow-hidden border ${isMine ? 'bg-white/10 border-white/20' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
                                                            <div className="p-3">
                                                                <div className="flex items-center space-x-2 mb-2">
                                                                    <img src={sharedPost.authorAvatar} className="w-6 h-6 rounded-full" alt="" />
                                                                    <span className={`text-[10px] font-black ${isMine ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>{sharedPost.authorUsername}</span>
                                                                </div>
                                                                <p className={`text-[11px] line-clamp-2 ${isMine ? 'text-white/80' : 'text-slate-500'}`}>{sharedPost.content}</p>
                                                            </div>
                                                            <div className={`text-center py-1.5 text-[9px] font-black uppercase tracking-widest border-t ${isMine ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'} cursor-pointer transition-colors`}>
                                                                View Thread
                                                            </div>
                                                        </div>
                                                    )}

                                                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                                    <div className={`text-[9px] mt-1.5 font-bold uppercase ${isMine ? 'text-white/60 text-right' : 'text-slate-400'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800 flex items-center space-x-3 transition-colors">
                            <input 
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm focus:ring-1 focus:ring-emerald-500 dark:text-slate-100 outline-none transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="bg-emerald-600 text-white p-3 rounded-2xl hover:bg-emerald-700 disabled:opacity-30 transition-all shadow-lg shadow-emerald-100 dark:shadow-none"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <UserIcon size={32} className="opacity-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2">Select a chat to start messaging</h3>
                        <p className="text-sm max-w-xs">Your messages are private and visible only to you and the recipient.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
