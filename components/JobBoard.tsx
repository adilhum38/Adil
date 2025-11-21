import React, { useState, useEffect } from 'react';
import { CURRENCY_SYMBOL } from '../constants';
import { Category, City, Job } from '../types';
import { MapPin, Clock, Sparkles, Filter, DollarSign } from 'lucide-react';
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

  // Create Job State
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCategory, setNewJobCategory] = useState<Category>(Category.SMM);
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobBudget, setNewJobBudget] = useState<number>(50000);
  const [newJobCity, setNewJobCity] = useState<City>(City.ALMATY);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setJobs(db.getJobs());
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
    // Reset form
    setNewJobTitle('');
    setNewJobDesc('');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-emerald-700 py-12 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('jobs.headerTitle')}</h2>
          <p className="text-emerald-100 max-w-2xl mx-auto">
            {t('jobs.headerSubtitle')}
          </p>
          
          {isAuthenticated ? (
            <button 
                onClick={() => setShowCreateModal(true)}
                className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-white hover:bg-slate-100 shadow-lg transition-all"
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 sticky top-24">
                <div className="flex items-center mb-4 text-slate-800">
                    <Filter size={20} className="mr-2" />
                    <h3 className="font-semibold text-lg">{t('jobs.filters')}</h3>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('jobs.city')}</label>
                    <select 
                        value={filterCity}
                        onChange={(e) => setFilterCity(e.target.value)}
                        className="w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2 border"
                    >
                        <option value="All">{t('jobs.allCities')}</option>
                        {Object.values(City).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('jobs.category')}</label>
                    <select 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2 border"
                    >
                        <option value="All">{t('jobs.allCategories')}</option>
                        {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
        </div>

        {/* Job List */}
        <div className="w-full lg:w-3/4 space-y-6">
          {filteredJobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                  <p className="text-slate-500">{t('jobs.noJobs')}</p>
              </div>
          ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-2">
                                {job.category}
                            </span>
                            <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                            <p className="text-slate-500 text-sm mt-1 font-medium">{job.clientName}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-slate-900">{job.budget.toLocaleString()} {CURRENCY_SYMBOL}</div>
                            <div className="text-xs text-slate-500">{t('jobs.fixedPrice')}</div>
                        </div>
                    </div>
                    
                    <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                        {job.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <div className="flex items-center">
                                <MapPin size={16} className="mr-1" />
                                {job.city}
                            </div>
                            <div className="flex items-center">
                                <Clock size={16} className="mr-1" />
                                {t('jobs.posted')} {job.postedAt}
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                            {t('jobs.apply')}
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-900">{t('jobs.createTitle')}</h3>
                    <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">{t('jobs.jobTitleLabel')}</label>
                        <input 
                            type="text" 
                            value={newJobTitle}
                            onChange={(e) => setNewJobTitle(e.target.value)}
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="e.g. Instagram Content Creator"
                        />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">{t('jobs.category')}</label>
                            <select 
                                value={newJobCategory}
                                onChange={(e) => setNewJobCategory(e.target.value as Category)}
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700">{t('jobs.city')}</label>
                            <select 
                                value={newJobCity}
                                onChange={(e) => setNewJobCity(e.target.value as City)}
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                {Object.values(City).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700">Budget (KZT)</label>
                        <input 
                            type="number" 
                            value={newJobBudget}
                            onChange={(e) => setNewJobBudget(Number(e.target.value))}
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-slate-700">{t('jobs.descLabel')}</label>
                            <button 
                                onClick={handleAiGenerate}
                                disabled={isGenerating}
                                className="text-xs flex items-center text-purple-600 hover:text-purple-800 font-medium"
                            >
                                <Sparkles size={12} className="mr-1" />
                                {isGenerating ? t('jobs.generating') : t('jobs.autoWrite')}
                            </button>
                        </div>
                        <textarea 
                            value={newJobDesc}
                            onChange={(e) => setNewJobDesc(e.target.value)}
                            rows={4}
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Detailed description of the project..."
                        />
                    </div>
                    <button 
                        onClick={handlePostJob}
                        className="w-full bg-emerald-600 text-white py-2 rounded-md font-medium hover:bg-emerald-700"
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