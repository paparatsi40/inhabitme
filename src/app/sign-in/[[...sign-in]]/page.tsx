import { SignIn } from '@clerk/nextjs';
import { cookies, headers } from 'next/headers';

export default function SignInPage({
  searchParams,
}: {
  searchParams: { redirect_url?: string };
}) {
  // Detectar locale desde cookies o headers
  const cookieStore = cookies();
  const headersList = headers();
  
  // next-intl guarda el locale en una cookie
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  
  // Fallback: detectar del header Accept-Language o usar 'en'
  const locale = localeCookie || 'en';
  
  const redirectUrl = searchParams.redirect_url || `/${locale}/dashboard`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        <SignIn 
          fallbackRedirectUrl={redirectUrl}
          forceRedirectUrl={redirectUrl}
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl',
            },
          }}
        />
      </div>
    </div>
  );
}