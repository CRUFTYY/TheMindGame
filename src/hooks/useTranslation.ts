import { create } from 'zustand';
import { translations, Language, TranslationKey } from '../i18n/translations';

interface I18nStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const useI18nStore = create<I18nStore>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language })
}));

export function useTranslation() {
  const { language, setLanguage } = useI18nStore();
  
  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    let text = translations[language][key] || translations.en[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        text = text.replace(`{${key}}`, String(value));
      });
    }
    
    return text;
  };
  
  return { t, language, setLanguage };
}