import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type LanguageCode =
  | 'en'
  | 'fr'
  | 'es'
  | 'de'
  | 'pt'
  | 'ar'
  | 'sw'
  | 'zh';

export type Language = {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
};

export const LANGUAGES: Language[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  { code: 'sw', label: 'Swahili', nativeLabel: 'Kiswahili' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文' },
];

type LanguageContextValue = {
  languages: Language[];
  language: Language;
  setLanguage: (code: LanguageCode) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<LanguageCode>('en');

  const setLanguage = useCallback((next: LanguageCode) => setCode(next), []);

  const language = useMemo(
    () => LANGUAGES.find((item) => item.code === code) ?? LANGUAGES[0],
    [code],
  );

  const value = useMemo(
    () => ({ languages: LANGUAGES, language, setLanguage }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
