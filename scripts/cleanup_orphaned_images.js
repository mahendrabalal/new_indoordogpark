#!/usr/bin/env node
/**
 * Clean up orphaned image files that are no longer referenced by any park.
 * 
 * Industry best practice: Remove unused assets to reduce storage and improve maintainability.
 */

const fs = require('fs').promises;
const path = require('path');
const { readdir, stat, unlink } = fs;

/**
 * Get all image references from JSON park files
 */
async function getImageReferences() {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  const files = ['california.json', 'washington.json', 'mixmatch.json'];
  const imageRefs = new Set();
  
  for (const filename of files) {
    const filePath = path.join(dataDir, filename);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const parks = JSON.parse(content);
      
      for (const park of parks) {
        // Check primary photo
        if (park.photo && typeof park.photo === 'string' && park.photo.startsWith('/images/')) {
          imageRefs.add(park.photo);
        }
        
        // Check photos array
        if (park.photos && Array.isArray(park.photos)) {
          for (const photo of park.photos) {
            const url = typeof photo === 'string' ? photo : (photo.url || '');
            if (url && url.startsWith('/images/')) {
              imageRefs.add(url);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error reading ${filename}:`, error.message);
    }
  }
  
  return imageRefs;
}

/**
 * Get all image files in the parks directory
 */
async function getAllImageFiles(dir) {
  const files = [];
  
  async function scanDir(currentDir) {
    try {
      const entries = await readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.jpg') || entry.name.endsWith('.jpeg') || entry.name.endsWith('.png') || entry.name.endsWith('.webp'))) {
          // Convert to URL path format
          const relativePath = fullPath.replace(process.cwd() + '/public', '');
          files.push({
            filePath: fullPath,
            urlPath: relativePath,
            name: entry.name,
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning ${currentDir}:`, error.message);
    }
  }
  
  await scanDir(dir);
  return files;
}

/**
 * Main cleanup function
 */
async function main() {
  console.log('='.repeat(80));
  console.log('ORPHANED IMAGE CLEANUP');
  console.log('='.repeat(80));
  
  const parksImageDir = path.join(process.cwd(), 'public', 'images', 'parks');
  
  // Get all image references from JSON files
  console.log('\n📋 Scanning JSON files for image references...');
  const imageRefs = await getImageReferences();
  console.log(`   ✓ Found ${imageRefs.size} image references in park data`);
  
  // Get all actual image files
  console.log('\n📁 Scanning filesystem for image files...');
  const allImageFiles = await getAllImageFiles(parksImageDir);
  console.log(`   ✓ Found ${allImageFiles.length} image files in filesystem`);
  
  // Find orphaned images (files not referenced in JSON)
  const orphanedImages = allImageFiles.filter(file => !imageRefs.has(file.urlPath));
  
  console.log('\n' + '='.repeat(80));
  console.log('ANALYSIS RESULTS');
  console.log('='.repeat(80));
  console.log(`Total image files: ${allImageFiles.length}`);
  console.log(`Referenced images: ${imageRefs.size}`);
  console.log(`Orphaned images: ${orphanedImages.length}`);
  
  if (orphanedImages.length > 0) {
    console.log('\n📋 Orphaned images (first 10):');
    orphanedImages.slice(0, 10).forEach(img => {
      console.log(`   - ${img.urlPath}`);
    });
    
    if (orphanedImages.length > 10) {
      console.log(`   ... and ${orphanedImages.length - 10} more`);
    }
    
    // Calculate total size of orphaned images
    let totalSize = 0;
    for (const img of orphanedImages) {
      try {
        const stats = await stat(img.filePath);
        totalSize += stats.size;
      } catch (error) {
        // File might have been deleted already
      }
    }
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    
    console.log(`\n💾 Total size of orphaned images: ${totalSizeMB} MB`);
    
    // Ask if user wants to delete (in a real script, you'd use readline)
    console.log('\n⚠️  Orphaned images found!');
    console.log('   These images are no longer referenced by any park in the JSON files.');
    console.log('   They may be from duplicate parks that were removed.');
    console.log('\n   To delete orphaned images, run:');
    console.log('   node scripts/cleanup_orphaned_images.js --delete');
  } else {
    console.log('\n✅ No orphaned images found! All images are referenced.');
  }
  
  // Delete if --delete flag is provided
  const shouldDelete = process.argv.includes('--delete');
  if (shouldDelete && orphanedImages.length > 0) {
    console.log('\n🗑️  Deleting orphaned images...');
    let deleted = 0;
    let errors = 0;
    
    for (const img of orphanedImages) {
      try {
        await unlink(img.filePath);
        deleted++;
      } catch (error) {
        console.error(`   ✗ Failed to delete ${img.urlPath}: ${error.message}`);
        errors++;
      }
    }
    
    console.log(`\n✅ Deleted ${deleted} orphaned images`);
    if (errors > 0) {
      console.log(`   ⚠️  ${errors} errors occurred`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { getImageReferences, getAllImageFiles };




























