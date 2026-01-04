
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../services/mockDatabase';
import { Post, User } from '../types';
import { Heart, MessageCircle, Send, PlusCircle, Star, TrendingUp, Check } from 'lucide-react';

const CommunityFeed: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [trendingUsers, setTrendingUsers] = useState<User[]>([]);
    const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        setPosts(db.getPosts());
        const users = db.getUsers();
        // Sort by combined score for trending
        const sorted = [...users].sort((a, b) => (b.rating * 10 + b.completedProjects) - (a.rating * 10 + a.completedProjects));
        setTrendingUsers(sorted.slice(0, 5));
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
        if (!isAuthenticated) {
            alert("Please login to interact with posts.");
            return;
        }
        db.likePost(postId, user!.id);
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

    const toggleFollow = (userId: string) => {
        if (!isAuthenticated) {
            alert("Please login to follow specialists.");
            return;
        }
        const updated = new Set(followedIds);
        if (updated.has(userId)) updated.delete(userId);
        else updated.add(userId);
        setFollowedIds(updated);
    };

    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 0) return 'Just now';
        if (diffInSeconds < 60) return `${diffInSeconds}s`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        return `${Math.floor(diffInSeconds / 86400)}d`;
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{t('community.feedTitle')}</h2>
                        </div>

                        {/* Create Post Input */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                            {isAuthenticated ? (
                                <div className="flex space-x-4">
                                    <img src={user?.avatar} alt="Me" className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 object-cover shadow-sm ring-2 ring-white dark:ring-slate-700" />
                                    <div className="flex-1">
                                        <textarea 
                                            value={newPostContent}
                                            onChange={(e) => setNewPostContent(e.target.value)}
                                            placeholder={t('community.whatsHappening')}
                                            rows={2}
                                            className="w-full border-none focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none text-xl bg-transparent font-medium"
                                        />
                                        <div className="flex justify-between items-center mt-4 border-t border-slate-50 dark:border-slate-800 pt-4">
                                            <div className="flex space-x-3 text-slate-400">
                                                <button className="hover:text-emerald-600 transition-colors"><PlusCircle size={22} /></button>
                                            </div>
                                            <button 
                                                onClick={handleCreatePost}
                                                disabled={!newPostContent.trim()}
                                                className="bg-emerald-600 text-white px-8 py-2.5 rounded-2xl font-black text-sm hover:bg-emerald-700 disabled:opacity-30 transition-all shadow-lg shadow-emerald-100 dark:shadow-none transform active:scale-95"
                                            >
                                                {t('community.post')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-500 dark:text-slate-400 font-bold mb-1">{t('community.loginToPost')}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">Join the discussion with other creators</p>
                                </div>
                            )}
                        </div>

                        {/* Feed Stream */}
                        <div className="space-y-4">
                            {posts.length === 0 ? (
                                <div className="text-center py-20 text-slate-400">No posts yet. Start the conversation!</div>
                            ) : (
                                posts.map(post => (
                                    <div key={post.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-emerald-100 dark:hover:border-emerald-900 transition-all group animate-in slide-in-from-bottom-2 duration-300">
                                        <div className="flex space-x-4">
                                            <img src={post.authorAvatar} alt={post.authorName} className="w-12 h-12 rounded-full object-cover border border-slate-50 dark:border-slate-700 shadow-sm" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                                        <span className="font-black text-slate-900 dark:text-slate-100 leading-tight">{post.authorName}</span>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-slate-400 dark:text-slate-500 text-xs font-bold">{post.authorUsername}</span>
                                                            <span className="text-slate-300 dark:text-slate-600 text-[10px] uppercase font-black tracking-widest">• {timeAgo(post.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-slate-800 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-line mb-5 font-medium">
                                                    {post.content}
                                                </p>
                                                
                                                {/* Action Buttons */}
                                                <div className="flex items-center space-x-10 text-slate-400">
                                                    <button 
                                                        onClick={() => handleLike(post.id)}
                                                        className={`flex items-center space-x-2 transition-all ${post.isLikedByCurrentUser ? 'text-pink-500' : 'hover:text-pink-500'}`}
                                                    >
                                                        <Heart size={20} fill={post.isLikedByCurrentUser ? "currentColor" : "none"} className={post.isLikedByCurrentUser ? 'animate-in zoom-in-50 duration-200' : ''} />
                                                        <span className="text-sm font-bold">{post.likes}</span>
                                                    </button>
                                                    <button className="flex items-center space-x-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">
                                                        <MessageCircle size={20} />
                                                        <span className="text-sm font-bold">{post.comments}</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => alert("Post shared to your network!")}
                                                        className="flex items-center space-x-2 hover:text-blue-500 dark:hover:text-blue-400 transition-all"
                                                    >
                                                        <Send size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column (Top Specialists) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 sticky top-24 transition-colors">
                            <div className="flex items-center mb-8">
                                <TrendingUp className="text-emerald-600 dark:text-emerald-500 mr-3" size={24} />
                                <div>
                                    <h3 className="font-black text-xl text-slate-900 dark:text-slate-100 leading-tight">{t('community.trendingTitle')}</h3>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black mt-1">{t('community.trendingSubtitle')}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {trendingUsers.map((tUser, index) => (
                                    <div key={tUser.id} className="flex items-center justify-between group/specialist">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <img src={tUser.avatar} alt={tUser.name} className="w-11 h-11 rounded-full object-cover shadow-sm ring-2 ring-transparent group-hover/specialist:ring-emerald-200 dark:group-hover/specialist:ring-emerald-900 transition-all" />
                                                <div className="absolute -top-1 -right-1 bg-amber-400 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-md">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer truncate max-w-[100px] transition-colors">{tUser.name}</h4>
                                                <div className="flex items-center text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                                    <Star size={10} className="text-amber-400 fill-amber-400 mr-1" />
                                                    {tUser.rating} • {tUser.completedProjects} {t('community.projects')}
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => toggleFollow(tUser.id)}
                                            className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all border ${
                                                followedIds.has(tUser.id) 
                                                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100' 
                                                : 'text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-600 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                                            }`}
                                        >
                                            {followedIds.has(tUser.id) ? (
                                                <span className="flex items-center"><Check size={12} className="mr-1" /> Following</span>
                                            ) : (
                                                t('community.follow')
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 text-center">
                                <button className="text-emerald-600 dark:text-emerald-500 text-xs font-black uppercase tracking-widest hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                                    Browse all creators
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
