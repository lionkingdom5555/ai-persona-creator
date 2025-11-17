import React from 'react';
import { useTranslations } from '../i18n/useTranslations';

export const Header: React.FC = () => {
  const { t, setLanguage, language } = useTranslations();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'en' | 'zh' | 'ja');
  };

  return (
    <header className="relative py-6 px-4 text-center border-b border-slate-700 shadow-lg bg-slate-900/70 backdrop-blur-sm">
      <div className="container mx-auto flex justify-center items-center">
        <div className="flex-grow text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            {t('headerTitle')}
          </h1>
          <p className="text-slate-400 mt-2 text-md md:text-lg">{t('headerTagline')}</p>
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          <div className="relative">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="appearance-none bg-slate-800 border border-slate-600 rounded-md shadow-sm py-2 pl-3 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition cursor-pointer"
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};