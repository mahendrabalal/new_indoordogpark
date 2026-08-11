import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

export const sanityServerClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false for mutations
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
})
