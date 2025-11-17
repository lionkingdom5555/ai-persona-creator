import React from 'react';
import { useTranslations } from '../i18n/useTranslations';

export const Footer: React.FC = () => {
  const { t } = useTranslations();
  return (
    <footer className="text-center py-6 px-4 text-slate-500 border-t border-slate-800 text-sm">
      <p>&copy; {new Date().getFullYear()} {t('footerCopyright')}</p>
    </footer>
  );
};