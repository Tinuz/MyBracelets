import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

// Custom hook for translations
export function useT() {
  return useTranslations();
}

// Get current locale
export function useCurrentLocale() {
  return useLocale();
}

// Utility function to format price based on locale
export function formatPrice(cents: number, locale: string): string {
  const euros = cents / 100;
  return new Intl.NumberFormat(locale === 'nl' ? 'nl-NL' : 'en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(euros);
}

// Get localized text with fallback
export function getLocalizedText(
  text: { en: string; nl: string } | string, 
  locale: string
): string {
  if (typeof text === 'string') return text;
  return text[locale as keyof typeof text] || text.en;
}