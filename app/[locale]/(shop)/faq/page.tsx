'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { useState } from 'react';

export default function FAQPage() {
  const t = useTranslations('faq');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const questions = ['shipping', 'custom', 'returns', 'care'];

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

        <div className="space-y-4">
          {questions.map((key) => (
            <Card key={key} className="overflow-hidden">
              <button
                className="w-full text-left"
                onClick={() => setOpenQuestion(openQuestion === key ? null : key)}
              >
                <CardHeader className="cursor-pointer hover:bg-neutral-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      {t(`questions.${key}.q`)}
                    </CardTitle>
                    <span className="text-2xl text-primary-600">
                      {openQuestion === key ? '−' : '+'}
                    </span>
                  </div>
                </CardHeader>
              </button>
              
              {openQuestion === key && (
                <CardContent className="pt-0">
                  <p className="text-neutral-600 leading-relaxed">
                    {t(`questions.${key}.a`)}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="p-8">
              <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-4">
                Vraag niet beantwoord?
              </h2>
              <p className="text-neutral-600 mb-6">
                Neem contact met ons op en we helpen je graag verder!
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
      </div>
    </Section>
  );
}
