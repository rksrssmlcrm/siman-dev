# Аудит кода, сгенерированного v0 — SimanDev

Дата: 2026-07-21. Ничего не исправлялось — только анализ и план.

> **Обновление 2026-07-21 (после рефакторинга):** пункты P0 (1–6) и P1 (7–11) выполнены полностью,
> из P2 выполнены 12, 13 и 16 частично (см. отметки ✅ в плане ниже). Код перенесён в `frontend/`
> согласно `docs/ARCHITECTURE.md`. Оставшееся: типизация ref в `reveal.tsx` (`@ts-expect-error`),
> `tsconfig` target (остался ES6 — не мешает, Next транспилирует сам), README.

Статусы: **OK** / **Исправить** / **КРИТИЧНО**

---

## 1. Инвентаризация

### 1.1 Версии в package.json — статус: Исправить

Ядро стека соответствует зафиксированному:

| Пакет | Установлено | Требование | Вердикт |
|---|---|---|---|
| next | 16.2.6 | Next.js 16 | OK |
| react / react-dom | 19.2.7 | React 19.2 | OK |
| tailwindcss | 4.3.3 (без `tailwind.config.js`, `@theme` в CSS) | Tailwind v4 | OK |
| typescript | 5.7.3, strict: true | strict | OK |
| zod | 4.4.3 | — | OK |

Проблемы:

- `package.json:2` — имя проекта `"my-project"`; переименовать в `simandev`.
- `package.json:23` — `shadcn: ^4.8.0` в `dependencies`. Это CLI, а не runtime-библиотека; должен ставиться через `pnpm dlx shadcn`, из зависимостей удалить.
- `package.json:36-40` — `pnpm.overrides.hono: 4.12.25` — мусор от v0-песочницы, сам `hono` нигде не установлен и не используется. Удалить.
- В корне лежат **оба лок-файла**: `pnpm-lock.yaml` и `package-lock.json` (200 КБ). Менеджер — pnpm, `package-lock.json` удалить.
- `package.json:5-10` — скрипт `lint: "eslint ."` есть, но **ESLint не установлен** (нет ни в devDependencies, ни конфига). `pnpm lint` падает. Скрипта `typecheck` нет вообще → Definition of Done из правил проекта сейчас невыполним.
- pnpm не установлен глобально на машине (проверки запускались через `npx`). Установить: `corepack enable pnpm`.

### 1.2 Неиспользуемые зависимости, компоненты, ассеты — статус: Исправить

- Зависимости: все runtime-пакеты, кроме `shadcn`, реально используются (`@base-ui/react` — в ui-компонентах, `tw-animate-css` — в `globals.css:2`, cva/clsx/tailwind-merge — в ui и `lib/utils.ts`).
- `@vercel/analytics` (`app/layout.tsx:1,69`) — работает только на хостинге Vercel; при деплое на VPS бесполезен. Удалить и подключить Яндекс.Метрику (env `NEXT_PUBLIC_METRIKA_ID` уже заведён в `.env.example`).
- Компоненты: все файлы в `components/` используются, **но ни один не подключён к странице** (см. п. 2.1).
- Мусорные ассеты в `public/`: `placeholder-logo.png`, `placeholder-logo.svg`, `placeholder-user.jpg`, `placeholder.jpg` — не используются нигде, удалить. `placeholder.svg` используется как fallback (`hero.tsx:48`, `works.tsx:27`) — оставить.
- `public/icon.svg`, `icon-dark-32x32.png`, `icon-light-32x32.png`, `apple-icon.png` — лежат в `public/`, но ни `metadata.icons`, ни файловой конвенции `app/icon.*` нет → **фавиконки не подключены** (см. п. 5).

### 1.3 Структура каталогов — статус: OK

Логичная структура: `app/` (layout, page, globals.css), `components/sections/` (9 секций), `components/site/` (каркас: header, footer, logo, reveal и т.п.), `components/ui/` (6 shadcn/Base UI примитивов), `lib/` (content.ts, utils.ts). Нелогичного размещения нет. Отсутствуют (понадобятся): `app/api/`, `app/privacy/`, `docs/`, `backend/`.

---

## 2. Качество кода

### 2.1 Страница не собрана — статус: КРИТИЧНО

`app/page.tsx:1-47` — это **дефолтная заглушка v0** («Your v0 generation will show here»): инлайн-стили, хардкод hex-цветов (`#fff`, `#000`, `#71717a` — строки 11, 12, 40), английский текст. Ни одна из 9 готовых секций и каркасных компонентов не подключены — сайт фактически пуст. Требуется собрать страницу:

