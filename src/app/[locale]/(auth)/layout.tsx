import { ClerkProvider } from '@clerk/nextjs'

export default function AuthScopedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClerkProvider dynamic={false}>{children}</ClerkProvider>
}
