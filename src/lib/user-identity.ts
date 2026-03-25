export type CanonicalUserIdentity = {
  runtimeClerkId: string
  canonicalClerkId: string
  legacyUserId: string | null
  email: string | null
}

export async function resolveCanonicalUserIdentity(params: {
  supabase: any
  runtimeClerkId: string
  email?: string | null
}): Promise<CanonicalUserIdentity> {
  const { supabase, runtimeClerkId } = params
  const normalizedEmail = params.email?.toLowerCase() ?? null

  let legacyUserId: string | null = null
  let canonicalClerkId: string = runtimeClerkId

  const { data: userByClerkId } = await supabase
    .from('User')
    .select('id, clerkId, email')
    .eq('clerkId', runtimeClerkId)
    .maybeSingle()

  if (userByClerkId) {
    legacyUserId = (userByClerkId as any)?.id ?? null
    canonicalClerkId = String((userByClerkId as any)?.clerkId ?? runtimeClerkId)
  } else if (normalizedEmail) {
    const { data: userByEmail } = await supabase
      .from('User')
      .select('id, clerkId, email')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (userByEmail) {
      legacyUserId = (userByEmail as any)?.id ?? null
      canonicalClerkId = String((userByEmail as any)?.clerkId ?? runtimeClerkId)

      // Self-heal: keep legacy User table aligned with active Clerk identity
      if ((userByEmail as any)?.clerkId !== runtimeClerkId) {
        await supabase
          .from('User')
          .update({ clerkId: runtimeClerkId })
          .eq('id', legacyUserId)

        canonicalClerkId = runtimeClerkId
      }
    }
  }

  return {
    runtimeClerkId,
    canonicalClerkId,
    legacyUserId,
    email: normalizedEmail,
  }
}
