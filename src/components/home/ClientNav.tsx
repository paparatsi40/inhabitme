import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Link } from '@/i18n/routing'

export function ClientNav({
  signIn,
  signUp,
  locale,
}: {
  signIn: string
  signUp: string
  locale: 'en' | 'es'
}) {
  const dashboardUrl = `/${locale}/dashboard`
  const signInUrl = `/${locale}/sign-in`
  const signUpUrl = `/${locale}/sign-up`

  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcher />
      <Link href={dashboardUrl}>
        <Button variant="ghost" className="font-semibold">
          Dashboard
        </Button>
      </Link>
      <Link href={signInUrl}>
        <Button variant="ghost" className="font-semibold">{signIn}</Button>
      </Link>
      <Link href={signUpUrl}>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold shadow-md">
          {signUp}
        </Button>
      </Link>
    </div>
  )
}
