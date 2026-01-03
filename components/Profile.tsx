
import React, { useState, useEffect } from 'react';
import { User, UserRole, City, PortfolioItem } from '../types';
import { analyzeProfileImprovement } from '../services/geminiService';
import { Edit2, Sparkles, MapPin, Mail, Phone, CheckCircle, Save, Plus, Trash2, Layout, Video as VideoIcon, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
    const { t, language } = useLanguage();
    const { user: authUser, updateProfile } = useAuth();
    
    const [user, setUser] = useState<User | null>(authUser);
    const [isEditing, setIsEditing] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    // New Portfolio Item State
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItemTitle, setNewItemTitle] = useState('');
    const [newItemType, setNewItemType] = useState<'image' | 'video'>('image');
    const [newItemUrl, setNewItemUrl] = useState('');

    useEffect(() => {
        if (authUser) setUser(authUser);
    }, [authUser]);

    const handleImproveBio = async () => {
        if (!user?.bio) return;
        setIsAiLoading(true);
        const improvedBio = await analyzeProfileImprovement(user.bio, language);
        setUser({ ...user, bio: improvedBio });
        setIsAiLoading(false);
    };

    const handleSave = () => {
        if (user) {
            updateProfile(user);
            setIsEditing(false);
        }
    };

    const handleAddPortfolioItem = () => {
        if (!newItemUrl || !user) return;
        
        const item: PortfolioItem = {
            id: Date.now().toString(),
            title: newItemTitle,
            type: newItemType,
            url: newItemUrl,
            thumbnail: newItemUrl, // In a real app, we'd generate a thumb
            likes: 0
        };

        const updatedUser = {
            ...user,
            portfolio: [item, ...user.portfolio]
        };
        
        setUser(updatedUser);
        updateProfile(updatedUser);
        
        // Reset
        setNewItemTitle('');
        setNewItemUrl('');
        setShowAddModal(false);
    };

    const handleRemovePortfolioItem = (id: string) => {
        if (!user) return;
        const updatedUser = {
            ...user,
            portfolio: user.portfolio.filter(item => item.id !== id)
        };
        setUser(updatedUser);
        updateProfile(updatedUser);
    };

    if (!user) return <div className="p-8 text-center">Please log in to view your profile.</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Main Profile Info Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                    {/* Banner */}
                    <div className="h-40 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600"></div>
                    
                    <div className="relative px-8 pb-8">
                        <div className="flex justify-between items-end -mt-16 mb-8">
                            <div className="relative">
                                <img 
                                    className="h-32 w-32 rounded-3xl ring-8 ring-white object-cover bg-white shadow-xl"
                                    src={user.avatar}
                                    alt={user.name}
                                />
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg border-4 border-white">
                                    <CheckCircle size={20} />
                                </div>
                            </div>
                            <button 
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className={`px-6 py-2.5 rounded-2xl text-sm font-black tracking-tight transition-all flex items-center shadow-lg ${isEditing ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'}`}
                            >
                                {isEditing ? (
                                    <><Save size={18} className="mr-2" /> {t('profile.save')}</>
                                ) : (
                                    <><Edit2 size={18} className="mr-2" /> {t('profile.edit')}</>
                                )}
                            </button>
                        </div>

                        <div className="mb-8">
                            {isEditing ? (
                                <input 
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => setUser({...user, name: e.target.value})}
                                    className="block w-full text-4xl font-black text-slate-900 border-b-2 border-slate-100 focus:border-emerald-500 outline-none mb-3 bg-slate-50 p-2 rounded-t-xl"
                                />
                            ) : (
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                            )}
                            
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                {isEditing ? (
                                    <input 
                                        type="text"
                                        value={user.title || ''}
                                        onChange={(e) => setUser({...user, title: e.target.value})}
                                        className="block flex-1 text-lg text-emerald-600 font-bold border-b border-slate-100 focus:border-emerald-500 outline-none bg-slate-50 p-2 rounded-t-lg"
                                        placeholder="Professional Title (e.g. Senior Videographer)"
                                    />
                                ) : (
                                    <p className="text-lg text-emerald-600 font-bold uppercase tracking-wide">{user.title}</p>
                                )}
                                
                                <div className="flex items-center text-slate-400 text-sm font-bold bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                    <MapPin size={16} className="mr-1 text-slate-400" /> {user.city}
                                </div>
                                <div className="flex items-center text-emerald-700 text-xs font-black uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                    {t('profile.available')}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-50 pt-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('profile.about')}</h3>
                                {isEditing && (
                                    <button 
                                        onClick={handleImproveBio}
                                        disabled={isAiLoading}
                                        className="bg-purple-50 text-purple-700 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center hover:bg-purple-100 transition-all border border-purple-100"
                                    >
                                        <Sparkles size={14} className="mr-2" />
                                        {isAiLoading ? t('profile.optimizing') : t('profile.improveAi')}
                                    </button>
                                )}
                            </div>
                            
                            {isEditing ? (
                                <textarea 
                                    className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-slate-50 transition-all text-slate-700 leading-relaxed font-medium"
                                    rows={5}
                                    value={user.bio || ''}
                                    onChange={(e) => setUser({...user, bio: e.target.value})}
                                    placeholder="Tell the community about your journey and expertise..."
                                />
                            ) : (
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg font-medium">
                                    {user.bio || 'Sharing creative passion...'}
                                </p>
                            )}
                        </div>

                        <div className="border-t border-slate-50 pt-8 mt-8">
                             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">{t('profile.skills')}</h3>
                             <div className="flex flex-wrap gap-2">
                                {user.skills.map(skill => (
                                    <span key={skill} className="inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                        <CheckCircle size={14} className="mr-2 text-emerald-500" />
                                        {skill}
                                    </span>
                                ))}
                                {isEditing && (
                                    <button className="text-xs font-black uppercase tracking-widest border-2 border-dashed border-slate-300 px-4 py-1.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-600 transition-all">
                                        + Add Skill
                                    </button>
                                )}
                             </div>
                        </div>
                    </div>
                </div>

                {/* Portfolio Management Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-3">
                            <Layout className="text-emerald-600" size={24} />
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('profile.portfolio')}</h3>
                        </div>
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="bg-emerald-600 text-white px-6 py-2.5 rounded-2xl text-sm font-black tracking-tight hover:bg-emerald-700 transition-all flex items-center shadow-lg shadow-emerald-100"
                        >
                            <Plus size={18} className="mr-2" /> {t('profile.addItem')}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user.portfolio.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                <Layout size={48} className="mx-auto mb-4 text-slate-200" />
                                <p className="text-slate-400 font-bold">{t('profile.noItems')}</p>
                            </div>
                        ) : (
                            user.portfolio.map((item) => (
                                <div key={item.id} className="relative group rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-100 hover:shadow-xl transition-all">
                                    <img src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                                        <div className="flex justify-end">
                                            <button 
                                                onClick={() => handleRemovePortfolioItem(item.id)}
                                                className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2 text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">
                                                {item.type === 'video' ? <VideoIcon size={12} /> : <ImageIcon size={12} />}
                                                <span>{item.type}</span>
                                            </div>
                                            <h4 className="text-white font-black text-sm truncate">{item.title || 'Untitled Project'}</h4>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Add Portfolio Item Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-slate-900">{t('profile.addItem')}</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-red-500">
                                <Trash2 size={24} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">{t('profile.projectTitle')}</label>
                                <input 
                                    type="text" 
                                    value={newItemTitle}
                                    onChange={(e) => setNewItemTitle(e.target.value)}
                                    placeholder="e.g. Summer Branding Campaign"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">{t('profile.projectType')}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => setNewItemType('image')}
                                        className={`flex items-center justify-center space-x-2 p-3 rounded-xl border-2 transition-all font-bold ${newItemType === 'image' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-400'}`}
                                    >
                                        <ImageIcon size={18} />
                                        <span>{t('profile.image')}</span>
                                    </button>
                                    <button 
                                        onClick={() => setNewItemType('video')}
                                        className={`flex items-center justify-center space-x-2 p-3 rounded-xl border-2 transition-all font-bold ${newItemType === 'video' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-400'}`}
                                    >
                                        <VideoIcon size={18} />
                                        <span>{t('profile.video')}</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">{t('profile.projectUrl')}</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={newItemUrl}
                                        onChange={(e) => setNewItemUrl(e.target.value)}
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                    />
                                    <ExternalLink className="absolute right-3 top-3.5 text-slate-300" size={18} />
                                </div>
                                <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tip: Use high-quality Unsplash URLs for best results</p>
                            </div>

                            <button 
                                onClick={handleAddPortfolioItem}
                                disabled={!newItemUrl}
                                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 mt-4"
                            >
                                Publish to Portfolio
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
