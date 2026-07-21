import type { LucideIcon } from 'lucide-react'
import {
  Boxes,
  Gauge,
  LayoutTemplate,
  Layers,
  MonitorSmartphone,
  PenTool,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react'

export const CONTACTS = {
  email: 'arssiman@gmail.com',
  telegram: '@rksrssmlcrm',
  telegramUrl: 'https://t.me/rksrssmlcrm',
  brand: 'SimanDev',
} as const

export type NavItem = { label: string; href: string }

export const NAV_ITEMS: NavItem[] = [
  { label: 'Услуги', href: '#services' },
  { label: 'Цены', href: '#pricing' },
  { label: 'Работы', href: '#works' },
  { label: 'Процесс', href: '#process' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#contact' },
]

export type Stat = { value: string; label: string }

export const STATS: Stat[] = [
  { value: '7', label: 'дней до запуска лендинга' },
  { value: '60+', label: 'проектов под ключ' },
  { value: '4.9', label: 'средняя оценка клиентов' },
  { value: '100%', label: 'адаптив под все экраны' },
]

export type Service = {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
}

export const SERVICES: Service[] = [
  {
    icon: LayoutTemplate,
    title: 'Продающие лендинги',
    description:
      'Одностраничные сайты, которые ведут посетителя к заявке. Смысловая структура, сильные офферы и аккуратные анимации.',
    features: ['Прототип и структура', 'Уникальный дизайн', 'Форма заявок и аналитика'],
  },
  {
    icon: Layers,
    title: 'Корпоративные сайты',
    description:
      'Многостраничные сайты с каталогом, блогом и интеграциями. Масштабируемая архитектура под рост бизнеса.',
    features: ['Каталог и категории', 'Блог и SEO-структура', 'CMS для контента'],
  },
  {
    icon: Boxes,
    title: 'Веб-приложения',
    description:
      'Личные кабинеты, дашборды и сервисы с логикой. Быстрый интерфейс и надёжный бэкенд под нагрузку.',
    features: ['Личный кабинет', 'Дашборды и метрики', 'Интеграции с API'],
  },
  {
    icon: MonitorSmartphone,
    title: 'Админ-панели',
    description:
      'Удобное управление контентом, заказами и пользователями. Настраиваем роли и права под вашу команду.',
    features: ['Управление данными', 'Роли и доступы', 'Экспорт и отчёты'],
  },
  {
    icon: Smartphone,
    title: 'Мобильная версия',
    description:
      'Каждый проект безупречно работает на телефоне: от 360px до больших экранов. Мобайл-фёрст по умолчанию.',
    features: ['Адаптив под все экраны', 'Тач-жесты и скорость', 'PWA по запросу'],
  },
  {
    icon: Sparkles,
    title: 'Дизайн и анимации',
    description:
      'Премиальный визуал и осмысленная моушн-графика. Делаем так, чтобы бренд запоминался с первого экрана.',
    features: ['UI/UX дизайн', 'Микро-анимации', 'Дизайн-система'],
  },
]

export type Plan = {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
}

export const PLANS: Plan[] = [
  {
    name: 'Лендинг',
    price: 'от 45 000 ₽',
    period: '5–7 дней',
    description: 'Одностраничный сайт под ключ для запуска рекламы и сбора заявок.',
    features: [
      'Прототип и копирайтинг',
      'Уникальный дизайн',
      'Адаптив под все устройства',
      'Форма заявок + интеграция',
      'Запуск на вашем домене',
    ],
    cta: 'Заказать лендинг',
  },
  {
    name: 'Сайт под ключ',
    price: 'от 120 000 ₽',
    period: '2–4 недели',
    description: 'Многостраничный сайт с CMS, каталогом и продуманным SEO.',
    features: [
      'До 8 страниц + CMS',
      'Каталог и блог',
      'Базовое SEO и аналитика',
      'Анимации и микро-взаимодействия',
      'Обучение и поддержка 30 дней',
    ],
    highlighted: true,
    cta: 'Обсудить проект',
  },
  {
    name: 'Веб-продукт',
    price: 'от 300 000 ₽',
    period: 'от 1 месяца',
    description: 'Сайт + веб-приложение + мобильная версия + админ-панель.',
    features: [
      'Личный кабинет и роли',
      'Админ-панель управления',
      'Интеграции и платежи',
      'Дашборды и отчёты',
      'Сопровождение и развитие',
    ],
    cta: 'Рассчитать стоимость',
  },
]

export type Work = {
  title: string
  category: string
  image: string
  tags: string[]
}

export const WORKS: Work[] = [
  {
    title: 'Лесная Тишина',
    category: 'Премиальный глэмпинг',
    image: '/portfolio/glamping.webp',
    tags: ['Лендинг', 'Бронирование'],
  },
  {
    title: 'Forma',
    category: 'Кухни на заказ',
    image: '/portfolio/kitchens.webp',
    tags: ['Сайт', 'Каталог'],
  },
  {
    title: 'Atelier Paws',
    category: 'Премиальный груминг-салон',
    image: '/portfolio/grooming.webp',
    tags: ['Лендинг', 'Онлайн-запись'],
  },
  {
    title: 'Елена Морозова',
    category: 'Психолог и психотерапевт',
    image: '/portfolio/psychology.webp',
    tags: ['Личный бренд', 'Лендинг'],
  },
  {
    title: 'PulseFit',
    category: 'Платформа фитнес-студии',
    image: '/portfolio/fitness.webp',
    tags: ['Веб-приложение', 'Дашборд'],
  },
  {
    title: 'Обжарка №7',
    category: 'Кофейная обжарка',
    image: '/portfolio/coffee.webp',
    tags: ['Магазин', 'E-commerce'],
  },
]

export type ProcessStep = {
  icon: LucideIcon
  step: string
  title: string
  description: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: Search,
    step: '01',
    title: 'Бриф и анализ',
    description:
      'Погружаемся в задачу, изучаем нишу и конкурентов, формулируем офферы и структуру.',
  },
  {
    icon: PenTool,
    step: '02',
    title: 'Прототип и дизайн',
    description:
      'Собираем прототип, затем — премиальный дизайн с фирменным стилем и анимациями.',
  },
  {
    icon: Server,
    step: '03',
    title: 'Разработка',
    description:
      'Верстаем адаптивно и подключаем логику: формы, интеграции, админ-панель.',
  },
  {
    icon: Rocket,
    step: '04',
    title: 'Запуск на домене',
    description:
      'Тестируем, ускоряем, публикуем на вашем домене и передаём проект с поддержкой.',
  },
]

export type Feature = { icon: LucideIcon; title: string; description: string }

export const ADVANTAGES: Feature[] = [
  {
    icon: Gauge,
    title: 'Скорость до 90+',
    description: 'Оптимизируем под Lighthouse: быстрый первый экран и высокие метрики.',
  },
  {
    icon: ShieldCheck,
    title: 'Прозрачно и по договору',
    description: 'Фиксируем сроки и объём. Вы всегда видите статус и результат.',
  },
  {
    icon: Sparkles,
    title: 'Дизайн, который продаёт',
    description: 'Не шаблон, а сильная визуальная концепция под ваш бизнес.',
  },
]

export type Review = {
  name: string
  role: string
  text: string
  initials: string
}

export const REVIEWS: Review[] = [
  {
    name: 'Дмитрий Логинов',
    role: 'Основатель, глэмпинг «Лесная Тишина»',
    text: 'За неделю получили лендинг, который сразу пошёл в рекламу. Заявки выросли, а сайт выглядит дороже конкурентов.',
    initials: 'ДЛ',
  },
  {
    name: 'Анна Ковалёва',
    role: 'Маркетолог, «Forma»',
    text: 'Сделали сайт с каталогом и CMS. Удобно наполнять самим, а дизайн вызывает доверие у клиентов.',
    initials: 'АК',
  },
  {
    name: 'Елена Морозова',
    role: 'Психолог, частная практика',
    text: 'Команда услышала меня и собрала тёплый, спокойный сайт. Записи стало заметно больше.',
    initials: 'ЕМ',
  },
  {
    name: 'Игорь Савельев',
    role: 'CEO, PulseFit',
    text: 'Нужен был не просто сайт, а платформа с кабинетом и админкой. Сделали быстро и без боли.',
    initials: 'ИС',
  },
]

export type FaqItem = { question: string; answer: string }

export const FAQ: FaqItem[] = [
  {
    question: 'Сколько времени занимает разработка?',
    answer:
      'Лендинг — 5–7 дней, корпоративный сайт — 2–4 недели, веб-приложение — от месяца. Точные сроки фиксируем после брифа.',
  },
  {
    question: 'Что входит в стоимость?',
    answer:
      'Прототип, дизайн, вёрстка, адаптив, базовая настройка форм и аналитики, а также запуск на вашем домене. Детали закрепляем в смете.',
  },
  {
    question: 'Смогу ли я сам обновлять сайт?',
    answer:
      'Да. Для контентных проектов подключаем CMS или админ-панель и проводим короткое обучение вашей команды.',
  },
  {
    question: 'Вы помогаете после запуска?',
    answer:
      'Да, есть период бесплатной поддержки, а дальше — сопровождение и развитие проекта по договорённости.',
  },
  {
    question: 'А если у меня нет текстов и материалов?',
    answer:
      'Поможем с копирайтингом и структурой, подберём визуал. От вас — только информация о бизнесе на брифе.',
  },
]

export const HERO = {
  badge: 'Команда, которая создаёт цифровые продукты',
  titleLines: ['Создаём сайты,', 'которые', 'продают'],
  description:
    'SimanDev — премиальный дизайн, анимации и разработка под ключ. От брифа до запуска на домене в короткие сроки.',
  primaryCta: 'Обсудить проект',
  secondaryCta: 'Смотреть работы',
} as const

export const MISSION = {
  title: 'Наша миссия',
  text: 'Мы делаем так, чтобы каждый бизнес имел свой идеальный сайт или лендинг. Нормальные, честные и продающие сайты — для всех.',
} as const

export const CTA = {
  discuss: 'Обсудить проект',
  telegramAria: 'Написать в Telegram',
} as const

export type SectionIntro = {
  eyebrow: string
  title: string
  description: string
}

export const SECTIONS = {
  services: {
    eyebrow: 'Услуги',
    title: 'Что мы делаем',
    description:
      'От одностраничного лендинга до полноценного веб-продукта с админ-панелью и мобильной версией — под ключ и в короткие сроки.',
  },
  works: {
    eyebrow: 'Работы',
    title: 'Проекты, которыми гордимся',
    description:
      'Подборка недавних проектов под ключ: от премиальных лендингов до веб-приложений с админ-панелью.',
  },
  process: {
    eyebrow: 'Процесс',
    title: 'Как мы работаем',
    description:
      'Понятный путь от идеи до запуска. Вы всегда знаете, на каком этапе проект и что будет дальше.',
  },
  pricing: {
    eyebrow: 'Цены',
    title: 'Прозрачные пакеты',
    description:
      'Стоимость зависит от объёма задач. Ниже — ориентиры, а точную смету зафиксируем после короткого брифа.',
  },
  reviews: {
    eyebrow: 'Отзывы',
    title: 'Что говорят клиенты',
    description:
      'Нам доверяют бизнесы из разных ниш — и возвращаются за новыми проектами.',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Частые вопросы',
    description: 'Не нашли ответ? Напишите нам — ответим и поможем с выбором.',
  },
  contact: {
    eyebrow: 'Контакты',
    title: 'Обсудим ваш проект',
    description:
      'Оставьте заявку — вернёмся с вопросами по задаче, сроками и ориентиром по стоимости. Или напишите нам напрямую.',
  },
} as const satisfies Record<string, SectionIntro>

export const PRICING_LABELS = {
  popular: 'Популярный выбор',
  periodPrefix: 'Срок: ',
} as const

export const REVIEWS_LABELS = {
  ratingAria: 'Оценка 5 из 5',
} as const

export const HEADER = {
  navAria: 'Основная навигация',
  mobileNavAria: 'Мобильная навигация',
  openMenu: 'Открыть меню',
  closeMenu: 'Закрыть меню',
} as const

export const FOOTER = {
  description: `Команда разработки ${CONTACTS.brand}. Делаем так, чтобы каждый бизнес имел свой идеальный сайт или лендинг.`,
  navTitle: 'Разделы',
  navAria: 'Навигация в подвале',
  contactsTitle: 'Контакты',
  rights: 'Все права защищены.',
  privacyLink: 'Политика конфиденциальности',
} as const

export const CONTACT_CHANNELS = {
  telegram: 'Telegram',
  email: 'Email',
} as const

export const FORM = {
  labels: {
    name: 'Имя',
    phone: 'Телефон',
    message: 'Сообщение (необязательно)',
    honeypot: 'Компания',
  },
  placeholders: {
    name: 'Как вас зовут?',
    phone: '+7 (999) 999-99-99',
    message: 'Коротко о задаче: что за бизнес и что нужно сделать',
  },
  consent: {
    prefix: 'Я согласен(-на) на обработку персональных данных и принимаю',
    linkLabel: 'политику конфиденциальности',
  },
  submit: 'Отправить заявку',
  submitting: 'Отправляем…',
  success: {
    title: 'Спасибо!',
    text: 'Мы получили вашу заявку и свяжемся с вами в ближайшее время.',
    again: 'Отправить ещё одну заявку',
  },
  error:
    'Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в Telegram.',
} as const
