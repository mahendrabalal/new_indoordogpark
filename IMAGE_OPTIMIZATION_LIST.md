# Image Optimization List

Based on Lighthouse report showing 6.5MB potential savings from image optimization.

## Priority 1: Critical Hero/Key Images (Highest Impact)

These images load on every page or critical pages and should be optimized first:

### Homepage Hero Image
- **File**: `public/images/hero/hero.png`
- **Size**: 332KB
- **Status**: Loads on homepage
- **Action Needed**: 
  - Convert to WebP/AVIF format
  - Compress to <150KB
  - Add explicit width/height to prevent CLS
  - Consider using Next.js Image component with responsive sizes

### Login Page Hero
- **File**: `public/images/auth/login-hero.png`
- **Size**: 1.4MB ⚠️ **VERY LARGE**
- **Status**: Loads on login page
- **Action Needed**:
  - Convert PNG to WebP/AVIF
  - Compress to <200KB (90% reduction possible)
  - Optimize resolution if oversized
  - Add lazy loading (not above fold)

## Priority 2: Large Park Images (>800KB)

These are the largest park images that should be optimized:

### Over 1MB (Critical)
1. `public/images/parks/san-francisco/smartypup.jpg` - **1.8MB**
2. `public/images/parks/ChIJj38iJOaAhYAR2bakFQ8qALU.jpg` - **1.8MB**
3. `public/images/parks/glendale/k9-logic-dog-training.jpg` - **1.5MB**
4. `public/images/parks/ChIJxZ45QAjBwoARvAgTyYr5IRc.jpg` - **1.5MB**

### 800KB - 1MB (High Priority)
5. `public/images/parks/washington/kirkland/all-the-best-pet-care-kenmore-3.jpg` - **1.1MB**
6. `public/images/parks/san-francisco/embarkadero-social-club.jpg` - **1.1MB**
7. `public/images/parks/ChIJOc-XGSF-j4AR5rU1DNofC9I.jpg` - **1.1MB**
8. `public/images/parks/washington/seattle/all-the-best-pet-care-columbia-city-3.jpg` - **1.0MB**
9. `public/images/parks/scotts-valley/paws-to-play-doggy-daycare-grooming.jpg` - **1.0MB**
10. `public/images/parks/ChIJB7qX6EtHjoARlRl4nyQ679g.jpg` - **1.0MB**

### 700KB - 800KB (Medium Priority)
11. `public/images/parks/washington/bellingham/reds-aquarium-pet-supply-1.jpg` - **963KB**
12. `public/images/parks/dixon/happy-paws-kennels-inc.jpg` - **892KB**
13. `public/images/parks/ChIJT7hCSFElhYAR1jjxYf7qcrM.jpg` - **892KB**
14. `public/images/parks/washington/vancouver/vancouver-doodle-buddies-3.jpg` - **871KB**
15. `public/images/parks/washington/everett/pet-evolution-mill-creek-wa-grooming-self-wash-healthy-food-mobile-nail-trim-1.jpg` - **843KB**
16. `public/images/parks/west-sacramento/elite-dogs-training-boarding.jpg` - **811KB**
17. `public/images/parks/ChIJR7ADdBPUmoARw88h0vD8qiA.jpg` - **811KB**
18. `public/images/parks/washington/lakewood/aquarium-paradise-2.jpg` - **767KB**
19. `public/images/parks/los-angeles/the-ranch-dog-training.jpg` - **761KB**
20. `public/images/parks/ChIJgckM9qmZwoAROeiVckT_K8c.jpg` - **761KB**

## Priority 3: Logo Images (Lower Priority - Already Small)

These are already reasonably sized but could be optimized further:
- `public/images/logo/logo.png` - 32KB ✅
- `public/images/logo/logo-grayscale.png` - 32KB ✅
- `public/images/logo/logo-stacked.png` - 28KB ✅
- `public/images/logo/logo-stacked-grayscale.png` - 24KB ✅

**Action**: Convert to SVG for crisp scaling and smaller file size.

## Optimization Recommendations

### For All Images:

1. **Convert to Modern Formats**:
   - JPG → WebP (70-90% smaller)
   - PNG → WebP or AVIF (80-90% smaller)
   - Use Next.js Image component for automatic format selection

2. **Compress**:
   - JPG: Quality 80-85%
   - WebP: Quality 75-85%
   - Target file size: <200KB for hero images, <150KB for park images

3. **Resize if Oversized**:
   - Hero images: Max 1920px width
   - Park card images: Max 800px width
   - Thumbnails: Max 400px width

4. **Add Dimensions**:
   - Add explicit width/height attributes
   - Use aspect-ratio CSS
   - Prevent CLS (Cumulative Layout Shift)

5. **Lazy Loading**:
   - Use `loading="lazy"` for below-fold images
   - Use Next.js Image component with `priority` only for above-fold

### Tools for Optimization:

1. **ImageMagick/Sharp** (CLI):
   ```bash
   # Convert to WebP
   magick input.jpg -quality 85 output.webp
   
   # Resize and compress
   magick input.jpg -resize 1920x -quality 85 output.jpg
   ```

2. **Online Tools**:
   - Squoosh.app (Google) - Best quality/size ratio
   - TinyPNG.com - Easy batch processing
   - ImageOptim (Mac) - Batch optimization

3. **Next.js Image Component**:
   - Automatically serves WebP/AVIF when supported
   - Responsive image sizes
   - Lazy loading built-in

## Expected Savings

- **Login Hero**: 1.4MB → ~150KB = **1.25MB savings**
- **Hero Image**: 332KB → ~150KB = **182KB savings**
- **Top 20 Park Images**: ~18MB → ~2-3MB = **~15MB savings**
- **Total Estimated Savings**: **~16.5MB** (exceeds Lighthouse's 6.5MB estimate)

## Implementation Checklist

- [ ] Optimize hero.png (homepage)
- [ ] Optimize login-hero.png (critical - 1.4MB)
- [ ] Batch optimize all park images >500KB
- [ ] Convert logos to SVG
- [ ] Add width/height to all images in components
- [ ] Implement Next.js Image component where not already used
- [ ] Test image loading performance
- [ ] Verify CLS improvements

## Quick Win Commands

To find all images that need optimization:

```bash
# Find all images over 500KB
find public/images -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" \) -size +500k -exec ls -lh {} \;

# Count total size of images directory
du -sh public/images

# Count images by size
find public/images -type f -name "*.jpg" -exec du -h {} \; | awk '$1 ~ /M/ {count++} END {print count " images over 1MB"}'
```

























