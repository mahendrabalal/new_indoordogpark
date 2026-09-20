/**
 * Client-Side Image Compression Utility
 * 
 * Compresses images in the browser before sending to the server.
 * Benefits:
 * - Reduces 5MB-12MB phone camera photos to ~300KB-800KB
 * - Prevents hitting Vercel's 4.5MB serverless request body limit
 * - Speeds up uploads over mobile/cellular connections by 5x-10x
 * - Preserves visual quality using canvas downscaling & high-quality JPEG/WebP encoding
 */

export interface CompressOptions {
  /** Maximum width or height in pixels (default: 1920) */
  maxDimension?: number;
  /** Image quality between 0.1 and 1.0 (default: 0.85) */
  quality?: number;
  /** Skip compression if file size is below this threshold in bytes (default: 400KB) */
  skipThresholdBytes?: number;
  /** Target MIME type (default: 'image/jpeg') */
  mimeType?: 'image/jpeg' | 'image/webp';
}

const DEFAULT_OPTIONS: Required<CompressOptions> = {
  maxDimension: 1920,
  quality: 0.85,
  skipThresholdBytes: 400 * 1024, // 400 KB
  mimeType: 'image/jpeg',
};

/**
 * Compresses an image File in the browser.
 * Falls back gracefully to original File if anything fails.
 */
export async function compressImage(
  file: File,
  options?: CompressOptions
): Promise<File> {
  // If not running in browser, return original
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file;
  }

  // Only compress image files
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // Don't compress animated GIFs or SVGs
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };

  // If already under threshold, skip compression
  if (file.size <= opts.skipThresholdBytes) {
    return file;
  }

  try {
    return await new Promise<File>((resolve) => {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);

      const timeoutId = setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        // On timeout, fallback to original file
        resolve(file);
      }, 10000);

      img.onload = () => {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(objectUrl);

        try {
          let { width, height } = img;

          // Calculate new dimensions preserving aspect ratio
          if (width > opts.maxDimension || height > opts.maxDimension) {
            if (width > height) {
              height = Math.round((height * opts.maxDimension) / width);
              width = opts.maxDimension;
            } else {
              width = Math.round((width * opts.maxDimension) / height);
              height = opts.maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // For JPEG output, fill white background to avoid transparent black artifacts
          if (opts.mimeType === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }

              // If compressed blob is somehow larger than original, keep original
              if (blob.size >= file.size) {
                resolve(file);
                return;
              }

              // Generate clean filename with target extension
              const ext = opts.mimeType === 'image/webp' ? 'webp' : 'jpg';
              const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
              const compressedFileName = `${nameWithoutExt}.${ext}`;

              const compressedFile = new File([blob], compressedFileName, {
                type: opts.mimeType,
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            opts.mimeType,
            opts.quality
          );
        } catch (err) {
          console.warn('[client-image-compressor] Canvas draw failed, using original file:', err);
          resolve(file);
        }
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(objectUrl);
        // Fallback to original on load error
        resolve(file);
      };

      img.src = objectUrl;
    });
  } catch (err) {
    console.warn('[client-image-compressor] Unexpected compression error, using original file:', err);
    return file;
  }
}
