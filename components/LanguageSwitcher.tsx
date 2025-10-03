"use client";

import React from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languageNames = {
    en: 'English',
    nl: 'Nederlands'
  };

  const flags = {
    en: '🇺🇸',
    nl: '🇳🇱'
  };

  const locales = ['en', 'nl'];

  const switchLocale = (newLocale: string) => {
    // Remove the current locale from the pathname and replace with new locale
    const segments = pathname.split('/');
    segments[1] = newLocale; // Replace the locale segment
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <div className={`relative ${className}`}>
      <select
        value={locale}
        onChange={(e) => switchLocale(e.target.value)}
        className="appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2.5 pr-9 text-xl cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
        aria-label="Selecteer taal"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {flags[loc as keyof typeof flags]}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
        <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}