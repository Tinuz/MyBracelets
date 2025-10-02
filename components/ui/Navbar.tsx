"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getCartCount } from '@/lib/cart';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { Button, Badge } from '@/components/ui';
import { MiniCart } from './MiniCart';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Update cart count on component mount and when localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartCount());
    };

    // Initial load
    updateCartCount();

    // Listen for storage changes (when items are added/removed from cart)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bracelet-cart') {
        updateCartCount();
      }
    };

    // Listen for custom cart events (for same-tab updates)
    const handleCartChange = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cart-updated', handleCartChange);

    // Set up interval to check for cart changes (fallback)
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cart-updated', handleCartChange);
      clearInterval(interval);
    };
  }, []);

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: `/${locale}`, label: t('navigation.home') },
    { href: `/${locale}/bracelets`, label: t('navigation.collection') },
    { href: `/${locale}/designer`, label: t('navigation.designer') },
    { href: `/${locale}/about`, label: t('navigation.about') },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      "bg-white/95 backdrop-blur-md",
      {
        "shadow-brand border-b border-primary-100": isScrolled,
        "shadow-none border-b-0": !isScrolled,
      }
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link 
              href={`/${locale}`} 
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity group"
            >
              <div className="relative w-10 h-10 overflow-hidden rounded-xl">
                <Image 
                  src="/images/logo.png"
                  alt="La Nina Bracelets"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-neutral-900">
                  La Nina Bracelets
                </h1>
                <p className="text-xs text-neutral-600 -mt-1">{t('common.tagline')}</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 font-medium transition-all duration-200 group",
                  {
                    "text-primary-600": isActive(item.href),
                    "text-neutral-700 hover:text-primary-600": !isActive(item.href),
                  }
                )}
              >
                {item.label}
                <span className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5 bg-gradient-brand rounded-full transition-transform duration-200",
                  {
                    "scale-x-100": isActive(item.href),
                    "scale-x-0 group-hover:scale-x-100": !isActive(item.href),
                  }
                )} />
              </Link>
            ))}
          </nav>

          {/* Actions - Language, Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Desktop Cart Button */}
            <div className="relative">
              <button
                onClick={() => setIsMiniCartOpen(!isMiniCartOpen)}
                onMouseEnter={() => cartCount > 0 && setIsMiniCartOpen(true)}
                className={cn(
                  "relative group flex items-center space-x-2 p-3 rounded-2xl transition-all duration-200 hover:bg-primary-50",
                  {
                    "bg-primary-50 text-primary-600": isActive('/cart') || isMiniCartOpen,
                    "text-neutral-700": !isActive('/cart') && !isMiniCartOpen,
                  }
                )}
              >
                <div className="relative">
                  <svg 
                    className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                    />
                  </svg>
                  
                  {/* Cart Count Badge */}
                  {cartCount > 0 && (
                    <Badge 
                      variant="error" 
                      size="sm"
                      className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center animate-in zoom-in-50 duration-200"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </Badge>
                  )}
                </div>
                <span className="hidden xl:inline font-medium">{t('navigation.cart')}</span>
              </button>

              {/* Mini Cart */}
              <MiniCart 
                isOpen={isMiniCartOpen}
                onClose={() => setIsMiniCartOpen(false)}
              />
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button 
                asChild
                variant="gradient"
                size="default"
                className="shadow-soft hover:shadow-medium"
              >
                <Link href={`/${locale}/designer`}>
                  {t('common.designNow')}
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative p-3 rounded-2xl text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 group"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 relative">
                <span className={cn(
                  "absolute w-6 h-0.5 bg-current transform transition-all duration-300 rounded-full",
                  isMobileMenuOpen ? "rotate-45 top-3" : "top-1"
                )} />
                <span className={cn(
                  "absolute w-6 h-0.5 bg-current transform transition-all duration-300 rounded-full top-3",
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                )} />
                <span className={cn(
                  "absolute w-6 h-0.5 bg-current transform transition-all duration-300 rounded-full",
                  isMobileMenuOpen ? "-rotate-45 top-3" : "top-5"
                )} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <div className="fixed top-20 left-0 right-0 bg-white border-t border-primary-100 shadow-brand z-50 lg:hidden animate-in slide-in-from-top-2 duration-300">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="py-6 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-2xl text-base font-medium transition-all duration-200",
                        {
                          "bg-primary-50 text-primary-600": isActive(item.href),
                          "text-neutral-700 hover:bg-primary-50 hover:text-primary-600": !isActive(item.href),
                        }
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  {/* Mobile Cart Link */}
                  <Link
                    href={`/${locale}/cart`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium transition-all duration-200",
                      {
                        "bg-primary-50 text-primary-600": isActive('/cart'),
                        "text-neutral-700 hover:bg-primary-50 hover:text-primary-600": !isActive('/cart'),
                      }
                    )}
                  >
                    <span>{t('navigation.cart')}</span>
                    <div className="flex items-center space-x-2">
                      {cartCount > 0 && (
                        <Badge variant="error" size="sm">
                          {cartCount}
                        </Badge>
                      )}
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                        />
                      </svg>
                    </div>
                  </Link>

                  {/* Mobile CTA */}
                  <div className="pt-4 border-t border-primary-100 mt-4">
                    <Button 
                      asChild
                      variant="gradient"
                      size="lg"
                      className="w-full justify-center shadow-soft"
                    >
                      <Link href={`/${locale}/designer`} onClick={() => setIsMobileMenuOpen(false)}>
                        {t('common.designYourBracelet')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}