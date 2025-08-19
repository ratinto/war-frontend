import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

// Create context with default values
const LanguageContext = createContext({
    language: "en",
    setLanguage: () => { },
    translations: translations,
    t: () => "",
});

// Custom hook for using the language context
export const useLanguage = () => {
    return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState(() => {
        // Initialize from localStorage or default to 'en'
        const savedLanguage = localStorage.getItem("preferred-language");
        return savedLanguage || "en";
    });

    const setLanguage = (lang) => {
        setLanguageState(lang);
        localStorage.setItem("preferred-language", lang);
    };

    const t = (key) => {
        if (translations[language] && translations[language][key]) {
            return translations[language][key];
        }

        if (translations.en[key]) {
            return translations.en[key];
        }

        return key;
    };

    // Sync <html lang="..."> with current language
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    return (
        <LanguageContext.Provider
            value={{ language, setLanguage, translations, t }}
        >
            {children}
        </LanguageContext.Provider>
    );
};