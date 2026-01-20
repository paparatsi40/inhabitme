/**
 * Get host information from Clerk API
 * Retrieves user details (email, name) from Clerk using their userId
 */

import { clerkClient } from '@clerk/nextjs/server'

export interface HostInfo {
  email: string
  name?: string
  userId: string
}

/**
 * Gets host info from Clerk API
 * @param userId - Clerk user ID (owner_id from listings table)
 * @returns HostInfo with email and optional name
 */
export async function getHostInfo(userId: string): Promise<HostInfo | null> {
  try {
    console.log('[Clerk] Fetching user info for:', userId)
    
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    
    if (!user) {
      console.error('[Clerk] User not found:', userId)
      return null
    }
    
    // Get primary email address
    const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)
    const email = primaryEmail?.emailAddress || user.emailAddresses[0]?.emailAddress
    
    if (!email) {
      console.error('[Clerk] No email found for user:', userId)
      return null
    }
    
    // Get name (from firstName + lastName or username)
    const name = user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.username || undefined
    
    console.log('[Clerk] ✅ User info retrieved:', { email, name })
    
    return {
      email,
      name,
      userId
    }
  } catch (error) {
    console.error('[Clerk] Error fetching user info:', error)
    return null
  }
}
