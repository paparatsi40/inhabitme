import { redirect } from 'next/navigation'

// Redirect legacy /host/dashboard → /en/host/dashboard (i18n route)
export default function HostDashboardLegacyRedirect() {
  redirect('/en/host/dashboard')
}
