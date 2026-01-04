
import React from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onFindWork: () => void;
  onFindTalent: () => void;
}

const Hero: React.FC<HeroProps> = ({ onFindWork, onFindTalent }) => {
  const { t } = useLanguage();

  return (
    <div className="relative bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white dark:bg-slate-950 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 transition-colors duration-300">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 dark:text-slate-50 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">{t('hero.titlePrefix')}</span>{' '}
                <span className="block text-emerald-600 dark:text-emerald-500 xl:inline">{t('hero.titleHighlight')}</span>
              </h1>
              <p className="mt-3 text-base text-slate-500 dark:text-slate-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                {t('hero.subtitle')}
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button
                    onClick={onFindTalent}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg transition-all"
                  >
                    {t('hero.findTalent')}
                    <Search className="ml-2 w-5 h-5" />
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    onClick={onFindWork}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 hover:bg-emerald-200 dark:hover:bg-emerald-900/40 md:py-4 md:text-lg transition-all"
                  >
                    {t('hero.findWork')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://picsum.photos/1200/800?random=10"
          alt="Creative teamwork"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-slate-950 via-white/50 dark:via-slate-950/50 to-transparent lg:via-white/10"></div>
      </div>
    </div>
  );
};

export default Hero;
