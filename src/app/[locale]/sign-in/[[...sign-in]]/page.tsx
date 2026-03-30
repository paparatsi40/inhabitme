import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const { locale = 'en' } = await params;
  const { redirect_url } = await searchParams;
  const redirectUrl = redirect_url || `/${locale}/dashboard`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md space-y-4">
        <SignIn 
          fallbackRedirectUrl={redirectUrl}
          forceRedirectUrl={redirectUrl}
          signUpUrl={`/${locale}/sign-up`}
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl',
            },
          }}
        />

        <div className="text-center">
          <Link
            href={`/${locale}/reset-session`}
            className="text-sm text-gray-600 hover:text-blue-700 underline"
          >
            ¿Problemas de carga? Reiniciar sesión local
          </Link>
        </div>
      </div>
    </div>
  );
}
