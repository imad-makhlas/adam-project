export const siteConfig = {
  whatsapp: (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(/\D/g, ''),
  instagram: import.meta.env.VITE_INSTAGRAM_URL ?? '',
  email: import.meta.env.VITE_CONTACT_EMAIL ?? '',
}
