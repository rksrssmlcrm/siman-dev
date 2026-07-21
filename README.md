# SimanDev — landing project

![Скриншот проекта](docs/assets/screenshot-placeholder.png)

Лендинг студии веб-разработки **SimanDev** для домена **simandev.ru** с последующим развитием до полной системы:
- frontend на Next.js 16;
- backend на FastAPI для приёма заявок;
- деплой в Docker на VPS за reverse proxy.

Подробная целевая архитектура: `docs/ARCHITECTURE.md`.

## Стек

- Frontend: Next.js `16.2.x`, React `19.2.x`, TypeScript `5.9.x` (strict), Tailwind CSS `4.3.x`, shadcn/ui primitives
- Validation/forms: zod `4.x`, react-hook-form `7.x`
- Backend (план): FastAPI + Pydantic v2 + SQLAlchemy 2.0 async + PostgreSQL
- Tooling: pnpm `11.x`, uv, Docker Compose v2

## Требования

- Node.js `22 LTS`
- pnpm `11+`
- Python `3.13`
- uv
- Docker + Docker Compose v2

## Быстрый старт (локально)

1) Создайте env-файл:

```bash
cp .env.example .env
```

2) Заполните переменные в `.env` (минимум: `NEXT_PUBLIC_SITE_URL`, `TELEGRAM_*`, `DATABASE_URL` для будущего backend).

### Frontend

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm dev
```

Проверки:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

### Backend (когда появится код)

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

### Docker (плановая схема окружения)

```bash
docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.dev.yml up --build
```

## Структура репозитория

```text
frontend/   # Next.js приложение
backend/    # FastAPI приложение (скелет)
deploy/     # docker-compose, reverse proxy, деплой-скрипты
docs/       # аудит, архитектура, гайды
```

См. детали: `docs/ARCHITECTURE.md`.

## Команды

### Frontend

```bash
cd frontend
pnpm dev
pnpm typecheck
pnpm lint
pnpm build
pnpm start
```

### Backend (план)

```bash
cd backend
uv sync
uv run ruff check .
uv run pytest
uv run alembic upgrade head
```

## Деплой

Инструкции деплоя будут в `docs/DEPLOY.md` (появится на шагах 09–10).
