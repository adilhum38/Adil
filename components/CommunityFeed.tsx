
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../services/mockDatabase';
import { Post, User, Comment, Message } from '../types';
import { Heart, MessageCircle, Send, PlusCircle, Star, TrendingUp, Check, MoreVertical, Trash2, Edit3, X, Search, MessageSquareShare } from 'lucide-react';

interface FeedProps {
    onMessageAuthor: (user: User) => void;
}

const CommunityFeed: React.FC<FeedProps> = ({ onMessageAuthor }) => {
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [trendingUsers, setTrendingUsers] = useState<User[]>([]);
    const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
    
    // UI States
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [activeCommentsId, setActiveCommentsId] = useState<string | null>(null);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [sharingPostId, setSharingPostId] = useState<string | null>(null);
    const [shareSearch, setShareSearch] = useState('');

    useEffect(() => {
        setPosts(db.getPosts());
        const users = db.getUsers();
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
            commentList: [],
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

    const handleDelete = (postId: string) => {
        // Active delete functionality
        if (window.confirm(t('community.confirmDelete') || 'Are you sure you want to delete this post?')) {
            db.deletePost(postId);
            // Update local state immediately for zero-latency feel
            setPosts(currentPosts => currentPosts.filter(p => p.id !== postId));
        }
    };

    const startEdit = (post: Post) => {
        setEditingPostId(post.id);
        setEditContent(post.content);
    };

    const handleSaveEdit = () => {
        if (!editingPostId) return;
        db.updatePost(editingPostId, editContent);
        setPosts(posts.map(p => p.id === editingPostId ? { ...p, content: editContent } : p));
        setEditingPostId(null);
    };

    const handleAddComment = (postId: string) => {
        if (!newCommentContent.trim() || !user) return;
        const comment: Comment = {
            id: Date.now().toString(),
            authorId: user.id,
            authorName: user.name,
            authorAvatar: user.avatar,
            content: newCommentContent,
            createdAt: new Date().toISOString()
        };
        db.addComment(postId, comment);
        setPosts(posts.map(p => {
            if (p.id === postId) {
                const updatedList = [...(p.commentList || []), comment];
                return { ...p, commentList: updatedList, comments: updatedList.length };
            }
            return p;
        }));
        setNewCommentContent('');
    };

    const handleDirectMessage = (authorId: string) => {
        const author = db.getUsers().find(u => u.id === authorId);
        if (author) onMessageAuthor(author);
    };

    const handleSharePost = (receiverId: string) => {
        if (!user || !sharingPostId) return;
        const msg: Message = {
            id: Date.now().toString(),
            senderId: user.id,
            receiverId,
            content: 'Shared a post with you',
            sharedPostId: sharingPostId,
            createdAt: new Date().toISOString()
        };
        db.sendMessage(msg);
        alert('Post shared successfully!');
        setSharingPostId(null);
    };

    const canEdit = (createdAt: string) => {
        const diff = Date.now() - new Date(createdAt).getTime();
        return diff < 5 * 60 * 1000; // 5 minutes
    };

    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60) return `${diffInSeconds}s`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        return `${Math.floor(diffInSeconds / 86400)}d`;
    };

    const toggleFollow = (userId: string) => {
        if (!isAuthenticated) return;
        const updated = new Set(followedIds);
        if (updated.has(userId)) updated.delete(userId);
        else updated.add(userId);
        setFollowedIds(updated);
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
                            {posts.map(post => (
                                <div key={post.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all animate-in slide-in-from-bottom-2 duration-300 group">
                                    <div className="flex space-x-4">
                                        <img src={post.authorAvatar} alt={post.authorName} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-black text-slate-900 dark:text-slate-100">{post.authorName}</span>
                                                    <span className="text-slate-400 text-xs font-bold">{post.authorUsername}</span>
                                                    <span className="text-slate-300 text-[10px] uppercase font-black">• {timeAgo(post.createdAt)}</span>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    {isAuthenticated && user?.id === post.authorId ? (
                                                        <div className="flex items-center space-x-2">
                                                            {canEdit(post.createdAt) && (
                                                                <button 
                                                                    onClick={() => startEdit(post)} 
                                                                    className="text-slate-400 hover:text-blue-500 transition-colors p-1 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                                                    title={t('community.edit')}
                                                                >
                                                                    <Edit3 size={16} />
                                                                </button>
                                                            )}
                                                            <button 
                                                                onClick={() => handleDelete(post.id)} 
                                                                className="text-slate-400 hover:text-red-500 transition-colors p-1 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                                                title={t('community.delete')}
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleDirectMessage(post.authorId)}
                                                            className="text-slate-400 hover:text-emerald-500 transition-colors p-1 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                                            title="Message Author"
                                                        >
                                                            <MessageSquareShare size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {editingPostId === post.id ? (
                                                <div className="space-y-3">
                                                    <textarea 
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                                                    />
                                                    <div className="flex space-x-2">
                                                        <button onClick={handleSaveEdit} className="text-xs font-bold bg-emerald-600 text-white px-4 py-1.5 rounded-lg">Save</button>
                                                        <button onClick={() => setEditingPostId(null)} className="text-xs font-bold text-slate-400">Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-slate-800 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-line mb-5 font-medium">
                                                    {post.content}
                                                </p>
                                            )}
                                            
                                            <div className="flex items-center space-x-10 text-slate-400">
                                                <button onClick={() => handleLike(post.id)} className={`flex items-center space-x-2 transition-all ${post.isLikedByCurrentUser ? 'text-pink-500' : 'hover:text-pink-500'}`}>
                                                    <Heart size={20} fill={post.isLikedByCurrentUser ? "currentColor" : "none"} />
                                                    <span className="text-sm font-bold">{post.likes}</span>
                                                </button>
                                                <button onClick={() => setActiveCommentsId(activeCommentsId === post.id ? null : post.id)} className="flex items-center space-x-2 hover:text-emerald-600 transition-all">
                                                    <MessageCircle size={20} />
                                                    <span className="text-sm font-bold">{post.comments}</span>
                                                </button>
                                                <button onClick={() => setSharingPostId(post.id)} className="flex items-center space-x-2 hover:text-blue-500 transition-all">
                                                    <Send size={20} />
                                                </button>
                                            </div>

                                            {/* Comments Section */}
                                            {activeCommentsId === post.id && (
                                                <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                                    {post.commentList?.map(c => (
                                                        <div key={c.id} className="flex space-x-3">
                                                            <img src={c.authorAvatar} className="w-8 h-8 rounded-full" alt="" />
                                                            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <span className="font-bold text-xs dark:text-slate-200">{c.authorName}</span>
                                                                    <span className="text-[10px] text-slate-400">{timeAgo(c.createdAt)}</span>
                                                                </div>
                                                                <p className="text-sm text-slate-700 dark:text-slate-400">{c.content}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    
                                                    {isAuthenticated && (
                                                        <div className="flex items-center space-x-3 mt-4">
                                                            <img src={user?.avatar} className="w-8 h-8 rounded-full" alt="" />
                                                            <div className="flex-1 relative">
                                                                <input 
                                                                    type="text" 
                                                                    value={newCommentContent}
                                                                    onChange={(e) => setNewCommentContent(e.target.value)}
                                                                    placeholder="Write a comment..."
                                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-full py-2 px-4 text-sm focus:ring-1 focus:ring-emerald-500 dark:text-slate-100"
                                                                />
                                                                <button onClick={() => handleAddComment(post.id)} className="absolute right-3 top-2 text-emerald-600">
                                                                    <PlusCircle size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        {/* Trending Specialists Sidebar */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 sticky top-24">
                            <div className="flex items-center mb-8">
                                <TrendingUp className="text-emerald-600 mr-3" size={24} />
                                <h3 className="font-black text-xl dark:text-slate-100">{t('community.trendingTitle')}</h3>
                            </div>
                            <div className="space-y-6">
                                {trendingUsers.map((tUser, idx) => (
                                    <div key={tUser.id} className="flex items-center justify-between group">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <img src={tUser.avatar} className="w-11 h-11 rounded-full object-cover shadow-sm" alt="" />
                                                <span className="absolute -top-1 -right-1 bg-amber-400 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black">{idx+1}</span>
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-sm dark:text-slate-100 truncate">{tUser.name}</h4>
                                                <p className="text-[10px] text-slate-400"><Star size={10} className="inline mr-1" />{tUser.rating}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => toggleFollow(tUser.id)} className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${followedIds.has(tUser.id) ? 'bg-slate-900 text-white border-slate-900' : 'text-emerald-600 border-emerald-100'}`}>
                                            {followedIds.has(tUser.id) ? 'Following' : 'Follow'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sharing Modal */}
            {sharingPostId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-black dark:text-slate-100">Send to Friends</h3>
                            <button onClick={() => setSharingPostId(null)} className="text-slate-400 hover:text-red-500"><X size={20} /></button>
                        </div>
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by name..." 
                                value={shareSearch}
                                onChange={(e) => setShareSearch(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-10 py-2.5 focus:ring-1 focus:ring-emerald-500 dark:text-slate-100"
                            />
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
                            {db.getUsers().filter(u => u.id !== user?.id && u.name.toLowerCase().includes(shareSearch.toLowerCase())).map(u => (
                                <div key={u.id} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl cursor-pointer" onClick={() => handleSharePost(u.id)}>
                                    <div className="flex items-center space-x-3">
                                        <img src={u.avatar} className="w-10 h-10 rounded-full" alt="" />
                                        <span className="font-bold text-sm dark:text-slate-200">{u.name}</span>
                                    </div>
                                    <button className="text-xs font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">Send</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityFeed;
