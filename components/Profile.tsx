import React, { useState, useEffect } from 'react';
import { User, UserRole, City } from '../types';
import { analyzeProfileImprovement } from '../services/geminiService';
import { Edit2, Sparkles, MapPin, Mail, Phone, CheckCircle, Save } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
    const { t, language } = useLanguage();
    const { user: authUser, updateProfile } = useAuth();
    
    const [user, setUser] = useState<User | null>(authUser);
    const [isEditing, setIsEditing] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);

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

    if (!user) return <div className="p-8 text-center">Please log in to view your profile.</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    {/* Banner */}
                    <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                    
                    <div className="relative px-6 pb-6">
                        <div className="flex justify-between items-end -mt-12 mb-6">
                            <img 
                                className="h-24 w-24 rounded-full ring-4 ring-white object-cover bg-white"
                                src={user.avatar}
                                alt={user.name}
                            />
                            <button 
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className={`px-4 py-2 border rounded-md text-sm font-medium shadow-sm transition-colors flex items-center ${isEditing ? 'bg-emerald-600 text-white border-transparent hover:bg-emerald-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                            >
                                {isEditing ? (
                                    <><Save size={16} className="inline mr-2" /> {t('profile.save')}</>
                                ) : (
                                    <><Edit2 size={16} className="inline mr-2" /> {t('profile.edit')}</>
                                )}
                            </button>
                        </div>

                        <div className="mb-6">
                            {isEditing ? (
                                <input 
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => setUser({...user, name: e.target.value})}
                                    className="block w-full text-3xl font-bold text-slate-900 border-b-2 border-slate-200 focus:border-emerald-500 outline-none mb-2"
                                />
                            ) : (
                                <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                            )}
                            
                            {isEditing ? (
                                <input 
                                    type="text"
                                    value={user.title || ''}
                                    onChange={(e) => setUser({...user, title: e.target.value})}
                                    className="block w-full text-lg text-emerald-600 font-medium border-b border-slate-200 focus:border-emerald-500 outline-none"
                                    placeholder="Your professional title"
                                />
                            ) : (
                                <p className="text-lg text-emerald-600 font-medium">{user.title}</p>
                            )}

                            <div className="flex items-center mt-2 text-slate-500 text-sm">
                                <MapPin size={16} className="mr-1" /> {user.city}
                                <span className="mx-2">•</span>
                                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">{t('profile.available')}</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold text-slate-900">{t('profile.about')}</h3>
                                {isEditing && (
                                    <button 
                                        onClick={handleImproveBio}
                                        disabled={isAiLoading}
                                        className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-800"
                                    >
                                        <Sparkles size={14} className="mr-1" />
                                        {isAiLoading ? t('profile.optimizing') : t('profile.improveAi')}
                                    </button>
                                )}
                            </div>
                            
                            {isEditing ? (
                                <textarea 
                                    className="w-full border-slate-300 rounded-md shadow-sm p-3 focus:ring-emerald-500 focus:border-emerald-500 border"
                                    rows={4}
                                    value={user.bio || ''}
                                    onChange={(e) => setUser({...user, bio: e.target.value})}
                                    placeholder="Tell clients about yourself..."
                                />
                            ) : (
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                    {user.bio || 'No bio added yet.'}
                                </p>
                            )}
                        </div>

                        <div className="border-t border-slate-100 pt-6 mt-6">
                             <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('profile.skills')}</h3>
                             <div className="flex flex-wrap gap-2">
                                {user.skills.map(skill => (
                                    <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                                        <CheckCircle size={14} className="mr-1 text-emerald-500" />
                                        {skill}
                                    </span>
                                ))}
                                {isEditing && (
                                    <button className="text-xs border border-dashed border-slate-400 px-3 py-1 rounded-full text-slate-500 hover:text-emerald-600 hover:border-emerald-600">
                                        + Add Skill
                                    </button>
                                )}
                             </div>
                        </div>

                         <div className="border-t border-slate-100 pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-lg flex items-center">
                                <div className="p-2 bg-white rounded-full shadow-sm mr-3">
                                    <Mail className="text-emerald-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">{t('profile.email')}</p>
                                    <p className="text-sm font-medium text-slate-900">{user.email}</p>
                                </div>
                            </div>
                             <div className="p-4 bg-slate-50 rounded-lg flex items-center">
                                <div className="p-2 bg-white rounded-full shadow-sm mr-3">
                                    <Phone className="text-emerald-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">{t('profile.phone')}</p>
                                    <p className="text-sm font-medium text-slate-900">+7 777 123 45 67</p>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;