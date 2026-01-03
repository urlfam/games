'use client';

export default function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // Cloudinary URL structure: https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/<version>/<public_id>
  
  // Split by '/upload/' to inject transformations
  const [base, rest] = src.split('/upload/');
  
  // Safety check: if not a standard Cloudinary upload URL, return as is
  if (!rest) return src;

  // Inject width and quality. 
  // We use 'c_limit' to ensure we don't upscale or distort if aspect ratio changes (though Next.js usually handles aspect ratio via width/height)
  // But for 'fill', Next.js provides the width based on sizes.
  // We add 'c_limit' to be safe, or just 'w_'. Cloudinary default crop is 'scale'.
  const params = [`w_${width}`, `q_${quality || 'auto'}`];
  
  // Construct new URL
  // We prepend our params to any existing ones in 'rest'
  // Example rest: "f_auto,q_auto/v123/image.jpg"
  // Result: ".../upload/w_640,q_auto,f_auto,q_auto/v123/image.jpg"
  return `${base}/upload/${params.join(',')},${rest}`;
}
