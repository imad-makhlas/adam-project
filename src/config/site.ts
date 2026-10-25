export const siteConfig = {
  whatsapp: (import.meta.env.VITE_WHATSAPP_NUMBER ?? '212776755124').replace(/\D/g, ''),
  instagram: import.meta.env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/',
  tiktok: import.meta.env.VITE_TIKTOK_URL ?? 'https://www.tiktok.com/',
  youtube: import.meta.env.VITE_YOUTUBE_URL ?? 'https://www.youtube.com/',
  email: import.meta.env.VITE_CONTACT_EMAIL ?? '',
}
