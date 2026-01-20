'use client';

import { Link } from '@/i18n/routing';
import NextLink from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { Button } from './ui/button';
import { Building2, User, LogOut } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const t = useTranslations('common');

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* House shape */}
                <path d="M 30 45 L 50 30 L 70 45 L 70 70 L 30 70 Z" fill="white"/>
                {/* Roof */}
                <path d="M 25 45 L 50 25 L 75 45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                {/* Door */}
                <rect x="44" y="55" width="12" height="15" fill="#2563eb" rx="1"/>
              </svg>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              inhabitme
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link href="/search" className="text-gray-700 hover:text-gray-900 hidden sm:block">
              {t('search')}
            </Link>
            
            {user ? (
              <>
                <Link href="/properties/new" className="text-gray-700 hover:text-gray-900 hidden md:block">
                  {t('publishProperty')}
                </Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 hidden sm:block">
                  {t('dashboard')}
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 hidden sm:flex">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {user.emailAddresses?.[0]?.emailAddress?.split('@')[0] || user.firstName || 'User'}
                    </span>
                  </div>
                  <Button
                    onClick={() => signOut()}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('logout')}</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <NextLink href="/sign-in">
                  <Button variant="outline" size="sm">
                    {t('signIn')}
                  </Button>
                </NextLink>
                <NextLink href="/sign-up">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    {t('signUp')}
                  </Button>
                </NextLink>
              </div>
            )}
            
            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}