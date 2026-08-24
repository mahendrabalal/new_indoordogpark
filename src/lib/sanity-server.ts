import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

/**
 * Sanity Mutation Client (Admin/Write Only)
 * 
 * IMPORTANT: This client is strictly for write operations and mutations
 * (e.g., submit park, Stripe webhooks, asset uploads).
 * DO NOT use this client for public read queries, as it bypasses the CDN
 * and uses the limited 250k/month Origin API quota.
 * For all public reads, use `sanityClient` from `@/lib/sanity-client`.
 */
export const sanityServerClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false for mutations
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
})

export const sanityWriteClient = sanityServerClient;

