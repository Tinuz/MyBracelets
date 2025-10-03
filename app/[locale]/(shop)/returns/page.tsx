'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { CheckCircleIcon } from '@/components/ui/Icons';

export default function ReturnsPage() {
  const t = useTranslations('returns');

  return (
    <Section className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-neutral-600">
            {t('subtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ons Retourbeleid</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <CheckCircleIcon size={24} className="text-secondary-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Introductie</h3>
                <p className="text-neutral-600">{t('policy.intro')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircleIcon size={24} className="text-secondary-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Retourperiode</h3>
                <p className="text-neutral-600">{t('policy.period')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircleIcon size={24} className="text-secondary-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Voorwaarden</h3>
                <p className="text-neutral-600">{t('policy.condition')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircleIcon size={24} className="text-secondary-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Retourproces</h3>
                <p className="text-neutral-600">{t('policy.process')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircleIcon size={24} className="text-secondary-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Terugbetaling</h3>
                <p className="text-neutral-600">{t('policy.refund')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-neutral-600 mb-4">Vragen over retourneren?</p>
          <a
            href="/nl/contact"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Neem Contact Op
          </a>
        </div>
      </div>
    </Section>
  );
}
