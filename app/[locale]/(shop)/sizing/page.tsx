'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import Image from 'next/image';

export default function SizingPage() {
  const t = useTranslations('sizing');

  const sizes = [
    { size: 'S', cm: '16-17cm', description: 'Klein' },
    { size: 'M', cm: '17-18cm', description: 'Medium' },
    { size: 'L', cm: '18-19cm', description: 'Groot' },
  ];

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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Hoe meet je je pols?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold text-xl">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Meet je pols</h3>
                <p className="text-neutral-600">{t('guide.measure')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold text-xl">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Tel extra toe</h3>
                <p className="text-neutral-600">{t('guide.add')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold text-xl">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Kies je maat</h3>
                <p className="text-neutral-600">{t('guide.standard')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {sizes.map(({ size, cm, description }) => (
            <Card key={size} className="text-center">
              <CardContent className="p-8">
                <div className="text-5xl font-bold text-primary-600 mb-2">
                  {size}
                </div>
                <div className="text-xl font-semibold text-neutral-900 mb-1">
                  {description}
                </div>
                <div className="text-neutral-600">
                  {cm}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-secondary-50 border-secondary-200">
          <CardContent className="p-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-4">
              Hulp nodig?
            </h2>
            <p className="text-neutral-600 mb-6">
              {t('help')}
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