`Header` → `Hero` → `Mission` → `Services` → `Works` → `Process` → `Pricing` → `Reviews` → `Faq` → `Contact` → `Footer` + `MobileCtaBar`.

### 2.2 TypeScript — статус: КРИТИЧНО

- `npx tsc --noEmit` падает: `components/sections/faq.tsx:23` — проп `openMultiple` не существует у Base UI `Accordion.Root`, правильный — `multiple`. Ошибка типов = сейчас аккордеон молча игнорирует настройку.
- `next.config.mjs:3-5` — `typescript.ignoreBuildErrors: true`: билд **скрывает ошибки типов**. Убрать после исправления faq.tsx.
- `any` в коде нет, типы на месте. Единственный хак — `components/site/reveal.tsx:52` `@ts-expect-error` на ref динамического тега (терпимо, можно типизировать позже).
- `tsconfig.json:9` — `target: "ES6"` устарел, поднять до ES2022 (мелочь).

### 2.3 Компоненты — статус: OK

- `"use client"` только там, где нужно: `header.tsx` (скролл/меню), `mobile-cta-bar.tsx` (скролл), `reveal.tsx` (IntersectionObserver), `lead-form.tsx` (форма), `ui/checkbox.tsx`. Все 9 секций — серверные. Лишних нет.
- Монолитов нет: самый большой файл — `lead-form.tsx` (247 строк, оправдано формой), остальные < 140 строк.
- Дублирования разметки между секциями почти нет — вынесены `SectionHeading` и `Reveal`. Мелкий дубль: бейдж-«pill» в `contact.tsx:17-20` повторяет разметку из `section-heading.tsx:27-30` (Contact не использует SectionHeading). Некритично.

### 2.4 Хардкод текстов — статус: Исправить

Основной контент образцово вынесен в `lib/content.ts`. Исключения (тексты в JSX):

- `components/sections/lead-form.tsx` — все тексты формы: сообщения валидации (15-31), «Спасибо!» (95-98), лейблы и плейсхолдеры (117-167), согласие (206-211), ошибка отправки (224), «Отправить заявку» (242).
- `components/sections/contact.tsx:19-27` — «Контакты», «Обсудим ваш проект», описание.
- `components/site/header.tsx:57,94` и `mobile-cta-bar.tsx:28` — «Обсудить проект».
- `components/sections/pricing.tsx:33` — «Популярный выбор»; `pricing.tsx:12-15`, `services.tsx:11-13`, `works.tsx:12-14`, `process.tsx:10-12`, `reviews.tsx:11-13`, `faq.tsx:16-18` — eyebrow/title/description секций.
- `components/site/footer.tsx:14-15,20,36,62,68` — тексты подвала.

Перенести в `lib/content.ts` (для формы — отдельный блок `FORM`).

### 2.5 Магические значения вместо токенов — статус: Исправить (мелкое)

Дизайн-система на токенах `@theme` — хорошо. Отклонения:

- `app/page.tsx:11,12,40` — hex-цвета (уйдут при пересборке страницы).
- `app/layout.tsx:55` — `themeColor: '#1a1830'` — дубль фона в hex; вынести в константу рядом с токенами или принять осознанно.
- Произвольные значения в классах: `blur-[120px]` (`hero.tsx:67`, `contact.tsx:12`), `blur-[100px]` (`mission.tsx:10`), `w-[42rem]` (`hero.tsx:67`), `-left-[9999px]` (`lead-form.tsx:176` — honeypot, допустимо). Декоративные, низкий приоритет.

### 2.6 Состояние — статус: OK

Лишнего клиентского состояния нет: `useState` только для меню/скролла/статуса формы. Redux/Zustand отсутствуют — правильно. Серверные секции читают данные из `lib/content.ts` напрямую.

---

## 3. Доступность и семантика — статус: OK (после сборки страницы)

- Один `h1` — `hero.tsx:86` (но пока страница-заглушка, на сайте нет ни одного h1 — лечится сборкой страницы). Иерархия h2 (SectionHeading, contact, footer) → h3 (карточки) корректна.
- Семантика: `header/nav/section/footer`, `dl` для статистики (`hero.tsx:117`), `ol` для шагов процесса (`process.tsx:15`), `figure` для карточек. Хорошо.
- `alt`: осмысленные у контентных изображений (`works.tsx:28`), пустые + `aria-hidden` у декоративных (`hero.tsx:49`, `logo.tsx:17`) — корректно.
- Формы: `Label htmlFor` на каждом поле, `aria-invalid`, `aria-describedby` с id ошибок, `role="status"`/`role="alert"` (`lead-form.tsx:89-90,221`).
- Фокус: `focus-visible:ring` в ui-примитивах, навигации и логотипе.
- `prefers-reduced-motion` уважается: `globals.css:87-98` и `reveal.tsx:27-33`.
- Контраст: `muted-foreground` (oklch L≈0.72) на фоне L≈0.16 — проходит 4.5:1. Проверить визуально `brand-text`-градиент на тёмном фоне в hero.
- Замечание: `header.tsx:62-71` — мобильное меню не возвращает фокус и не закрывается по Escape (nice-to-have).

