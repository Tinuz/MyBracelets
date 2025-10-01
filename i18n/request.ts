import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Use Dutch as default since our implementation handles 
  // client-side switching via LanguageProvider
  const locale = 'nl';
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});