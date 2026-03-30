import { SignIn } from '@clerk/nextjs';

export default function SignInPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { redirect_url?: string };
}) {
  const locale = params.locale || 'en';
  const redirectUrl = searchParams.redirect_url || `/${locale}/dashboard`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md">
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
      </div>
    </div>
  );
}
