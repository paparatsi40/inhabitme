import { redirect } from 'next/navigation'

export default async function DashboardCatchAllFallback({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const path = Array.isArray(slug) ? slug.join('/') : ''
  redirect(path ? `/en/dashboard/${path}` : '/en/dashboard')
}
