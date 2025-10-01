// Simple i18n configuration
export const locales = ['en', 'nl'] as const;
export const defaultLocale = 'en' as const;
export type Locale = (typeof locales)[number];

// Get messages for a specific locale
export async function getMessages(locale: string) {
  try {
    return (await import(`./messages/${locale}.json`)).default;
  } catch {
    return (await import(`./messages/${defaultLocale}.json`)).default;
  }
}

// Detect user's preferred locale
export function detectLocale(request?: Request): Locale {
  if (typeof window !== 'undefined') {
    // Client-side: use navigator language or localStorage
    const stored = localStorage.getItem('preferred-locale');
    if (stored && locales.includes(stored as Locale)) {
      return stored as Locale;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'nl') return 'nl';
  }
  
  if (request) {
    // Server-side: use Accept-Language header
    const acceptLanguage = request.headers.get('Accept-Language') || '';
    if (acceptLanguage.includes('nl')) return 'nl';
  }
  
  return defaultLocale;
}