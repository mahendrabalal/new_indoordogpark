/**
 * Sanity Studio Redirect
 * 
 * The Sanity Studio is excluded from the Cloudflare deployment to keep bundle
 * size under the 25MB limit. Access the studio directly at:
 * https://[your-project].sanity.studio/
 */

import { redirect } from 'next/navigation';

export default function StudioPage() {
  // Redirect to the Sanity hosted studio
  // You can set up a free Sanity-hosted studio at sanity.io
  redirect('https://indoordogpark.sanity.studio/');
}
