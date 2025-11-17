import React, { createContext, useState, useCallback, useMemo, ReactNode } from 'react';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';

type Language = 'en' | 'zh' | 'ja';
type Translations = Record<string, string>;

const translations: Record<Language, Translations> = { en, zh, ja };

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};