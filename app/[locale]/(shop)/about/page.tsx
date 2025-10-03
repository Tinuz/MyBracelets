'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Common';
import { PrimaryButton } from '@/components/ui/Button';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function AboutPage() {
  const locale = useLocale();
  const t = useTranslations('about');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('title')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                {" "}{t('brandName')}
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid gap-8 mb-16">
            
            {/* Our Story */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <span className="text-3xl mr-3">💎</span>
                  {t('story.title')}
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('story.paragraph1')}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {t('story.paragraph2')}
                </p>
              </CardContent>
            </Card>

            {/* Our Process */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <span className="text-3xl mr-3">🔨</span>
                  {t('process.title')}
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <h3 className="font-semibold mb-2">{t('process.design.title')}</h3>
                    <p className="text-sm text-gray-600">{t('process.design.description')}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚒️</span>
                    </div>
                    <h3 className="font-semibold mb-2">{t('process.craft.title')}</h3>
                    <p className="text-sm text-gray-600">{t('process.craft.description')}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📦</span>
                    </div>
                    <h3 className="font-semibold mb-2">{t('process.deliver.title')}</h3>
                    <p className="text-sm text-gray-600">{t('process.deliver.description')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality & Materials */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <span className="text-3xl mr-3">✨</span>
                  {t('quality.title')}
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-lg">{t('quality.metals.title')}</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• {t('quality.metals.item1')}</li>
                      <li>• {t('quality.metals.item2')}</li>
                      <li>• {t('quality.metals.item3')}</li>
                      <li>• {t('quality.metals.item4')}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-lg">{t('quality.charms.title')}</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• {t('quality.charms.item1')}</li>
                      <li>• {t('quality.charms.item2')}</li>
                      <li>• {t('quality.charms.item3')}</li>
                      <li>• {t('quality.charms.item4')}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <span className="text-3xl mr-3">📧</span>
                  {t('contact.title')}
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">{t('contact.support.title')}</h3>
                    <p className="text-gray-700 mb-2">
                      <strong>{t('contact.support.email')}:</strong> support@laninabracelets.com
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>{t('contact.support.responseTime')}:</strong> {t('contact.support.responseValue')}
                    </p>
                    <p className="text-gray-700">
                      <strong>{t('contact.support.available')}:</strong> {t('contact.support.availableValue')}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">{t('contact.custom.title')}</h3>
                    <p className="text-gray-700 mb-4">
                      {t('contact.custom.description')}
                    </p>
                    <PrimaryButton size="sm" asChild>
                      <Link href="mailto:custom@laninabracelets.com">
                        {t('contact.custom.button')}
                      </Link>
                    </PrimaryButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">{t('cta.title')}</h2>
            <p className="text-lg mb-6 opacity-90">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PrimaryButton 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100"
                asChild
              >
                <Link href={`/${locale}/designer`}>
                  {t('cta.startDesigning')}
                </Link>
              </PrimaryButton>
              <PrimaryButton 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600"
                asChild
              >
                <Link href={`/${locale}/bracelets`}>
                  {t('cta.browseBracelets')}
                </Link>
              </PrimaryButton>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}