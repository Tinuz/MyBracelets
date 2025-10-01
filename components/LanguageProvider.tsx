"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Locale, defaultLocale, locales } from '@/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, any>) => string;
  messages: Record<string, any>;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Record<string, any>>({});

  // Load messages when locale changes
  useEffect(() => {
    async function loadMessages() {
      try {
        const msgs = await import(`@/messages/${locale}.json`);
        setMessages(msgs.default);
      } catch (error) {
        console.error('Failed to load messages for locale:', locale);
        // Fallback to English
        const fallbackMsgs = await import('@/messages/en.json');
        setMessages(fallbackMsgs.default);
      }
    }
    
    loadMessages();
  }, [locale]);

  // Detect initial locale from browser/localStorage
  useEffect(() => {
    // Check localStorage first
    const stored = localStorage.getItem('preferred-locale');
    if (stored && locales.includes(stored as Locale)) {
      setLocaleState(stored as Locale);
      return;
    }

    // Detect from browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'nl') {
      setLocaleState('nl');
    } else {
      setLocaleState('en');
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('preferred-locale', newLocale);
  };

  // Translation function with nested key support
  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.');
    let value: any = messages;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    // Replace parameters if provided
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match: string, paramKey: string) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, messages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}