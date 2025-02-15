import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../i18n/translations';

export const LanguageSelector: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <label htmlFor="language" className="text-sm text-gray-400">
        {t('language')}:
      </label>
      <select
        id="language"
        value={language}
        onChange={handleLanguageChange}
        className="bg-gray-700 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="en">{t('english')}</option>
        <option value="es">{t('spanish')}</option>
      </select>
    </div>
  );
}