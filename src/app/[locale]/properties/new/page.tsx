import { auth } from '@clerk/nextjs/server'
import { redirect as nextRedirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import CreatePropertyClient from './CreatePropertyClient'

export default async function NewPropertyPage() {
  const { userId } = await auth()
  const locale = await getLocale()

  if (!userId) {
    nextRedirect(`/${locale}/sign-in`)
  }

  return <CreatePropertyClient />
}
