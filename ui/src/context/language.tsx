import { createContext, useContext, useEffect, useState } from 'react';

interface LanguageContextType {
  moduleLanguage: Record<string, string>;
  setModuleLanguage: (path: string, lang: string) => void;
}

const defaultContextValue: LanguageContextType = {
  moduleLanguage: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setModuleLanguage: () => {},
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [moduleLanguage, setModuleLanguageState] = useState<
    Record<string, string>
  >(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('moduleLangs') || '{}');
    }
    return {};
  });

  const setModuleLanguage = (path: string, lang: string) => {
    const updatedLangs = { ...moduleLanguage, [path]: lang };
    setModuleLanguageState(updatedLangs);
    localStorage.setItem('moduleLangs', JSON.stringify(updatedLangs));
    window.dispatchEvent(new Event('languageChange'));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedLangs = JSON.parse(
        localStorage.getItem('moduleLangs') || '{}',
      );
      setModuleLanguageState(storedLangs);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('languageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange', handleStorageChange);
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ moduleLanguage, setModuleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useModuleLanguage = () => useContext(LanguageContext);
