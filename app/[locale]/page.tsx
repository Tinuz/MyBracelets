'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button, Card, CardContent, CardHeader, Section, Stepper, Badge } from '@/components/ui';
import { PaletteIcon, HeartIcon, TruckIcon, ShieldCheckIcon } from '@/components/ui/Icons';
import { useTranslations, useLocale } from 'next-intl';
import type { Step } from '@/components/ui';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const howItWorksSteps: Step[] = [
    {
      id: '1',
      title: t('homepage.steps.step1.title'),
      description: t('homepage.steps.step1.description'),
      status: 'complete'
    },
    {
      id: '2', 
      title: t('homepage.steps.step2.title'),
      description: t('homepage.steps.step2.description'),
      status: 'current'
    },
    {
      id: '3',
      title: t('homepage.steps.step3.title'),
      description: t('homepage.steps.step3.description'),
      status: 'pending'
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section - Elegant Rose Gold Redesign */}
      <Section 
        variant="gradient" 
        className="relative bg-gradient-to-br from-secondary-50 via-primary-100 to-primary-300 min-h-[85vh] flex items-center overflow-hidden"
      >
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(193,147,104,0.3),transparent_50%)] animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Hero Content - Left Side */}
            <div className="text-left space-y-8">
              
              {/* Badge */}
              <div className="inline-block">
                <div className="px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-primary-300/50 text-primary-700 text-sm font-medium shadow-lg">
                  ✨ {t('homepage.hero.badge')}
                </div>
              </div>
              
              {/* Main Heading */}
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-secondary-900 leading-[1.1] tracking-tight">
                {t('homepage.hero.title')}
                <br />
                <span className="text-primary-700">
                  {t('homepage.hero.subtitle')}
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-secondary-800 leading-relaxed max-w-xl font-light">
                {t('homepage.hero.description')}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="xl" 
                  className="shadow-xl hover:shadow-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 font-semibold transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href={`/${locale}/designer`}>
                    <PaletteIcon className="w-5 h-5 mr-2" />
                    {t('homepage.hero.ctaStart')}
                  </Link>
                </Button>
                
                <Button 
                  size="xl" 
                  variant="outline"
                  className="border-2 border-primary-500 bg-white text-primary-700 hover:bg-primary-50 font-semibold transition-all duration-300"
                  asChild
                >
                  <Link href={`/${locale}/bracelets`}>
                    💎 {t('homepage.hero.ctaCollection')}
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2 text-secondary-800">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{t('homepage.hero.trustIndicator1')}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary-800">
                  <TruckIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{t('homepage.hero.trustIndicator2')}</span>
                </div>
              </div>
            </div>

            {/* Hero Visual - Right Side */}
            <div className="relative lg:ml-8">
              {/* White card with shadow */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform lg:scale-105 hover:scale-110 transition-transform duration-500 border border-primary-100">
                {/* Logo */}
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  <Image
                    src="/images/logo.png"
                    alt="La Nina Bracelets"
                    fill
                    priority
                    quality={100}
                    sizes="(max-width: 768px) 90vw, 450px"
                    className="object-contain drop-shadow-xl"
                  />
                </div>
              </div>
              
              {/* Decorative floating elements - updated to rose gold tones */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-300/40 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent-rose/30 rounded-full blur-2xl animate-pulse delay-1000" />
            </div>

          </div>
        </div>
      </Section>

      {/* How It Works Section */}
      <Section id="how-it-works" className="bg-secondary-50">
        <div className="text-center mb-16">
          <Badge variant="primary" size="lg" className="mb-4 bg-primary-100 text-primary-700 border-primary-300">
            ✨ {t('homepage.howItWorks.badge')}
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-secondary-900 mb-6">
            {t('homepage.howItWorks.title')}
          </h2>
          <p className="text-xl text-secondary-700 max-w-2xl mx-auto">
            {t('homepage.howItWorks.description')}
          </p>
        </div>

        <div className="mb-16">
          <Stepper 
            steps={howItWorksSteps}
            orientation="horizontal"
            variant="cards"
          />
        </div>

        {/* Process Details */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-display text-2xl font-semibold text-neutral-900 mb-6">
              {t('homepage.whyDesigner.title')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1">{t('homepage.whyDesigner.feature1.title')}</h4>
                  <p className="text-neutral-600">{t('homepage.whyDesigner.feature1.description')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-xl bg-secondary-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1">{t('homepage.whyDesigner.feature2.title')}</h4>
                  <p className="text-neutral-600">{t('homepage.whyDesigner.feature2.description')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1">{t('homepage.whyDesigner.feature3.title')}</h4>
                  <p className="text-neutral-600">{t('homepage.whyDesigner.feature3.description')}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button variant="gradient" size="lg" asChild>
                <Link href={`/${locale}/designer`}>
                  {t('homepage.whyDesigner.cta')}
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-brand bg-gradient-secondary">
              {/* Fallback content always visible */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl mb-4">🎨</div>
                  <p className="text-lg font-medium">Interactive Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* USPs Section */}
      <Section variant="soft" className="bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-neutral-900 mb-6">
            {t('homepage.usps.title')}
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            {t('homepage.usps.description')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center border-0 shadow-soft hover:shadow-medium transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <PaletteIcon size={32} className="text-white" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-3 text-neutral-900">{t('homepage.usps.usp1.title')}</h3>
              <p className="text-neutral-600 leading-relaxed">
                {t('homepage.usps.usp1.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-soft hover:shadow-medium transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <HeartIcon size={32} className="text-white" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-3 text-neutral-900">{t('homepage.usps.usp2.title')}</h3>
              <p className="text-neutral-600 leading-relaxed">
                {t('homepage.usps.usp2.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-soft hover:shadow-medium transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TruckIcon size={32} className="text-white" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-3 text-neutral-900">{t('homepage.usps.usp3.title')}</h3>
              <p className="text-neutral-600 leading-relaxed">
                {t('homepage.usps.usp3.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-soft hover:shadow-medium transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheckIcon size={32} className="text-white" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-3 text-neutral-900">{t('homepage.usps.usp4.title')}</h3>
              <p className="text-neutral-600 leading-relaxed">
                {t('homepage.usps.usp4.description')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-primary-600">2.500+</div>
              <p className="text-neutral-600">{t('homepage.socialProof.customers')}</p>
            </div>
            <div className="w-px h-12 bg-neutral-200" />
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-secondary-600">15.000+</div>
              <p className="text-neutral-600">{t('homepage.socialProof.bracelets')}</p>
            </div>
            <div className="w-px h-12 bg-neutral-200" />
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-accent-600">4.9★</div>
              <p className="text-neutral-600">{t('homepage.socialProof.rating')}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Reviews Section */}
      <Section className="bg-white">
        <div className="text-center mb-16">
          <Badge variant="secondary" size="lg" className="mb-4">
            💬 {t('homepage.reviews.badge')}
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-neutral-900 mb-6">
            {t('homepage.reviews.title')}
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-soft">
            <CardContent className="p-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-neutral-700 mb-4 leading-relaxed">
                &ldquo;{t('homepage.reviews.review1.quote')}&rdquo;
              </blockquote>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-brand rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">S</span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Sophie</p>
                  <p className="text-sm text-neutral-600">Amsterdam</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-neutral-700 mb-4 leading-relaxed">
                &ldquo;{t('homepage.reviews.review2.quote')}&rdquo;
              </blockquote>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">M</span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Maria</p>
                  <p className="text-sm text-neutral-600">Utrecht</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-neutral-700 mb-4 leading-relaxed">
                &ldquo;{t('homepage.reviews.review3.quote')}&rdquo;
              </blockquote>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">L</span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Lisa</p>
                  <p className="text-sm text-neutral-600">Rotterdam</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section variant="gradient" className="bg-gradient-warm text-white">
        <div className="text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            {t('homepage.finalCta.title')}
            <span className="block text-accent-300">
              {t('homepage.finalCta.subtitle')}
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('homepage.finalCta.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button 
              size="xl" 
              variant="secondary"
              className="shadow-brand hover:shadow-medium bg-white text-primary-600 hover:bg-neutral-50"
              asChild
            >
              <Link href={`/${locale}/designer`}>
                🎨 {t('homepage.finalCta.ctaStart')}
              </Link>
            </Button>
            
            <Button 
              size="xl" 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              asChild
            >
              <Link href={`/${locale}/bracelets`}>
                💎 {t('homepage.finalCta.ctaCollection')}
              </Link>
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="flex items-center justify-center space-x-8 text-white/80">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-accent-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18l-8-4.5V7l8-4.5L18 7v6.5L10 18z" clipRule="evenodd" />
              </svg>
              <span>{t('homepage.finalCta.trustSignal1')}</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <svg className="w-6 h-6 text-accent-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2L2 7l8 5 8-5-8-5zM2 17l8-5 8 5-8 5-8-5z" clipRule="evenodd" />
              </svg>
              <span>{t('homepage.finalCta.trustSignal2')}</span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}