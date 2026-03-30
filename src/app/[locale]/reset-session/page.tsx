'use client';

import { useEffect } from 'react';

function clearCookie(name: string) {
  const base = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  document.cookie = base;
  document.cookie = `${base} domain=${window.location.hostname};`;
  document.cookie = `${base} domain=.${window.location.hostname};`;
}

export default function ResetSessionPage() {
  useEffect(() => {
    const locale = window.location.pathname.split('/')[1] || 'en';
    const target = `/${locale}/sign-in?reset=1`;

    const redirect = () => {
      window.location.assign(target);
    };

    try {
      // Clear known auth/caching cookies
      const cookieNames = [
        '__session',
        '__client_uat',
        '__clerk_db_jwt',
        '__clerk_handshake',
        '__clerk_redirect_count',
      ];

      cookieNames.forEach(clearCookie);

      // Clear storage keys that might hold stale app/auth state
      const localKeys = Object.keys(localStorage);
      localKeys.forEach((key) => {
        if (
          key.startsWith('__clerk') ||
          key.includes('clerk') ||
          key.includes('supabase')
        ) {
          localStorage.removeItem(key);
        }
      });

      const sessionKeys = Object.keys(sessionStorage);
      sessionKeys.forEach((key) => {
        if (
          key.startsWith('__clerk') ||
          key.includes('clerk') ||
          key.includes('supabase')
        ) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('[reset-session] cleanup error:', error);
    } finally {
      // Attempt immediate redirect + fallback retry
      redirect();
      const retryId = setTimeout(redirect, 1500);
      return () => clearTimeout(retryId);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Reiniciando sesión</h1>
        <p className="text-sm text-gray-600 mb-4">
          Estamos limpiando el estado local para resolver problemas de carga.
        </p>
        <a href="/en/sign-in?reset=1" className="text-sm text-blue-700 underline">
          Si no redirige automáticamente, haz clic aquí
        </a>
      </div>
    </div>
  );
}
