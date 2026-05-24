/** Thiings 3D icons — https://www.thiings.co (Vercel Blob CDN) */
const THIINGS_CDN = 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com';

export function thiingsIconUrl(fileId) {
  return `${THIINGS_CDN}/image-${fileId}.png`;
}
