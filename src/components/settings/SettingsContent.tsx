'use client';

import { useEffect, useState } from 'react';
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

export function SettingsContent() {
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
        setPreferences(data);
      }
    } catch (error) {
      console.error('[Settings] Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceUpdate = (key: string, value: boolean) => {
    if (preferences) {
      setPreferences({
        ...preferences,
        [key]: value,
      });
    }
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
            <CardTitle>Cuenta</CardTitle>
          </div>
          <CardDescription>
            Administra tu información personal y configuración de cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link href="/dashboard/profile">
              <Button variant="outline" className="w-full justify-start">
                Editar Perfil
              </Button>
            </Link>
            <p className="text-xs text-gray-500 px-1">
              Gestiona tu nombre, email, contraseña y foto de perfil
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
            <CardTitle>Notificaciones</CardTitle>
          </div>
          <CardDescription>
            Configura cómo y cuándo recibes notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          {preferences && (
            <div className="space-y-3">
              <PreferenceToggle
                preferenceKey="email_new_leads"
                label="Email de nuevos leads"
                description="Recibe notificación inmediata"
                initialValue={preferences.email_new_leads}
                onUpdate={handlePreferenceUpdate}
              />
              <PreferenceToggle
                preferenceKey="email_new_bookings"
                label="Reservas pendientes"
                description="Notificaciones de solicitudes"
                initialValue={preferences.email_new_bookings}
                onUpdate={handlePreferenceUpdate}
              />
              <PreferenceToggle
                preferenceKey="email_booking_updates"
                label="Actualizaciones de reservas"
                description="Cambios en reservas existentes"
                initialValue={preferences.email_booking_updates}
                onUpdate={handlePreferenceUpdate}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing & Payments */}
      <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle>Pagos y Facturación</CardTitle>
          </div>
          <CardDescription>
            Métodos de pago, facturas y transacciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link href="/dashboard/payments">
              <Button variant="outline" className="w-full justify-start">
                Ver Historial de Pagos
              </Button>
            </Link>
            <p className="text-xs text-gray-500 px-1">
              Revisa todos tus pagos recibidos por reservas
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
            <CardTitle>Privacidad y Seguridad</CardTitle>
          </div>
          <CardDescription>
            Controla tu privacidad y seguridad de cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link href="/dashboard/profile">
              <Button variant="outline" className="w-full justify-start">
                Configuración de Seguridad
              </Button>
            </Link>
            <p className="text-xs text-gray-500 px-1">
              Autenticación de dos factores, sesiones activas y más
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
            <CardTitle>Idioma y Región</CardTitle>
          </div>
          <CardDescription>
            Preferencias de idioma y formato regional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-1">Idioma actual</p>
              <p className="text-lg font-bold text-gray-900">Español 🇪🇸</p>
              <p className="text-xs text-gray-500 mt-2">
                Cambia entre español e inglés usando el selector en la barra superior
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
            <CardTitle>Comunicación</CardTitle>
          </div>
          <CardDescription>
            Preferencias de email y comunicación con guests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {preferences && (
            <div className="space-y-3">
              <PreferenceToggle
                preferenceKey="newsletter_subscribed"
                label="Newsletter"
                description="Tips y novedades"
                initialValue={preferences.newsletter_subscribed}
                onUpdate={handlePreferenceUpdate}
              />
              <PreferenceToggle
                preferenceKey="product_updates"
                label="Actualizaciones de producto"
                description="Nuevas funcionalidades"
                initialValue={preferences.product_updates}
                onUpdate={handlePreferenceUpdate}
              />
              <PreferenceToggle
                preferenceKey="tips_and_guides"
                label="Tips y guías"
                description="Consejos para hosts"
                initialValue={preferences.tips_and_guides}
                onUpdate={handlePreferenceUpdate}
              />
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
