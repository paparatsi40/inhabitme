import { redirect } from 'next/navigation';

// Simple redirect to default locale
export default async function RootPage() {
  redirect('/en');
}
