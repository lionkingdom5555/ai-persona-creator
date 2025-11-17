import React, { useState, useRef } from 'react';
import { PERSONA_OPTIONS, STYLE_OPTIONS, GENDER_OPTIONS } from '../constants';
import { useTranslations } from '../i18n/useTranslations';
import type { PersonaFormData } from '../types';

interface PersonaFormProps {
  onGenerate: (formData: PersonaFormData) => void;
  isLoading: boolean;
}

const FormLabel: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-300 mb-2">{children}</label>
);

const SelectInput: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select {...props} className="w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" />
);

export const PersonaForm: React.FC<PersonaFormProps> = ({ onGenerate, isLoading }) => {
  const { t } = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<PersonaFormData>({
    persona: PERSONA_OPTIONS[0].value,
    details: 'in a modern office setting, looking confident and approachable',
    style: STYLE_OPTIONS[0].value,
    gender: GENDER_OPTIONS[0].value,
    image: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, image: null }));
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-2xl">
      <div>
        <FormLabel>{t('personaFormUploadImage')}</FormLabel>
        <p className="text-xs text-slate-400 mb-3">{t('personaFormUploadPrompt')}</p>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg"
            className="hidden"
            />
        {formData.image ? (
            <div className="mt-2 space-y-3">
                <img src={formData.image} alt="Preview" className="w-full rounded-md object-cover aspect-square" />
                <div className="flex space-x-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 text-sm py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors">{t('personaFormChangeImage')}</button>
                    <button type="button" onClick={handleImageRemove} className="text-sm py-2 px-3 bg-red-800/50 hover:bg-red-800/80 text-red-300 rounded-md transition-colors">{t('personaFormRemoveImage')}</button>
                </div>
            </div>
        ) : (
            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full text-center py-4 px-3 border-2 border-dashed border-slate-600 hover:border-purple-500 rounded-md transition-colors">
                <span className="text-slate-400 text-sm">{t('personaFormUploadImage')}</span>
            </button>
        )}
      </div>
       <hr className="border-slate-700" />
      <div>
        <FormLabel htmlFor="persona">{t('personaFormBasePersona')}</FormLabel>
        <SelectInput id="persona" name="persona" value={formData.persona} onChange={handleChange}>
          {PERSONA_OPTIONS.map(option => <option key={option.value} value={option.value}>{t(option.key)}</option>)}
        </SelectInput>
      </div>
      <div>
        <FormLabel htmlFor="gender">{t('personaFormGender')}</FormLabel>
        <SelectInput id="gender" name="gender" value={formData.gender} onChange={handleChange}>
          {GENDER_OPTIONS.map(option => <option key={option.value} value={option.value}>{t(option.key)}</option>)}
        </SelectInput>
      </div>
      <div>
        <FormLabel htmlFor="style">{t('personaFormArtStyle')}</FormLabel>
        <SelectInput id="style" name="style" value={formData.style} onChange={handleChange}>
          {STYLE_OPTIONS.map(option => <option key={option.value} value={option.value}>{t(option.key)}</option>)}
        </SelectInput>
      </div>
      <div>
        <FormLabel htmlFor="details">{t('personaFormAdditionalDetails')}</FormLabel>
        <textarea
          id="details"
          name="details"
          rows={4}
          value={formData.details}
          onChange={handleChange}
          className="w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          placeholder={t('personaFormDetailsPlaceholder')}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('personaFormGenerating')}
          </>
        ) : (
          t('personaFormGenerate')
        )}
      </button>
    </form>
  );
};