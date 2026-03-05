import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function RootPage() {
  // Check for locale cookie
  const cookieStore = cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  
  // Redirect to detected locale or default to 'en'
  const locale = localeCookie || 'en';
  
  redirect(`/${locale}`);
}
