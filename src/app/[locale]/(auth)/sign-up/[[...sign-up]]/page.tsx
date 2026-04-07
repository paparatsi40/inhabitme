import { SignUp } from '@clerk/nextjs';

type SignUpParams = Promise<{ locale: string }>;
type SignUpSearchParams = Promise<{ redirect_url?: string }>;

export default async function SignUpPage({
  params,
  searchParams,
}: {
  params: SignUpParams;
  searchParams: SignUpSearchParams;
}) {
  const { locale } = await params;
  const { redirect_url } = await searchParams;
  const redirectUrl = redirect_url || `/${locale}/dashboard`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        <SignUp
          fallbackRedirectUrl={redirectUrl}
          forceRedirectUrl={redirectUrl}
          signInUrl={`/${locale}/sign-in`}
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