---

## 4. Производительность

### 4.1 Изображения — статус: КРИТИЧНО

- `next.config.mjs:6-8` — `images.unoptimized: true` **полностью выключает оптимизацию** `next/image` (артефакт v0-песочницы). При этом в `public/portfolio/` лежат PNG по 0.5–1.3 МБ (glamping.png — 1.29 МБ, coffee.png — 1.04 МБ), 6 штук ≈ 5.2 МБ. Hero показывает 4 из них сразу. С выключенной оптимизацией Lighthouse ≥ 90 недостижим. Убрать флаг (на VPS Next сам оптимизирует через sharp) и/или пережать исходники в WebP/AVIF шириной ≤ 1280px.
- `public/simandev-logo.jpg` — 214 КБ для логотипа размером 36px (`logo.tsx:14-22`). Пережать до ~5 КБ или заменить на SVG.
- `<img>` в коде нет — везде `next/image`. OK.

### 4.2 Шрифты — статус: OK

`app/layout.tsx:3-17` — Manrope и Unbounded через `next/font/google` с `display: swap` и кириллическими сабсетами. CDN-шрифтов в `<head>` нет.

### 4.3 Клиентский JS — статус: OK

Тяжёлых клиентских библиотек нет; react-hook-form + zod загружаются в клиентском бандле формы — приемлемо (можно позже обернуть `Contact`/`LeadForm` в `next/dynamic`). `next/image` лениво грузит изображения ниже фолда по умолчанию; `priority` стоит только на логотипе (`logo.tsx:21`) — спорно, лучше на hero-картинках.

---

## 5. SEO — статус: Исправить

| Элемент | Состояние |
|---|---|
| `metadata` (title, description, keywords) | OK — `app/layout.tsx:21-51`, тексты на русском |
| Open Graph / Twitter | Частично — теги есть (`layout.tsx:35-49`), но **нет OG-изображения** (ни файла, ни `openGraph.images`) |
| favicon | **Не подключён** — иконки лежат в `public/`, но нет ни `app/icon.svg`/`app/apple-icon.png` (файловая конвенция), ни `metadata.icons`; `favicon.ico` отсутствует |
| `robots.txt` | **Нет** — создать `app/robots.ts` |
| `sitemap.xml` | **Нет** — создать `app/sitemap.ts` |
| URL сайта | Хардкод `https://simandev.ru` в `layout.tsx:19` — вынести в `NEXT_PUBLIC_SITE_URL` (env уже заведён) |
| `generator: 'v0.app'` | `layout.tsx:50` — удалить |
| lang | OK — `<html lang="ru">` |

---

## 6. Безопасность — статус: Исправить

- `dangerouslySetInnerHTML` — **нет ни одного**. OK.
- Секретов/ключей в коде нет. Хардкод публичных данных допустим: email/telegram в `lib/content.ts:17-22`, URL сайта в `layout.tsx:19` (перенести в env ради гибкости, не ради секретности).
- Форма заявки (`lead-form.tsx`):
  - Клиентская валидация zod — OK (имя 2–80, телефон по маске +7, сообщение ≤ 1000).
  - Honeypot-поле `company` — есть (`lead-form.tsx:31,176-185`), но проверяется **только на клиенте**; серверная проверка обязательна при создании API.
  - Согласие на ПДн — обязательный чекбокс со ссылкой на `/privacy` (`lead-form.tsx:189-215`) — OK, **но страницы `/privacy` не существует** (404 из формы и футера). Для 152-ФЗ это блокер запуска.
  - Rate limiting — отсутствует (делать на бэкенде/reverse proxy).
- Security-заголовки (CSP, X-Content-Type-Options, Referrer-Policy) — не настроены нигде; по правилам проекта — на уровне reverse proxy при деплое, но до этого стоит добавить в `next.config.mjs` `headers()`.
- CORS — пока неактуально (API нет).

---

## 7. Готовность к бэкенду — статус: КРИТИЧНО

`lead-form.tsx:72-76` отправляет `POST /api/lead`, но **эндпоинта не существует** (нет ни `app/api/`, ни бэкенда) → каждая отправка формы заканчивается ошибкой «Не удалось отправить заявку». Это второй недоделанный v0-хвост после page.tsx.

