export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://simandev.ru'

export const IS_STAGING = SITE_URL.includes('staging')
