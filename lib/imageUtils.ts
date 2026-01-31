
/**
 * Checks if an image URL is hosted on Cloudinary or our custom Cloudinary CDN proxy.
 */
export const isCloudinaryImage = (url: string | undefined | null): boolean => {
  if (!url) return false;
  return url.includes('res.cloudinary.com') || url.includes('cdn.puzzio.io');
};

/**
 * Converts a Cloudinary URL to use our custom CDN proxy.
 * This ensures all images go through cdn.puzzio.io for better caching.
 */
export const toCdnUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  if (url.includes('res.cloudinary.com')) {
    return url.replace('res.cloudinary.com', 'cdn.puzzio.io');
  }
  return url;
};
