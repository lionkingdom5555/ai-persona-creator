import React from 'react';
import { useTranslations } from '../i18n/useTranslations';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
  <div className="aspect-square w-full bg-slate-800 rounded-lg animate-pulse"></div>
);

const Placeholder: React.FC = () => {
    const { t } = useTranslations();
    return (
        <div className="aspect-square w-full bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center p-8 text-center">
        <svg className="w-16 h-16 text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <h3 className="text-xl font-semibold text-slate-300">{t('imageDisplayTitle')}</h3>
        <p className="text-slate-400 mt-2">{t('imageDisplaySubtitle')}</p>
        </div>
    );
};


const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => {
    const { t } = useTranslations();
    return (
        <div className="aspect-square w-full bg-red-900/20 border border-red-500 rounded-lg flex flex-col items-center justify-center p-8 text-center">
        <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h3 className="text-xl font-semibold text-red-300">{t('imageDisplayErrorTitle')}</h3>
        <p className="text-red-400 mt-2">{message}</p>
        </div>
    );
};


export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, isLoading, error }) => {
  const { t } = useTranslations();

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }
    if (error) {
      return <ErrorDisplay message={error} />;
    }
    if (imageUrl) {
      return (
        <div className="relative group">
          <img
            src={imageUrl}
            alt="Generated AI Persona"
            className="w-full aspect-square object-cover rounded-lg shadow-2xl"
          />
          <a
            href={imageUrl}
            download="ai-persona.png"
            className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white py-2 px-4 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>{t('imageDisplayDownload')}</span>
          </a>
        </div>
      );
    }
    return <Placeholder />;
  };

  return <div className="w-full max-w-2xl mx-auto">{renderContent()}</div>;
};