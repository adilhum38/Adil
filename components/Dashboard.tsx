import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getMarketInsights } from '../services/geminiService';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const dataDemand = [
  { name: 'Video', demand: 4000, supply: 2400 },
  { name: 'SMM', demand: 3000, supply: 4500 },
  { name: 'Design', demand: 2000, supply: 3000 },
  { name: 'Dev', demand: 2780, supply: 1500 },
  { name: 'Mobile', demand: 3890, supply: 2000 },
];

const cityData = [
  { name: 'Almaty', value: 55 },
  { name: 'Astana', value: 30 },
  { name: 'Shymkent', value: 10 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7'];

const Dashboard: React.FC = () => {
    const { t, language } = useLanguage();
    const [insight, setInsight] = useState<string>(t('dashboard.loading'));

    useEffect(() => {
        setInsight(t('dashboard.loading'));
        getMarketInsights(language).then(setInsight);
    }, [language, t]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">{t('dashboard.title')}</h2>
            <p className="text-slate-500">{t('dashboard.subtitle')}</p>
        </div>

        {/* AI Insight Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white mb-8 shadow-lg flex items-start">
            <Sparkles className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
            <div>
                <h3 className="font-bold text-lg mb-1">{t('dashboard.aiTitle')}</h3>
                <p className="opacity-90 text-sm leading-relaxed">{insight}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Demand vs Supply Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">{t('dashboard.demandChart')}</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataDemand}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Bar dataKey="demand" fill="#059669" name={t('dashboard.demandLabel')} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="supply" fill="#94a3b8" name={t('dashboard.supplyLabel')} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">{t('dashboard.geoChart')}</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {cityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500">
                <div className="text-sm text-slate-500 font-medium uppercase">{t('dashboard.avgRate')}</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">18,500 ₸</div>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <div className="text-sm text-slate-500 font-medium uppercase">{t('dashboard.activeProjects')}</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">1,240</div>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                <div className="text-sm text-slate-500 font-medium uppercase">{t('dashboard.newFreelancers')}</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">+85</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;