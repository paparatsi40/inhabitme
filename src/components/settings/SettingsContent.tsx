'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { PreferenceToggle } from './PreferenceToggle';
import {
  User, Bell, CreditCard, Shield, Globe, Mail
} from 'lucide-react';

interface UserPreferences {
  email_new_leads: boolean;
  email_new_bookings: boolean;
  email_booking_updates: boolean;
  email_messages: boolean;
  email_marketing: boolean;
  newsletter_subscribed: boolean;
  product_updates: boolean;
  tips_and_guides: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  email_new_leads: true,
  email_new_bookings: true,
  email_booking_updates: true,
  email_messages: true,
  email_marketing: false,
  newsletter_subscribed: true,
  product_updates: true,
  tips_and_guides: true,
};

export function SettingsContent() {
  const t = useTranslations('settingsPage');
  const locale = useLocale();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data ?? DEFAULT_PREFERENCES);
      } else {
        setPreferences(DEFAULT_PREFERENCES);
      }
    } catch (error) {
      console.error('[Settings] Error loading preferences:', error);
      setPreferences(DEFAULT_PREFERENCES);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceUpdate = (key: string, value: boolean) => {
    const base = preferences ?? DEFAULT_PREFERENCES;
    setPreferences({
      ...base,
      [key]: value,
    });
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-2 border-gray-200 shadow-sm animate-pulse">
            <CardHeader>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-100 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      
      {/* Account Settings */}
      <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle>{t('account')}</CardTitle>
          </div>
          <CardDescription>
            {t('accountDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link href="/dashboard/profile">
              <Button variant="outline" className="w-full justify-start">
                {t('editProfile')}
              </Button>
            </Link>
            <p className="text-xs text-gray-500 px-1">
              {t('manageProfile')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bell className="h-5 w-5 text-purple-600" />
            </div>
            <CardTitle>{t('notifications')}</CardTitle>
          </div>
          <CardDescription>
            {t('notificationsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <PreferenceToggle
              preferenceKey="email_new_leads"
              label={t('newLeadsEmail')}
              description={t('newLeadsEmailDesc')}
              initialValue={(preferences ?? DEFAULT_PREFERENCES).email_new_leads}
              onUpdate={handlePreferenceUpdate}
            />
            <PreferenceToggle
              preferenceKey="email_new_bookings"
              label={t('pendingBookings')}
              description={t('pendingBookingsDesc')}
              initialValue={(preferences ?? DEFAULT_PREFERENCES).email_new_bookings}
              onUpdate={handlePreferenceUpdate}
            />
            <PreferenceToggle
              preferenceKey="email_booking_updates"
              label={t('bookingUpdates')}
              description={t('bookingUpdatesDesc')}
              initialValue={(preferences ?? DEFAULT_PREFERENCES).email_booking_updates}
              onUpdate={handlePreferenceUpdate}
            />
          </div>
        </CardContent>
      </Card>

      {/* Billing & Payments */}
      <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle>{t('billingPayments')}</CardTitle>
          </div>
          <CardDescription>
            {t('billingPaymentsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link href="/dashboard/payments">
              <Button variant="outline" className="w-full justify-start">
                {t('viewPaymentHistory')}
              </Button>
            </Link>
            <p className="text-xs text-gray-500 px-1">
              {t('reviewPayments')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <CardTitle>{t('privacySecurity')}</CardTitle>
          </div>
          <CardDescription>
            {t('privacySecurityDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link href="/dashboard/profile">
              <Button variant="outline" className="w-full justify-start">
                {t('securitySettings')}
              </Button>
            </Link>
            <p className="text-xs text-gray-500 px-1">
              {t('securitySettingsDesc')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Globe className="h-5 w-5 text-orange-600" />
            </div>
            <CardTitle>{t('languageRegion')}</CardTitle>
          </div>
          <CardDescription>
            {t('languageRegionDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-1">{t('currentLanguage')}</p>
              <p className="text-lg font-bold text-gray-900">{locale === 'en' ? 'English 🇺🇸' : 'Español 🇪🇸'}</p>
              <p className="text-xs text-gray-500 mt-2">
                {t('languageHint')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication */}
      <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Mail className="h-5 w-5 text-cyan-600" />
            </div>
            <CardTitle>{t('communication')}</CardTitle>
          </div>
          <CardDescription>
            {t('communicationDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <PreferenceToggle
              preferenceKey="newsletter_subscribed"
              label={t('newsletter')}
              description={t('newsletterDesc')}
              initialValue={(preferences ?? DEFAULT_PREFERENCES).newsletter_subscribed}
              onUpdate={handlePreferenceUpdate}
            />
            <PreferenceToggle
              preferenceKey="product_updates"
              label={t('productUpdates')}
              description={t('productUpdatesDesc')}
              initialValue={(preferences ?? DEFAULT_PREFERENCES).product_updates}
              onUpdate={handlePreferenceUpdate}
            />
            <PreferenceToggle
              preferenceKey="tips_and_guides"
              label={t('tipsGuides')}
              description={t('tipsGuidesDesc')}
              initialValue={(preferences ?? DEFAULT_PREFERENCES).tips_and_guides}
              onUpdate={handlePreferenceUpdate}
            />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
