'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function clearCookie(name: string) {
  const base = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  document.cookie = base;
  document.cookie = `${base} domain=${window.location.hostname};`;
  document.cookie = `${base} domain=.${window.location.hostname};`;
}

export default function ResetSessionPage() {
  const router = useRouter();

  useEffect(() => {
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
      // Force full reload to ensure fresh auth handshake and chunks
      window.location.replace('/en/sign-in?reset=1');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Reiniciando sesión</h1>
        <p className="text-sm text-gray-600">
          Estamos limpiando el estado local para resolver problemas de carga.
        </p>
      </div>
    </div>
  );
}
