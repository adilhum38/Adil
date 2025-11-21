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
      // Register Logic
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
        city: City.ALMATY, // Default
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            {isLogin ? t('auth.signInTitle') || 'Sign in' : t('auth.createAccount') || 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isLogin ? t('auth.welcomeBack') || 'Welcome back to the hub' : t('auth.joinCommunity') || 'Join the community'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.fullName') || 'Full Name'}</label>
                <input
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.email') || 'Email'}</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.password') || 'Password'}</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {!isLogin && (
             <div className="flex items-center justify-center space-x-4 mb-4">
                <button
                    type="button"
                    onClick={() => setRole(UserRole.FREELANCER)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${role === UserRole.FREELANCER ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-500'}`}
                >
                    {t('auth.iAmFreelancer') || 'I am a Freelancer'}
                </button>
                <button
                    type="button"
                    onClick={() => setRole(UserRole.CLIENT)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${role === UserRole.CLIENT ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-500'}`}
                >
                    {t('auth.iAmClient') || 'I am a Client'}
                </button>
             </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              {isLogin ? t('auth.signIn') || 'Sign In' : t('auth.signUp') || 'Sign Up'}
            </button>
          </div>
        </form>
        
        <div className="text-center">
            <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-emerald-600 hover:text-emerald-500 font-medium"
            >
                {isLogin ? t('auth.needAccount') || 'Need an account? Sign up' : t('auth.haveAccount') || 'Have an account? Sign in'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;