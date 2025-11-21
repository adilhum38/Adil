import React, { useState, useEffect } from 'react';
import { CURRENCY_SYMBOL } from '../constants';
import { User } from '../types';
import { Star, MapPin, MessageSquare, Grid, LayoutList, X, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../services/mockDatabase';

const FreelancerDirectory: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  const [freelancers, setFreelancers] = useState<User[]>([]);

  useEffect(() => {
    setFreelancers(db.getUsers());
  }, []);

  const filteredFreelancers = freelancers.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    f.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    {t('directory.title')}
                </h2>
                <p className="mt-2 text-lg text-slate-500">
                    {t('directory.subtitle')}
                </p>
                
                <div className="mt-6 max-w-lg mx-auto">
                    <input
                        type="text"
                        className="block w-full pl-6 pr-6 py-3 rounded-full border-0 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm sm:leading-6 bg-white"
                        placeholder={t('directory.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid of "Profile Cards" */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredFreelancers.map((freelancer) => (
                    <div 
                        key={freelancer.id} 
                        onClick={() => setSelectedProfile(freelancer)}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col"
                    >
                        {/* Instagram Header Style */}
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <img className="h-12 w-12 rounded-full object-cover ring-2 ring-offset-2 ring-pink-500" src={freelancer.avatar} alt={freelancer.name} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">{freelancer.username}</h3>
                                    <p className="text-xs text-slate-500 truncate max-w-[120px]">{freelancer.title || 'Creator'}</p>
                                </div>
                            </div>
                            <button className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-1.5 rounded-lg transition-colors">
                                {t('directory.viewProfile')}
                            </button>
                        </div>

                        {/* Preview Grid (First 3 images) */}
                        <div className="grid grid-cols-3 gap-0.5 h-32 bg-slate-100">
                            {freelancer.portfolio && freelancer.portfolio.length > 0 ? (
                                freelancer.portfolio.slice(0, 3).map((item) => (
                                    <img 
                                        key={item.id} 
                                        src={item.url} 
                                        className="w-full h-full object-cover" 
                                        alt="Portfolio preview" 
                                    />
                                ))
                            ) : (
                                <div className="col-span-3 flex items-center justify-center h-full text-slate-400 text-xs">No images</div>
                            )}
                        </div>

                        {/* Card Footer Info */}
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-3 text-sm">
                                <div className="flex space-x-4">
                                    <span className="font-medium text-slate-900">
                                        <span className="font-bold">{freelancer.rating}</span> <span className="text-slate-500 font-normal">{t('directory.rating')}</span>
                                    </span>
                                    <span className="font-medium text-slate-900">
                                        <span className="font-bold">{freelancer.completedProjects}</span> <span className="text-slate-500 font-normal">{t('directory.works')}</span>
                                    </span>
                                </div>
                                <div className="font-bold text-emerald-600">
                                    {freelancer.hourlyRate?.toLocaleString()} {CURRENCY_SYMBOL}/hr
                                </div>
                            </div>
                            
                            <div className="text-sm text-slate-600 line-clamp-2 mb-3 whitespace-pre-line">
                                <span className="font-bold text-slate-900 mr-1">{freelancer.name}</span>
                                {freelancer.bio || 'No bio available.'}
                            </div>

                             {/* "Stories" / Clients Preview */}
                             {freelancer.clients && freelancer.clients.length > 0 && (
                                <div className="flex space-x-2 overflow-x-auto pt-2 pb-1 no-scrollbar">
                                    {freelancer.clients.slice(0,4).map(client => (
                                        <div key={client.id} className="flex-shrink-0 flex flex-col items-center space-y-1">
                                            <div className="w-10 h-10 rounded-full p-[2px] border border-slate-200">
                                                <img src={client.logo} className="w-full h-full rounded-full object-cover bg-slate-50" alt={client.name} />
                                            </div>
                                            <span className="text-[10px] text-slate-500">{client.name}</span>
                                        </div>
                                    ))}
                                </div>
                             )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Full Profile Modal (Instagram Style) */}
            {selectedProfile && (
                <ProfileModal 
                    user={selectedProfile} 
                    onClose={() => setSelectedProfile(null)} 
                />
            )}
        </div>
    </div>
  );
};

const ProfileModal: React.FC<{ user: User; onClose: () => void }> = ({ user, onClose }) => {
    const [activeTab, setActiveTab] = useState<'grid' | 'reviews'>('grid');
    const { t } = useLanguage();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-red-500 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="overflow-y-auto custom-scrollbar flex-1">
                    <div className="flex flex-col md:flex-row">
                        
                        {/* Sidebar / Header Info (Desktop: Left, Mobile: Top) */}
                        <div className="w-full md:w-1/3 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-100 bg-white">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 mb-4">
                                    <div className="w-full h-full rounded-full p-1 bg-white">
                                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                    </div>
                                </div>
                                
                                <h2 className="text-xl font-bold text-slate-900">{user.username}</h2>
                                <p className="text-sm text-slate-500 font-medium mb-4">{user.title}</p>

                                <div className="flex justify-center space-x-8 mb-6 w-full border-y border-slate-100 py-4">
                                    <div className="text-center">
                                        <div className="font-bold text-lg text-slate-900">{user.completedProjects}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">{t('directory.works')}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-lg text-slate-900">{user.rating}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">{t('directory.rating')}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-lg text-slate-900">{user.reviews.length}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">{t('directory.reviewsTab')}</div>
                                    </div>
                                </div>

                                <div className="text-left w-full mb-6">
                                    <h3 className="font-bold text-slate-900 mb-1">{user.name}</h3>
                                    <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed mb-3">
                                        {user.bio}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {user.skills.map(skill => (
                                            <span key={skill} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium">#{skill.replace(/\s+/g, '')}</span>
                                        ))}
                                    </div>
                                    <div className="flex items-center text-xs text-slate-500">
                                        <MapPin size={14} className="mr-1" /> {user.city}
                                    </div>
                                </div>

                                <button className="w-full bg-emerald-600 text-white font-semibold py-2.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200">
                                    {t('directory.hireFor')} {user.hourlyRate?.toLocaleString()} {CURRENCY_SYMBOL}/hr
                                </button>
                                <button className="w-full mt-3 border border-slate-300 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                                    {t('directory.message')}
                                </button>
                            </div>

                            {/* Highlights (Clients) */}
                            {user.clients && user.clients.length > 0 && (
                                <div className="mt-8">
                                    <h4 className="text-sm font-bold text-slate-900 mb-3">{t('directory.clients')}</h4>
                                    <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
                                        {user.clients.map(client => (
                                            <div key={client.id} className="flex flex-col items-center flex-shrink-0 space-y-1 cursor-pointer opacity-80 hover:opacity-100">
                                                <div className="w-14 h-14 rounded-full p-[2px] border border-slate-200 bg-slate-50">
                                                    <img src={client.logo} className="w-full h-full rounded-full object-cover" alt={client.name} />
                                                </div>
                                                <span className="text-[10px] font-medium text-slate-600 truncate w-14 text-center">{client.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="w-full md:w-2/3 bg-white">
                            {/* Tabs */}
                            <div className="flex items-center justify-center border-b border-slate-200 sticky top-0 bg-white z-10">
                                <button 
                                    onClick={() => setActiveTab('grid')}
                                    className={`flex items-center space-x-2 px-8 py-4 text-xs uppercase tracking-widest font-medium transition-all border-t-2 ${
                                        activeTab === 'grid' 
                                        ? 'border-slate-900 text-slate-900' 
                                        : 'border-transparent text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    <Grid size={14} />
                                    <span>{t('directory.portfolioTab')}</span>
                                </button>
                                <button 
                                    onClick={() => setActiveTab('reviews')}
                                    className={`flex items-center space-x-2 px-8 py-4 text-xs uppercase tracking-widest font-medium transition-all border-t-2 ${
                                        activeTab === 'reviews' 
                                        ? 'border-slate-900 text-slate-900' 
                                        : 'border-transparent text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    <LayoutList size={14} />
                                    <span>{t('directory.reviewsTab')}</span>
                                </button>
                            </div>

                            <div className="p-1">
                                {activeTab === 'grid' ? (
                                    user.portfolio && user.portfolio.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-1">
                                            {user.portfolio.map((item) => (
                                                <div key={item.id} className="relative aspect-square group cursor-pointer overflow-hidden bg-slate-100">
                                                    <img 
                                                        src={item.url} 
                                                        alt="Work" 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <div className="flex items-center text-white font-bold space-x-1">
                                                            <Heart size={20} fill="white" />
                                                            <span>{item.likes}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 text-slate-400">No items in portfolio</div>
                                    )
                                ) : (
                                    <div className="p-6 space-y-6">
                                        {user.reviews.length > 0 ? (
                                            user.reviews.map((review) => (
                                                <div key={review.id} className="flex space-x-4 border-b border-slate-100 pb-6 last:border-0">
                                                    <img src={review.reviewerAvatar} alt={review.reviewerName} className="w-10 h-10 rounded-full bg-slate-200" />
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <h5 className="font-bold text-slate-900 text-sm">{review.reviewerName}</h5>
                                                            <span className="text-xs text-slate-400">{review.date}</span>
                                                        </div>
                                                        <div className="flex mb-2">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star 
                                                                    key={i} 
                                                                    size={12} 
                                                                    className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} 
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className="text-sm text-slate-600 leading-relaxed">
                                                            {review.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-slate-400">
                                                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                                                <p>{t('directory.noReviews')}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreelancerDirectory;