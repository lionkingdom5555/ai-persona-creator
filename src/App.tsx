import React, { useState, useCallback } from 'react';
import { PersonaForm } from './components/PersonaForm';
import { ImageDisplay } from './components/ImageDisplay';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { generatePersonaImage } from './services/geminiService';
import { LanguageProvider } from './i18n/languageContext';
import { useTranslations } from './i18n/useTranslations';
import type { PersonaFormData } from './types';

const AppContent: React.FC = () => {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslations();

  const handleGenerate = useCallback(async (formData: PersonaFormData) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    const { persona, details, style, gender, image } = formData;

    const textPrompt = image
      ? `Using the provided image as a base, transform the person to look like a ${gender} ${persona}, in a ${style} style. ${details}. Ensure the facial features from the original image are recognizable.`
      : `Professional headshot of a ${gender} ${persona}, ${style} style. ${details}. High-resolution, detailed, realistic lighting.`;

    try {
      const imageUrl = await generatePersonaImage(textPrompt, image);
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : t('errorDefault');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
        <div className="w-full lg:w-1/3 lg:sticky lg:top-12">
          <PersonaForm onGenerate={handleGenerate} isLoading={isLoading} />
        </div>
        <div className="w-full lg:w-2/3">
          <ImageDisplay imageUrl={generatedImageUrl} isLoading={isLoading} error={error} />
        </div>
      </main>
      <Footer />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;