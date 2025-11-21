import React from 'react';
import { Menu, Briefcase, Users, BarChart2, User as UserIcon, LogIn, LogOut } from 'lucide-react';
import { APP_NAME } from '../constants';
import { useLanguage, Language } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, logout, user } = useAuth();

  const navItems = [
    { id: 'home', label: t('nav.home'), icon: <Menu size={18} /> },
    { id: 'jobs', label: t('nav.jobs'), icon: <Briefcase size={18} /> },
    { id: 'freelancers', label: t('nav.freelancers'), icon: <Users size={18} /> },
    { id: 'dashboard', label: t('nav.dashboard'), icon: <BarChart2 size={18} /> },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'kk', label: 'KZ' },
    { code: 'ru', label: 'RU' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">{APP_NAME}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  currentView === item.id
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            {/* Auth Buttons */}
            {isAuthenticated && user ? (
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                     <button
                        onClick={() => setView('profile')}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                        currentView === 'profile'
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                        }`}
                    >
                        <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover"/>
                        </div>
                        <span>{t('nav.profile')}</span>
                    </button>
                    <button onClick={logout} className="text-slate-400 hover:text-red-500 p-2">
                        <LogOut size={18} />
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setView('auth')}
                    className="ml-4 flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                >
                    <LogIn size={16} className="mr-2" />
                    {t('nav.login')}
                </button>
            )}

            {/* Language Switcher */}
            <div className="flex items-center ml-2 border-l border-slate-200 pl-4 space-x-1">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`text-xs font-bold px-2 py-1 rounded ${
                            language === lang.code 
                            ? 'bg-slate-900 text-white' 
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;