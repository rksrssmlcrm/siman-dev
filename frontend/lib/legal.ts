import { CONTACTS } from '@/lib/content'

/** Operator of personal data (152-FZ). Update requisites when registering as ИП/ООО. */
export const LEGAL = {
  operatorName: 'SimanDev',
  operatorDescription:
    'физическое лицо, самозанятый разработчик (оператор персональных данных)',
  /** Sync with backend LEAD_RETENTION_DAYS default (180). */
  retentionDays: 180,
  /** Bump when privacy/consent text changes; stored with each lead. */
  consentTextVersion: '2026-07-21',
  jurisdiction: 'Российская Федерация',
  databaseLocation: 'территория РФ (VPS заказчика)',
} as const

export const OPERATOR_CONTACTS = {
  email: CONTACTS.email,
  telegram: CONTACTS.telegram,
  telegramUrl: CONTACTS.telegramUrl,
  brand: CONTACTS.brand,
} as const
