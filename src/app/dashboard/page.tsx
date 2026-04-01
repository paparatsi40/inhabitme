import { redirect } from 'next/navigation'

export default function DashboardFallbackPage() {
  redirect('/en/dashboard')
}
