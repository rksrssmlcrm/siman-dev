export type CookieEntry = {
  name: string
  category: 'Необходимые' | 'Аналитика'
  purpose: string
  duration: string
  provider: string
}

export const COOKIES_PAGE = {
  title: 'Политика использования cookie',
  updatedAt: '21 июля 2026 года',
  intro:
    'На сайте SimanDev используются cookie — небольшие файлы, сохраняемые в браузере. ' +
    'Ниже — перечень cookie, которые мы устанавливаем, их назначение и срок хранения.',
  tableHeaders: {
    name: 'Имя',
    category: 'Категория',
    purpose: 'Назначение',
    duration: 'Срок',
    provider: 'Поставщик',
  },
  cookies: [
    {
      name: 'consent_prefs',
      category: 'Необходимые',
      purpose: 'Хранит ваш выбор категорий cookie (необходимые / аналитика)',
      duration: '12 месяцев',
      provider: 'SimanDev',
    },
  ] satisfies CookieEntry[],
  analyticsNote:
    'При согласии на категорию «Аналитика» Яндекс.Метрика может устанавливать cookie ' +
    '(_ym_uid, _ym_d, _ym_isad, _ym_visorc* и др.) для учёта визитов. Полный перечень — ' +
    'в документации Яндекса: https://yandex.ru/support/metrica/general/cookie-usage.html',
  manage:
    'Изменить выбор можно в любой момент через ссылку «Настройки cookie» в подвале сайта.',
} as const

/** Yandex Metrika cookies (loaded only after analytics consent). */
export const METRIKA_COOKIES: CookieEntry[] = [
  {
    name: '_ym_uid',
    category: 'Аналитика',
    purpose: 'Уникальный идентификатор пользователя Метрики',
    duration: '1 год',
    provider: 'Яндекс.Метрика',
  },
  {
    name: '_ym_d',
    category: 'Аналитика',
    purpose: 'Дата первого визита',
    duration: '1 год',
    provider: 'Яндекс.Метрика',
  },
  {
    name: '_ym_isad',
    category: 'Аналитика',
    purpose: 'Определение использования блокировщика рекламы',
    duration: '2 дня',
    provider: 'Яндекс.Метрика',
  },
]
