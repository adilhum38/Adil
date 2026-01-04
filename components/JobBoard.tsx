
import React, { useState, useEffect } from 'react';
import { CURRENCY_SYMBOL } from '../constants';
import { Category, City, Job } from '../types';
import { MapPin, Clock, Sparkles, Filter, CheckCircle2, X } from 'lucide-react';
import { generateJobDescription } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/mockDatabase';

const JobBoard: React.FC = () => {
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filterCity, setFilterCity] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  // Create Job State
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCategory, setNewJobCategory] = useState<Category>(Category.SMM);
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobBudget, setNewJobBudget] = useState<number>(50000);
  const [newJobCity, setNewJobCity] = useState<City>(City.ALMATY);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setJobs(db.getJobs());
    const stored = localStorage.getItem('applied_jobs');
    if (stored) setAppliedJobs(new Set(JSON.parse(stored)));
  }, []);

  const filteredJobs = jobs.filter(job => {
    const cityMatch = filterCity === 'All' || job.city === filterCity;
    const catMatch = filterCategory === 'All' || job.category === filterCategory;
    return cityMatch && catMatch;
  });

  const handleAiGenerate = async () => {
    if (!newJobTitle) {
        alert(t('jobs.enterTitleReq'));
        return;
    }
    setIsGenerating(true);
    const desc = await generateJobDescription(newJobTitle, newJobCategory, language);
    setNewJobDesc(desc);
    setIsGenerating(false);
  };

  const handleApply = (jobId: string) => {
    if (!isAuthenticated) {
        alert("Please login to apply for jobs.");
        return;
    }
    const updated = new Set(appliedJobs).add(jobId);
    setAppliedJobs(updated);
    localStorage.setItem('applied_jobs', JSON.stringify(Array.from(updated)));
  };

  const handlePostJob = () => {
    if (!newJobTitle || !newJobDesc) return;
    
    const newJob: Job = {
        id: Date.now().toString(),
        title: newJobTitle,
        description: newJobDesc,
        clientName: user?.name || 'Anonymous',
        budget: newJobBudget,
        currency: 'KZT',
        category: newJobCategory,
        city: newJobCity,
        postedAt: new Date().toISOString().split('T')[0],
        requiredSkills: [],
        authorId: user?.id
    };

    db.addJob(newJob);
    setJobs(db.getJobs());
    setShowCreateModal(false);
    setNewJobTitle('');
    setNewJobDesc('');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-12 animate-in fade-in duration-500 transition-colors">
      {/* Header */}
      <div className="bg-emerald-700 dark:bg-emerald-900 py-12 px-4 sm:px-6 lg:px-8 mb-8 relative overflow-hidden transition-colors">
        <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">{t('jobs.headerTitle')}</h2>
          <p className="text-emerald-100 dark:text-emerald-200 max-w-2xl mx-auto">
            {t('jobs.headerSubtitle')}
          </p>
          
          {isAuthenticated ? (
            <button 
                onClick={() => setShowCreateModal(true)}
                className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-white hover:bg-slate-100 shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
                {t('jobs.postJob')}
            </button>
          ) : (
            <div className="mt-6 text-emerald-100 text-sm font-medium bg-emerald-800/50 inline-block px-4 py-2 rounded-lg">
                Login to post a job
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <div className="w-full lg:w-1/4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 sticky top-24 transition-colors">
                <div className="flex items-center mb-4 text-slate-800 dark:text-slate-100">
                    <Filter size={20} className="mr-2 text-emerald-600 dark:text-emerald-500" />
                    <h3 className="font-semibold text-lg">{t('jobs.filters')}</h3>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('jobs.city')}</label>
                    <select 
                        value={filterCity}
                        onChange={(e) => setFilterCity(e.target.value)}
                        className="w-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2.5 border text-sm outline-none"
                    >
                        <option value="All">{t('jobs.allCities')}</option>
                        {Object.values(City).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('jobs.category')}</label>
                    <select 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2.5 border text-sm outline-none"
                    >
                        <option value="All">{t('jobs.allCategories')}</option>
                        {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
        </div>

        {/* Job List */}
        <div className="w-full lg:w-3/4 space-y-4">
          {filteredJobs.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400">{t('jobs.noJobs')}</p>
              </div>
          ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 mb-2">
                                {job.category}
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{job.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">{job.clientName}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{job.budget.toLocaleString()} {CURRENCY_SYMBOL}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('jobs.fixedPrice')}</div>
                        </div>
                    </div>
                    
                    <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
                        {job.description}
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-4">
                        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 w-full sm:w-auto">
                            <div className="flex items-center">
                                <MapPin size={16} className="mr-1 text-slate-400" />
                                {job.city}
                            </div>
                            <div className="flex items-center">
                                <Clock size={16} className="mr-1 text-slate-400" />
                                {t('jobs.posted')} {job.postedAt}
                            </div>
                        </div>
                        <button 
                            disabled={appliedJobs.has(job.id)}
                            onClick={() => handleApply(job.id)}
                            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
                                appliedJobs.has(job.id) 
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40' 
                                : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-500 shadow-md hover:shadow-emerald-100'
                            }`}
                        >
                            {appliedJobs.has(job.id) ? (
                                <><CheckCircle2 size={16} /> <span>Applied</span></>
                            ) : (
                                t('jobs.apply')
                            )}
                        </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-in zoom-in duration-200 border border-transparent dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('jobs.createTitle')}</h3>
                    <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('jobs.jobTitleLabel')}</label>
                        <input 
                            type="text" 
                            value={newJobTitle}
                            onChange={(e) => setNewJobTitle(e.target.value)}
                            className="block w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl shadow-sm p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            placeholder="e.g. Instagram Content Creator"
                        />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('jobs.category')}</label>
                            <select 
                                value={newJobCategory}
                                onChange={(e) => setNewJobCategory(e.target.value as Category)}
                                className="block w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl shadow-sm p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            >
                                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('jobs.city')}</label>
                            <select 
                                value={newJobCity}
                                onChange={(e) => setNewJobCity(e.target.value as City)}
                                className="block w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl shadow-sm p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            >
                                {Object.values(City).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Budget (KZT)</label>
                        <input 
                            type="number" 
                            value={newJobBudget}
                            onChange={(e) => setNewJobBudget(Number(e.target.value))}
                            className="block w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl shadow-sm p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">{t('jobs.descLabel')}</label>
                            <button 
                                onClick={handleAiGenerate}
                                disabled={isGenerating}
                                className="text-xs flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 font-bold bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-lg transition-colors"
                            >
                                <Sparkles size={12} className="mr-1" />
                                {isGenerating ? t('jobs.generating') : t('jobs.autoWrite')}
                            </button>
                        </div>
                        <textarea 
                            value={newJobDesc}
                            onChange={(e) => setNewJobDesc(e.target.value)}
                            rows={4}
                            className="block w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl shadow-sm p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                            placeholder="Detailed description of the project..."
                        />
                    </div>
                    <button 
                        onClick={handlePostJob}
                        className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-none transform active:scale-[0.98]"
                    >
                        {t('jobs.publish')}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;
