import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://laninabracelets.com';
  const locales = ['nl', 'en'];
  const pages = [
    '',
    '/bracelets',
    '/designer',
    '/about',
    '/contact',
    '/faq',
    '/returns',
    '/giftcard',
    '/sizing',
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    pages.forEach((page) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            nl: `${baseUrl}/nl${page}`,
            en: `${baseUrl}/en${page}`,
          },
        },
      });
    });
  });

  return sitemap;
}
