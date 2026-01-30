'use client';

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Cloudinary URL structure: https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/<version>/<public_id>
  // OR our Custom CDN: https://cdn.puzzio.io/<cloud_name>/image/upload/...

  // 1. Detect if it's a Cloudinary-like URL (standard or custom CDN)
  const isStandard = src.includes('res.cloudinary.com');
  const isCustom = src.includes('cdn.puzzio.io');
  
  if (!isStandard && !isCustom) return src;

  // Split by '/upload/' to inject transformations
  const [basePart, rest] = src.split('/upload/');

  // Safety check: if not a standard Cloudinary upload URL structure, return as is
  if (!rest) return src;

  // 2. FORCE usage of our custom CDN 'cdn.puzzio.io' for the final URL
  // If the source was 'res.cloudinary.com', we replace it.
  // If it was already 'cdn.puzzio.io', we keep it (but 'basePart' will already have it).
  // We rebuild the base to be sure it points to our CDN.
  let newBase = basePart;
  if (isStandard) {
    newBase = basePart.replace('res.cloudinary.com', 'cdn.puzzio.io');
  }

  // Inject width and quality.
  // We use 'c_limit' to ensure we don't upscale or distort if aspect ratio changes (though Next.js usually handles aspect ratio via width/height)
  // But for 'fill', Next.js provides the width based on sizes.
  // We add 'c_limit' to be safe, or just 'w_'. Cloudinary default crop is 'scale'.
  const params = [`w_${width}`];

  // Optimization: Use q_auto (Cloudinary AI) by default instead of static quality
  // formatting. Next.js defaults to 75, so we override it with q_auto unless a
  // custom quality (not 75) is provided.
  if (quality && quality !== 75) {
    params.push(`q_${quality}`);
  } else if (!rest.includes('q_auto')) {
    params.push('q_auto');
  }

  // Ensure f_auto is present for format optimization (WebP/AVIF)
  if (!rest.includes('f_auto')) {
    params.push('f_auto');
  }

  // Construct new URL
  // We use '/' separator to ensure clean chaining of transformations
  // Example rest: "v123/image.jpg" -> ".../upload/w_640,q_auto,f_auto/v123/image.jpg"
  return `${newBase}/upload/${params.join(',')}/${rest}`;
}
