#!/usr/bin/env tsx

/**
 * Manual URL submission script for IndexNow
 * 
 * This script submits specific URLs that are not being indexed by Google
 * to IndexNow for faster discovery by search engines.
 * 
 * Usage: npx tsx scripts/submit-urls-to-indexnow.ts
 */

import { submitUrlsToIndexNow } from '../src/lib/indexnow';

const SITE_URL = 'https://www.indoordogpark.org';

// URLs that are currently not indexed according to Google Search Console
const unindexedUrls = [
  `${SITE_URL}/blog/bay-area-indoor-dog-parks-winter-guide`,
  `${SITE_URL}/category/indoor-dog-park`, // Updated to new URL structure
  `${SITE_URL}/tag/indoor-dog-park`, // Updated to new URL structure
  `${SITE_URL}/cookie-preferences`,
  `${SITE_URL}/guides`,
  `${SITE_URL}/media`,
  `${SITE_URL}/owner-resources`,
  `${SITE_URL}/terms`,
  
  // Additional important pages to ensure indexing
  `${SITE_URL}/about`,
  `${SITE_URL}/contact`,
  `${SITE_URL}/faq`,
  `${SITE_URL}/help`,
  `${SITE_URL}/how-it-works`,
  `${SITE_URL}/list-your-park`,
  `${SITE_URL}/partners`,
  `${SITE_URL}/privacy`,
  `${SITE_URL}/blog`,
];

async function main() {
  console.log('🚀 Starting IndexNow URL submission...');
  console.log(`📋 Submitting ${unindexedUrls.length} URLs to IndexNow`);
  
  try {
    const successCount = await submitUrlsToIndexNow(unindexedUrls);
    
    console.log(`✅ Successfully submitted ${successCount}/${unindexedUrls.length} URLs to IndexNow`);
    
    if (successCount < unindexedUrls.length) {
      console.log('⚠️  Some URLs failed to submit. Check the logs above for details.');
    }
    
    console.log('\n📊 Next steps:');
    console.log('1. Check Bing Webmaster Tools in 24-48 hours to verify submission');
    console.log('2. Monitor Google Search Console for indexing improvements');
    console.log('3. Resubmit sitemap to Google Search Console if needed');
    
  } catch (error) {
    console.error('❌ Error during URL submission:', error);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
