import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import EditPropertyClient from './EditPropertyClient'

export const metadata: Metadata = {
  title: 'Editar Propiedad',
  description: 'Edita tu propiedad en InhabitMe'
}

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditPropertyPage({ params }: PageProps) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const supabase = getSupabaseServerClient()

  // Get property
  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !listing) {
    notFound()
  }

  // Verify ownership
  if (listing.owner_id !== userId) {
    redirect('/dashboard/properties')
  }

  return <EditPropertyClient listing={listing} />
}
