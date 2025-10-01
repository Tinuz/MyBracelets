import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar'

const locales = ['en', 'nl'];

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
      
      <footer className="bg-neutral-50 border-t border-neutral-200 mt-24">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-neutral-500">
            <p className="font-medium">&copy; 2024 La Nina Bracelets. All rights reserved.</p>
            <p className="text-sm mt-2">Handcrafted jewelry made with love</p>
          </div>
        </div>
      </footer>
    </NextIntlClientProvider>
  );
}