
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, UserRole, City } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AuthProps {
  onComplete: () => void;
}

const Auth: React.FC<AuthProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.FREELANCER);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = login(email);
      if (success) {
        onComplete();
      } else {
        setError('User not found. Try registering.');
      }
    } else {
      if (!name || !email) {
        setError('Please fill all fields');
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        username: '@' + name.toLowerCase().replace(/\s+/g, ''),
        email,
        role,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff`,
        city: City.ALMATY,
        rating: 5.0,
        reviewCount: 0,
        completedProjects: 0,
        skills: [],
        clients: [],
        portfolio: [],
        reviews: []
      };
      
      register(newUser);
      onComplete();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-transparent dark:border-slate-800 transition-colors">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {isLogin ? t('auth.signInTitle') || 'Sign in' : t('auth.createAccount') || 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {isLogin ? t('auth.welcomeBack') || 'Welcome back to the hub' : t('auth.joinCommunity') || 'Join the community'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-widest">{t('auth.fullName') || 'Full Name'}</label>
                <input
                  type="text"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 text-slate-900 dark:text-slate-100 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-widest">{t('auth.email') || 'Email'}</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 text-slate-900 dark:text-slate-100 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-widest">{t('auth.password') || 'Password'}</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 text-slate-900 dark:text-slate-100 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {!isLogin && (
             <div className="flex flex-col space-y-3 mb-4">
                <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">I want to...</p>
                <div className="flex items-center justify-center space-x-3">
                    <button
                        type="button"
                        onClick={() => setRole(UserRole.FREELANCER)}
                        className={`flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${role === UserRole.FREELANCER ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                    >
                        {t('auth.iAmFreelancer') || 'Freelance'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole(UserRole.CLIENT)}
                        className={`flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${role === UserRole.CLIENT ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                    >
                        {t('auth.iAmClient') || 'Hire'}
                    </button>
                </div>
             </div>
          )}

          {error && <p className="text-red-500 text-xs font-bold text-center animate-pulse">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-all shadow-lg shadow-emerald-100 dark:shadow-none"
            >
              {isLogin ? t('auth.signIn') || 'Sign In' : t('auth.signUp') || 'Sign Up'}
            </button>
          </div>
        </form>
        
        <div className="text-center pt-4 border-t border-slate-50 dark:border-slate-800">
            <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-emerald-600 dark:text-emerald-500 hover:underline font-bold"
            >
                {isLogin ? t('auth.needAccount') || 'Need an account? Sign up' : t('auth.haveAccount') || 'Have an account? Sign in'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
