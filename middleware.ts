import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'nl'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Automatically detect locale based on Accept-Language header
  localeDetection: true
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(nl|en)/:path*']
};