Контракт данных, который уже зашит в клиенте (zod-схема `lead-form.tsx:15-32`):

```json
POST /api/lead
Content-Type: application/json
{
  "name": "string, 2..80",
  "phone": "string, строго '+7 (999) 999-99-99'",
  "message": "string <= 1000, optional",
  "consent": true,
  "company": ""  // honeypot, должен быть пустым
}
```

Рекомендации для API:

- Вынести zod-схему из `lead-form.tsx` в `lib/schemas.ts` — единый контракт клиент/сервер (по правилу 10-frontend).
- Нормализовать телефон в E.164 (`+79999999999`) перед отправкой на сервер; Pydantic-схема на бэкенде валидирует уже нормализованный формат.
- Переходный вариант: Next Route Handler `app/api/lead/route.ts` (валидация + отправка в Telegram) → позже заменить на проксирование в FastAPI `/api/lead`.
- Ответ об ошибке — RFC 9457; на клиенте статусы уже обрабатываются (`success`/`error`).

---

## Приоритизированный план рефакторинга

### P0 — блокеры (сайт не работает / билд врёт)

1. ✅ **Собрать `app/page.tsx`** из готовых секций (Header, Hero, Mission, Services, Works, Process, Pricing, Reviews, Faq, Contact, Footer, MobileCtaBar), удалить заглушку v0.
2. ✅ **Исправить `faq.tsx:23`**: `openMultiple` → `multiple`.
3. ✅ **Починить `next.config.mjs`**: убрать `ignoreBuildErrors: true` и `images.unoptimized: true`. *(Конвертирован в `next.config.ts` с dev-rewrite `/api/*` → `BACKEND_URL`.)*
4. ✅ **Восстановить проверки**: установить ESLint (`eslint`, `eslint-config-next`) + конфиг, добавить скрипт `typecheck: "tsc --noEmit"`; убедиться, что `typecheck && lint && build` зелёные.
5. ✅ **Создать route handler** — сделан `app/api/leads/route.ts` по контракту из ARCHITECTURE.md (zod-валидация, серверный honeypot с фиктивным 201, ошибки RFC 9457). Позже заменить на FastAPI.
6. ✅ **Создать `app/privacy/page.tsx`** — политика конфиденциальности (152-ФЗ, на неё ссылаются форма и футер). Тексты в `lib/privacy.ts`.

### P1 — до запуска

7. ✅ Изображения: пережаты в WebP ≤ 1280px (5.2 МБ → 333 КБ: 41–82 КБ каждая), `simandev-logo.jpg` 214 КБ → `simandev-logo.webp` 2 КБ. Скрипт: `frontend/scripts/optimize-images.mjs`.
8. ✅ SEO-хвосты: `app/robots.ts` (staging закрыт от индексации), `app/sitemap.ts`, фавиконки перенесены в `app/icon.svg` и `app/apple-icon.png`, OG-изображение генерируется в `app/opengraph-image.tsx`, `generator: 'v0.app'` удалён, `siteUrl` берётся из `NEXT_PUBLIC_SITE_URL` (`lib/site.ts`).
9. ✅ Аналитика: `@vercel/analytics` удалён, Яндекс.Метрика подключается через `NEXT_PUBLIC_METRIKA_ID` (`components/site/metrika.tsx`, выключена, если env пуст).
10. ✅ Гигиена `package.json`: имя `simandev-frontend`, удалены `shadcn` и `pnpm.overrides.hono`, удалён `package-lock.json`.
11. ✅ Zod-схемы вынесены в `lib/validation/lead.ts` (контракт `POST /api/leads` + клиентская схема с маской), телефон нормализуется в E.164 перед отправкой.

### P2 — качество

12. ✅ Тексты из JSX перенесены в `lib/content.ts` (FORM, SECTIONS, HEADER, FOOTER, CTA, PRICING_LABELS и др.).
13. ✅ Мобильное меню: закрытие по Escape, возврат фокуса на кнопку.
14. ⬜ `tsconfig.json`: `target` → ES2022; типизировать ref в `reveal.tsx` без `@ts-expect-error`.
15. ✅ `w-[42rem]` → `w-2xl`, `blur-[120px]` → токен `--blur-4xl`; `blur-[100px]` в mission оставлен как декоративное исключение (визуальный паритет).
16. ⬜ README с командами запуска.

### Вход для следующего шага

Шаги P0.1–P0.4 — один сеанс рефакторинга (после каждого — `typecheck && lint && build`). P0.5–P0.6 — отдельная задача «форма и privacy». P1 — вторая итерация, P2 — фоном.
