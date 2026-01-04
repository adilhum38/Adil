
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobBoard from './components/JobBoard';
import FreelancerDirectory from './components/FreelancerDirectory';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Auth from './components/Auth';
import CommunityFeed from './components/CommunityFeed';
import Messages from './components/Messages';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { User } from './types';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [targetChatUser, setTargetChatUser] = useState<User | null>(null);
  const { isAuthenticated } = useAuth();

  const handleAuthComplete = () => {
    setCurrentView('home');
  };

  const navigateToMessages = (recipient: User) => {
    setTargetChatUser(recipient);
    setCurrentView('messages');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-500">
            <Hero 
              onFindWork={() => setCurrentView('jobs')} 
              onFindTalent={() => setCurrentView('freelancers')} 
            />
            <CommunityFeed onMessageAuthor={navigateToMessages} />
          </div>
        );
      case 'jobs':
        return <JobBoard onMessageClient={navigateToMessages} />;
      case 'freelancers':
        return <FreelancerDirectory onMessageFreelancer={navigateToMessages} />;
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return isAuthenticated ? <Profile /> : <Auth onComplete={handleAuthComplete} />;
      case 'messages':
        return isAuthenticated ? (
          <Messages initialRecipient={targetChatUser} onClearRecipient={() => setTargetChatUser(null)} />
        ) : (
          <Auth onComplete={handleAuthComplete} />
        );
      case 'auth':
        return <Auth onComplete={handleAuthComplete} />;
      default:
        return <CommunityFeed onMessageAuthor={navigateToMessages} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar currentView={currentView} setView={(v) => { setCurrentView(v); setTargetChatUser(null); }} />
      <main className="flex-grow">
        {renderView()}
      </main>
      
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-slate-400 hover:text-pink-500 transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.409-.06 3.809-.06z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-slate-400">
              &copy; 2025 Freelance Hub KZ. Developer: <span className="text-slate-700 dark:text-slate-300 font-bold">Adil Boranbayev</span>. Made in Almaty.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
