import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Link } from '@/i18n/routing'

export function ClientNav({
  signIn,
  signUp,
}: {
  signIn: string
  signUp: string
  locale?: 'en' | 'es'
}) {
  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcher />
      <Link href="/dashboard">
        <Button variant="ghost" className="font-semibold">
          Dashboard
        </Button>
      </Link>
      <Link href="/sign-in">
        <Button variant="ghost" className="font-semibold">{signIn}</Button>
      </Link>
      <Link href="/sign-up">
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold shadow-md">
          {signUp}
        </Button>
      </Link>
    </div>
  )
}
