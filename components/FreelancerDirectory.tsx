
import React, { useState, useEffect } from 'react';
import { CURRENCY_SYMBOL } from '../constants';
import { User, PortfolioItem, City } from '../types';
// Fixed: Added 'Users' to the import list from lucide-react to fix line 156 reference error.
import { Star, MapPin, MessageSquare, Grid, LayoutList, X, Heart, CheckCircle2, Maximize2, Filter, Search, SlidersHorizontal, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/mockDatabase';

const FreelancerDirectory: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState<string>('All');
  const [filterSkill, setFilterSkill] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setFreelancers(db.getUsers());
  }, []);

  const refreshFreelancers = () => {
    setFreelancers(db.getUsers());
    // Also update selectedProfile if open to reflect new like counts
    if (selectedProfile) {
        const updated = db.getUsers().find(u => u.id === selectedProfile.id);
        if (updated) setSelectedProfile(updated);
    }
  };

  // Extract unique skills for suggestions
  const allSkills = Array.from(new Set(freelancers.flatMap(f => f.skills))).sort();

  const filteredFreelancers = freelancers.filter(f => {
    const matchesSearch = 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = filterCity === 'All' || f.city === filterCity;
    
    const matchesSkill = filterSkill === '' || 
        f.skills.some(skill => skill.toLowerCase().includes(filterSkill.toLowerCase()));
    
    const matchesRating = f.rating >= minRating;

    return matchesSearch && matchesCity && matchesSkill && matchesRating;
  });

  const clearFilters = () => {
      setSearchTerm('');
      setFilterCity('All');
      setFilterSkill('');
      setMinRating(0);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 animate-in fade-in duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-10 text-center lg:text-left flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                        {t('directory.title')}
                    </h2>
                    <p className="mt-2 text-lg text-slate-500 max-w-2xl">
                        {t('directory.subtitle')}
                    </p>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="relative flex-grow lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-3 rounded-2xl border-0 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 bg-white transition-all text-sm"
                            placeholder={t('directory.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="lg:hidden p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50"
                    >
                        <SlidersHorizontal size={20} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className={`lg:w-1/4 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center text-slate-800">
                                <Filter size={20} className="mr-2 text-emerald-600" />
                                <h3 className="font-bold text-lg">Filters</h3>
                            </div>
                            <button 
                                onClick={clearFilters}
                                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                            >
                                Reset
                            </button>
                        </div>

                        {/* City Filter */}
                        <div className="mb-6">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Location</label>
                            <select 
                                value={filterCity}
                                onChange={(e) => setFilterCity(e.target.value)}
                                className="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all"
                            >
                                <option value="All">{t('jobs.allCities')}</option>
                                {Object.values(City).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Skills Filter */}
                        <div className="mb-6">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Skills</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    list="skills-list"
                                    value={filterSkill}
                                    onChange={(e) => setFilterSkill(e.target.value)}
                                    placeholder="e.g. Figma, Branding..."
                                    className="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all"
                                />
                                <datalist id="skills-list">
                                    {allSkills.map(skill => <option key={skill} value={skill} />)}
                                </datalist>
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Min Rating ({minRating})</label>
                            <input 
                                type="range" 
                                min="0" 
                                max="5" 
                                step="0.5" 
                                value={minRating}
                                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 mb-2"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                <span>Any</span>
                                <span>5.0</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Grid Content */}
                <div className="lg:w-3/4">
                    {filteredFreelancers.length === 0 ? (
                        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-24 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">No creators found</h3>
                            <p className="text-slate-500">Try adjusting your filters or search term.</p>
                            <button 
                                onClick={clearFilters}
                                className="mt-6 text-emerald-600 font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {filteredFreelancers.map((freelancer) => (
                                <div 
                                    key={freelancer.id} 
                                    onClick={() => setSelectedProfile(freelancer)}
                                    className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 cursor-pointer flex flex-col group"
                                >
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <img className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-100 group-hover:ring-emerald-300 transition-all" src={freelancer.avatar} alt={freelancer.name} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">{freelancer.username}</h3>
                                                <p className="text-xs text-slate-500 truncate max-w-[140px]">{freelancer.title || 'Creator'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center bg-slate-50 px-2.5 py-1 rounded-xl">
                                            <Star size={14} className="text-amber-400 fill-amber-400 mr-1" />
                                            <span className="text-xs font-bold text-slate-900">{freelancer.rating}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-0.5 h-36 bg-slate-50 overflow-hidden">
                                        {freelancer.portfolio && freelancer.portfolio.length > 0 ? (
                                            freelancer.portfolio.slice(0, 3).map((item) => (
                                                <img 
                                                    key={item.id} 
                                                    src={item.url} 
                                                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" 
                                                    alt="Portfolio preview" 
                                                />
                                            ))
                                        ) : (
                                            <div className="col-span-3 flex items-center justify-center h-full text-slate-300 text-xs italic font-medium">No portfolio work listed</div>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {freelancer.skills.slice(0, 3).map(skill => (
                                                <span key={skill} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                                                    {skill}
                                                </span>
                                            ))}
                                            {freelancer.skills.length > 3 && (
                                                <span className="text-[10px] font-bold text-slate-400 px-1">+{freelancer.skills.length - 3} more</span>
                                            )}
                                        </div>
                                        
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center text-slate-500">
                                                <MapPin size={14} className="mr-1 text-slate-400" />
                                                <span className="font-medium">{freelancer.city}</span>
                                            </div>
                                            <div className="font-black text-emerald-600">
                                                {freelancer.hourlyRate?.toLocaleString()} {CURRENCY_SYMBOL}/hr
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedProfile && (
                <ProfileModal 
                    user={selectedProfile} 
                    onClose={() => setSelectedProfile(null)} 
                    onUpdate={refreshFreelancers}
                />
            )}
        </div>
    </div>
  );
};

const ProfileModal: React.FC<{ user: User; onClose: () => void; onUpdate: () => void }> = ({ user, onClose, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'grid' | 'reviews'>('grid');
    const [hired, setHired] = useState(false);
    const [selectedWork, setSelectedWork] = useState<PortfolioItem | null>(null);
    const { t } = useLanguage();
    const { user: currentUser, isAuthenticated } = useAuth();

    const handleHire = (e: React.MouseEvent) => {
        e.stopPropagation();
        setHired(true);
        setTimeout(() => setHired(false), 3000);
    };

    const handleMessage = (e: React.MouseEvent) => {
        e.stopPropagation();
        alert(`Redirecting to chat with ${user.username}... (Feature coming soon)`);
    };

    const handleLikeItem = (e: React.MouseEvent, item: PortfolioItem) => {
        e.stopPropagation();
        if (!isAuthenticated || !currentUser) {
            alert("Please log in to like portfolio works.");
            return;
        }
        db.likePortfolioItem(user.id, item.id, currentUser.id);
        onUpdate(); // Refresh counts
    };

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose}></div>
                
                <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                    <button 
                        onClick={onClose}
                        className="absolute top-5 right-5 z-20 p-2 bg-white/90 backdrop-blur-md rounded-full text-slate-600 hover:text-red-500 shadow-lg transition-all"
                    >
                        <X size={20} />
                    </button>

                    <div className="overflow-y-auto custom-scrollbar flex-1">
                        <div className="flex flex-col md:flex-row h-full">
                            
                            <div className="w-full md:w-[320px] p-8 border-b md:border-b-0 md:border-r border-slate-100 bg-white sticky top-0">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-emerald-400 via-teal-500 to-emerald-600 mb-5 shadow-lg">
                                        <div className="w-full h-full rounded-full p-1 bg-white">
                                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-xl font-black text-slate-900">{user.username}</h2>
                                    <p className="text-sm text-emerald-600 font-bold mb-5">{user.title}</p>

                                    <div className="grid grid-cols-3 gap-2 w-full border-y border-slate-50 py-5 mb-6">
                                        <div className="text-center">
                                            <div className="font-black text-slate-900">{user.completedProjects}</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-widest">{t('directory.works')}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-black text-slate-900">{user.rating}</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-widest">{t('directory.rating')}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-black text-slate-900">{user.reviews.length}</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-widest">{t('directory.reviewsTab')}</div>
                                        </div>
                                    </div>

                                    <div className="text-left w-full mb-6">
                                        <h3 className="font-bold text-slate-900 mb-1">{user.name}</h3>
                                        <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed mb-4">
                                            {user.bio || 'Professional creative specialist.'}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mb-5">
                                            {user.skills.map(skill => (
                                                <span key={skill} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">#{skill.replace(/\s+/g, '')}</span>
                                            ))}
                                        </div>
                                        <div className="flex items-center text-xs text-slate-500 font-medium">
                                            <MapPin size={14} className="mr-1 text-slate-400" /> {user.city}
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleHire}
                                        className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center space-x-2 ${
                                            hired 
                                            ? 'bg-emerald-50 text-emerald-600' 
                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100 transform active:scale-[0.98]'
                                        }`}
                                    >
                                        {hired ? (
                                            <><CheckCircle2 size={18} /> <span>Hire Request Sent</span></>
                                        ) : (
                                            <>{t('directory.hireFor')} {user.hourlyRate?.toLocaleString()} {CURRENCY_SYMBOL}/hr</>
                                        )}
                                    </button>
                                    <button 
                                        onClick={handleMessage}
                                        className="w-full mt-3 border border-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl hover:bg-slate-50 transition-all text-sm"
                                    >
                                        {t('directory.message')}
                                    </button>
                                </div>

                                {user.clients && user.clients.length > 0 && (
                                    <div className="mt-10">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t('directory.clients')}</h4>
                                        <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
                                            {user.clients.map(client => (
                                                <div key={client.id} className="flex flex-col items-center flex-shrink-0 space-y-1 group/item">
                                                    <div className="w-14 h-14 rounded-full p-[2px] border border-slate-100 group-hover/item:border-emerald-300 transition-colors">
                                                        <img src={client.logo} className="w-full h-full rounded-full object-cover grayscale group-hover/item:grayscale-0 transition-all" alt={client.name} />
                                                    </div>
                                                    <span className="text-[9px] font-bold text-slate-400 truncate w-14 text-center">{client.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 bg-white">
                                <div className="flex items-center justify-center border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
                                    <button 
                                        onClick={() => setActiveTab('grid')}
                                        className={`flex items-center space-x-2 px-8 py-5 text-[10px] uppercase tracking-widest font-black transition-all border-b-2 ${
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
                                        className={`flex items-center space-x-2 px-8 py-5 text-[10px] uppercase tracking-widest font-black transition-all border-b-2 ${
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
                                                {user.portfolio.map((item) => {
                                                    const isLiked = currentUser ? db.isItemLikedByUser(item.id, currentUser.id) : false;
                                                    return (
                                                        <div 
                                                            key={item.id} 
                                                            onClick={() => setSelectedWork(item)}
                                                            className="relative aspect-square group cursor-pointer overflow-hidden bg-slate-50"
                                                        >
                                                            <img 
                                                                src={item.url} 
                                                                alt="Work" 
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                            />
                                                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                                <div className="flex flex-col items-center text-white space-y-2">
                                                                    <Maximize2 size={24} className="drop-shadow-lg" />
                                                                    <div 
                                                                        onClick={(e) => handleLikeItem(e, item)}
                                                                        className={`flex items-center font-black space-x-2 p-2 rounded-full transition-all ${isLiked ? 'text-pink-500' : 'text-white hover:text-pink-400'}`}
                                                                    >
                                                                        <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                                                                        <span className="text-sm">{item.likes || 0}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-32 text-slate-300 italic text-sm">Portfolio content is coming soon</div>
                                        )
                                    ) : (
                                        <div className="p-8 space-y-8 animate-in slide-in-from-bottom-2 duration-300">
                                            {user.reviews.length > 0 ? (
                                                user.reviews.map((review) => (
                                                    <div key={review.id} className="flex space-x-5 group/review">
                                                        <img src={review.reviewerAvatar} alt={review.reviewerName} className="w-12 h-12 rounded-full bg-slate-100 ring-2 ring-transparent group-hover/review:ring-emerald-200 transition-all" />
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center mb-1.5">
                                                                <h5 className="font-black text-slate-900 text-sm">{review.reviewerName}</h5>
                                                                <span className="text-[10px] font-bold text-slate-400">{review.date}</span>
                                                            </div>
                                                            <div className="flex mb-3">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star 
                                                                        key={i} 
                                                                        size={14} 
                                                                        className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                                                                    />
                                                                ))}
                                                            </div>
                                                            <p className="text-sm text-slate-600 leading-relaxed italic">
                                                                "{review.text}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-20 text-slate-400">
                                                    <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
                                                    <p className="font-bold">{t('directory.noReviews')}</p>
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

            {selectedWork && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={() => setSelectedWork(null)}></div>
                    
                    <div className="absolute top-6 right-6 flex items-center space-x-4 z-20">
                        <button 
                            onClick={() => setSelectedWork(null)}
                            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="absolute top-6 left-6 z-20">
                        <div className="flex items-center space-x-3 text-white">
                            <img src={user.avatar} className="w-10 h-10 rounded-full border border-white/20" alt="" />
                            <div>
                                <h4 className="font-black text-sm">{user.username}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.title}</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                        {selectedWork.type === 'video' ? (
                            <video 
                                src={selectedWork.url} 
                                controls 
                                autoPlay 
                                className="max-w-full max-h-full shadow-2xl animate-in zoom-in-95 duration-500 pointer-events-auto rounded-lg"
                            />
                        ) : (
                            <img 
                                src={selectedWork.url} 
                                alt={selectedWork.title || "Portfolio Work"} 
                                className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-500 pointer-events-auto"
                            />
                        )}
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-20 pointer-events-none">
                        <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 flex items-center justify-between pointer-events-auto shadow-2xl">
                            <div>
                                <h3 className="text-white font-black text-lg">{selectedWork.title || "Project Title"}</h3>
                                <p className="text-slate-300 text-sm">{selectedWork.type === 'video' ? 'Video Project' : 'Visual Masterpiece'}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                {(() => {
                                    const isLiked = currentUser ? db.isItemLikedByUser(selectedWork.id, currentUser.id) : false;
                                    const currentItemLikes = user.portfolio.find(p => p.id === selectedWork.id)?.likes || 0;
                                    return (
                                        <div 
                                            onClick={(e) => handleLikeItem(e, selectedWork)}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border transition-all cursor-pointer ${isLiked ? 'bg-pink-500/20 border-pink-500 text-pink-500' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                                        >
                                            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                                            <span className="font-black">{currentItemLikes}</span>
                                        </div>
                                    );
                                })()}
                                <button 
                                    onClick={handleHire}
                                    className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    Work with Me
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FreelancerDirectory;
