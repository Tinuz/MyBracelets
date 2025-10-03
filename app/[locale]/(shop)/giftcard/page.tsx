'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';

export default function GiftCardPage() {
  const t = useTranslations('giftcard');

  const amounts = [
    { value: 25, key: '25' },
    { value: 50, key: '50' },
    { value: 100, key: '100' },
  ];

  return (
    <Section className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-neutral-600 mb-4">
            {t('subtitle')}
          </p>
          <p className="text-neutral-600">
            {t('description')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {amounts.map(({ value, key }) => (
            <Card key={key} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  €{value}
                </div>
                <p className="text-neutral-600">{t(`amounts.${key}`)}</p>
                <button className="mt-6 w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                  Koop Nu
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-secondary-50 border-secondary-200">
          <CardHeader>
            <CardTitle>{t('amounts.custom')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <input
                type="number"
                min="10"
                placeholder="Bedrag in €"
                className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Koop Nu
              </button>
            </div>
            <p className="text-sm text-neutral-600 mt-4">
              Minimum bedrag: €10
            </p>
          </CardContent>
        </Card>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Hoe werkt het?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">1. Kies je bedrag</h3>
                <p className="text-neutral-600">Selecteer een vooraf ingesteld bedrag of kies je eigen bedrag.</p>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">2. Ontvang de code</h3>
                <p className="text-neutral-600">Je ontvangt direct een unieke cadeaubon code per email.</p>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">3. Geef cadeau</h3>
                <p className="text-neutral-600">Geef de code cadeau of gebruik hem zelf bij het afrekenen.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
