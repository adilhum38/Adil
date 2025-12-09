
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../services/mockDatabase';
import { Post, User } from '../types';
import { Heart, MessageCircle, Send, PlusCircle, Star, TrendingUp } from 'lucide-react';
import { generateJobDescription } from '../services/geminiService'; // Reusing for future AI expansion

const CommunityFeed: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const { t, language } = useLanguage();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [trendingUsers, setTrendingUsers] = useState<User[]>([]);

    useEffect(() => {
        setPosts(db.getPosts());
        // Simple algorithm for trending: Sort by Rating then by Completed Projects
        const users = db.getUsers();
        const sorted = [...users].sort((a, b) => (b.rating * 20 + b.completedProjects) - (a.rating * 20 + a.completedProjects));
        setTrendingUsers(sorted.slice(0, 3));
    }, []);

    const handleCreatePost = () => {
        if (!newPostContent.trim() || !user) return;
        
        const newPost: Post = {
            id: Date.now().toString(),
            authorId: user.id,
            authorName: user.name,
            authorUsername: user.username,
            authorAvatar: user.avatar,
            content: newPostContent,
            likes: 0,
            comments: 0,
            createdAt: new Date().toISOString(),
            isLikedByCurrentUser: false
        };

        const created = db.createPost(newPost);
        setPosts([created, ...posts]);
        setNewPostContent('');
    };

    const handleLike = (postId: string) => {
        if (!isAuthenticated) return;
        db.likePost(postId, user!.id);
        // Refresh local state
        setPosts(posts.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    likes: p.isLikedByCurrentUser ? p.likes - 1 : p.likes + 1,
                    isLikedByCurrentUser: !p.isLikedByCurrentUser
                };
            }
            return p;
        }));
    };

    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        return `${Math.floor(diffInSeconds / 86400)}d`;
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column (Feed) - 2/3 Width */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-slate-900">{t('community.feedTitle')}</h2>
                        </div>

                        {/* Create Post Input */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                            {isAuthenticated ? (
                                <div className="flex space-x-4">
                                    <img src={user?.avatar} alt="Me" className="w-10 h-10 rounded-full bg-slate-200 object-cover" />
                                    <div className="flex-1">
                                        <textarea 
                                            value={newPostContent}
                                            onChange={(e) => setNewPostContent(e.target.value)}
                                            placeholder={t('community.whatsHappening')}
                                            rows={2}
                                            className="w-full border-none focus:ring-0 text-slate-900 placeholder-slate-400 resize-none text-lg bg-transparent"
                                        />
                                        <div className="flex justify-between items-center mt-2 border-t border-slate-100 pt-3">
                                            <div className="flex space-x-2 text-slate-400">
                                                {/* Placeholder icons for attachments */}
                                                <button className="hover:text-emerald-600"><PlusCircle size={20} /></button>
                                            </div>
                                            <button 
                                                onClick={handleCreatePost}
                                                disabled={!newPostContent.trim()}
                                                className="bg-emerald-600 text-white px-4 py-1.5 rounded-full font-medium text-sm hover:bg-emerald-700 disabled:opacity-50"
                                            >
                                                {t('community.post')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-slate-500 mb-2">{t('community.loginToPost')}</p>
                                </div>
                            )}
                        </div>

                        {/* Feed Stream */}
                        <div className="space-y-4">
                            {posts.map(post => (
                                <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex space-x-4">
                                        <img src={post.authorAvatar} alt={post.authorName} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="font-bold text-slate-900">{post.authorName}</span>
                                                <span className="text-slate-500 text-sm">{post.authorUsername}</span>
                                                <span className="text-slate-400 text-xs">• {timeAgo(post.createdAt)}</span>
                                            </div>
                                            <p className="text-slate-800 text-base leading-relaxed whitespace-pre-line mb-3">
                                                {post.content}
                                            </p>
                                            
                                            {/* Action Buttons */}
                                            <div className="flex items-center space-x-8 text-slate-500 text-sm">
                                                <button 
                                                    onClick={() => handleLike(post.id)}
                                                    className={`flex items-center space-x-1.5 transition-colors ${post.isLikedByCurrentUser ? 'text-pink-500' : 'hover:text-pink-500'}`}
                                                >
                                                    <Heart size={18} fill={post.isLikedByCurrentUser ? "currentColor" : "none"} />
                                                    <span>{post.likes}</span>
                                                </button>
                                                <button className="flex items-center space-x-1.5 hover:text-emerald-600 transition-colors">
                                                    <MessageCircle size={18} />
                                                    <span>{post.comments}</span>
                                                </button>
                                                <button className="flex items-center space-x-1.5 hover:text-emerald-600 transition-colors">
                                                    <Send size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column (Top Specialists) - 1/3 Width */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
                            <div className="flex items-center mb-6">
                                <TrendingUp className="text-emerald-600 mr-2" size={20} />
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 leading-tight">{t('community.trendingTitle')}</h3>
                                    <p className="text-xs text-slate-500">{t('community.trendingSubtitle')}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {trendingUsers.map((user, index) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                                <div className="absolute -top-1 -right-1 bg-yellow-400 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900 hover:underline cursor-pointer truncate max-w-[120px]">{user.name}</h4>
                                                <div className="flex items-center text-xs text-slate-500">
                                                    <Star size={10} className="text-amber-400 fill-amber-400 mr-1" />
                                                    {user.rating} • {user.completedProjects} {t('community.projects')}
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-xs font-semibold text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full hover:bg-emerald-50">
                                            {t('community.follow')}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                                <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
                                    View all specialists
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityFeed;
