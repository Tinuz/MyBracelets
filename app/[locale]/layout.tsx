import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import type { Metadata } from 'next';

const locales = ['en', 'nl'];

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://laninabracelets.com';
  
  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'nl': '/nl',
        'x-default': '/nl',
      },
    },
    openGraph: {
      locale: locale,
      alternateLocale: locales.filter(l => l !== locale),
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Navbar />
      
      {/* Main content with top padding for fixed header */}
      <main className="pt-20">
        {children}
      </main>
      
      <Footer />
    </NextIntlClientProvider>
  );
}