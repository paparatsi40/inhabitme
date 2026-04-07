import { SignIn } from '@clerk/nextjs';

type SignInParams = Promise<{ locale: string }>;
type SignInSearchParams = Promise<{ redirect_url?: string }>;

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: SignInParams;
  searchParams: SignInSearchParams;
}) {
  const { locale } = await params;
  const { redirect_url } = await searchParams;
  const redirectUrl = redirect_url || `/${locale}/dashboard`;

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
