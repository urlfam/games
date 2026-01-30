
/**
 * Checks if an image URL is hosted on Cloudinary or our custom Cloudinary CDN proxy.
 */
export const isCloudinaryImage = (url: string | undefined | null): boolean => {
  if (!url) return false;
  return url.includes('res.cloudinary.com') || url.includes('cdn.puzzio.io');
};
