'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { TruckIcon, CheckCircleIcon } from '@/components/ui/Icons';

export default function ShippingPage() {
  const t = useTranslations('shipping');

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

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon size={32} className="text-primary-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">
                {t('domestic.title')}
              </h3>
              <p className="text-neutral-600 mb-3">
                {t('domestic.description')}
              </p>
              <div className="text-lg font-semibold text-primary-600">
                {t('domestic.price')}
              </div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon size={32} className="text-secondary-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">
                {t('belgium.title')}
              </h3>
              <p className="text-neutral-600 mb-3">
                {t('belgium.description')}
              </p>
              <div className="text-lg font-semibold text-secondary-600">
                {t('belgium.price')}
              </div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon size={32} className="text-accent-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">
                {t('europe.title')}
              </h3>
              <p className="text-neutral-600 mb-3">
                {t('europe.description')}
              </p>
              <div className="text-lg font-semibold text-accent-600">
                {t('europe.price')}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircleIcon size={24} className="text-secondary-500" />
                <CardTitle>{t('tracking.title')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                {t('tracking.description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircleIcon size={24} className="text-secondary-500" />
                <CardTitle>{t('processing.title')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                {t('processing.description')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-12 bg-primary-50 border-primary-200">
          <CardContent className="p-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-4">
              Vragen over verzending?
            </h2>
            <p className="text-neutral-600 mb-6">
              Neem gerust contact met ons op voor meer informatie over verzending en levering.
            </p>
            <a
              href="/nl/contact"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Neem Contact Op
            </a>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
