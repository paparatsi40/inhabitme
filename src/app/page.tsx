import { redirect } from 'next/navigation';

export default function RootPage() {
  // Detect locale from browser or use default
  redirect('/en');
}
