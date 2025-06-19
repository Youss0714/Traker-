import { useState, useEffect } from 'react';
import { getCurrentLanguage, Language } from '@/lib/utils/helpers';
import { t, TranslationKey } from '@/lib/i18n/translations';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>(getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(getCurrentLanguage());
    };

    // Listen for language changes
    window.addEventListener('language-change', handleLanguageChange);
    
    return () => {
      window.removeEventListener('language-change', handleLanguageChange);
    };
  }, []);

  const translate = (key: TranslationKey): string => {
    return t(key, language);
  };

  return { language, translate, t: translate };
}