'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-24">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-display font-bold text-lg mb-4">La Nina Bracelets</h3>
            <p className="text-sm mb-4">
              Handgemaakte sieraden met passie en precisie.
            </p>
            <div className="space-y-2 text-sm">
              <p><strong className="text-white">KVK:</strong> 12345678</p>
              <p><strong className="text-white">BTW:</strong> NL123456789B01</p>
              <p className="mt-4">
                <strong className="text-white">Adres:</strong><br />
                Voorbeeldstraat 123<br />
                1234 AB Amsterdam<br />
                Nederland
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4">Ontdek</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}`} className="hover:text-primary-400 transition-colors">
                  {t('navigation.home')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/bracelets`} className="hover:text-primary-400 transition-colors">
                  {t('navigation.collection')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/designer`} className="hover:text-primary-400 transition-colors">
                  {t('navigation.designer')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="hover:text-primary-400 transition-colors">
                  {t('navigation.about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/sizing`} className="hover:text-primary-400 transition-colors">
                  Maatadvies
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4">Klantenservice</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-primary-400 transition-colors">
                  {t('navigation.contact')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="hover:text-primary-400 transition-colors">
                  Veelgestelde Vragen
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/returns`} className="hover:text-primary-400 transition-colors">
                  Retourbeleid
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/giftcard`} className="hover:text-primary-400 transition-colors">
                  Cadeaubon
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shipping`} className="hover:text-primary-400 transition-colors">
                  Verzendbeleid
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4">Informatie</h3>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <Link href={`/${locale}/privacy`} className="hover:text-primary-400 transition-colors">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="hover:text-primary-400 transition-colors">
                  Algemene Voorwaarden
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookies`} className="hover:text-primary-400 transition-colors">
                  Cookiebeleid
                </Link>
              </li>
            </ul>

            {/* Trust Badges Placeholder */}
            <div className="space-y-2">
              <p className="text-xs text-neutral-400">Vertrouwd door:</p>
              <div className="flex gap-2">
                <div className="bg-neutral-800 px-3 py-1 rounded text-xs">
                  ⭐ Google Reviews
                </div>
              </div>
              <div className="flex gap-2">
                <div className="bg-neutral-800 px-3 py-1 rounded text-xs">
                  ⭐ Trustpilot
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} La Nina Bracelets. Alle rechten voorbehouden.</p>
            </div>
            <div className="flex gap-4">
              <Link href={`mailto:support@laninabracelets.com`} className="hover:text-primary-400 transition-colors">
                support@laninabracelets.com
              </Link>
              <span className="text-neutral-600">|</span>
              <a href="tel:+31612345678" className="hover:text-primary-400 transition-colors">
                +31 (0)6 12345678
              </a>
            </div>
          </div>
          
          <div className="mt-4 text-center md:text-left">
            <p className="text-xs text-neutral-500">
              🔒 Veilig betalen met iDEAL, PayPal, Bancontact | 🚚 Gratis verzending vanaf €50 | ↩️ 30 dagen retourrecht
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
