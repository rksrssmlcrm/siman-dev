# SimanDev Backend

FastAPI service for lead intake from the SimanDev landing page.

## Requirements

- Python 3.13+
- [uv](https://docs.astral.sh/uv/)

## Setup

1. Copy env variables from repository root:

```bash
cp ../.env.example ../.env
```

2. Fill backend-related variables in `.env` (see below).

3. Install dependencies:

```bash
uv sync --extra dev
```

4. Run migrations:

```bash
uv run alembic upgrade head
```

5. Start API:

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or via Makefile:

```bash
make dev
```

## Required env variables

- `ENVIRONMENT` — `local` | `staging` | `production`
- `DATABASE_URL` — e.g. `postgresql+asyncpg://user:pass@localhost:5432/simandev`
- `SECRET_KEY` — min 16 chars, no default
- `CORS_ORIGINS` — comma-separated origins
- Notification channel (at least one):
  - `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`, and/or
  - `SMTP_HOST` + `SMTP_USER` + `SMTP_PASSWORD`
- Optional admin (`ENABLE_ADMIN=true`):
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD_HASH` (Argon2 hash)

Generate password hash:

```bash
uv run python -c "from app.services.admin import hash_password; print(hash_password('your-password'))"
```

## Commands

```bash
make dev        # run API with reload
make test       # pytest
make lint       # ruff check + format check
make format     # ruff fix + format
make migrate    # alembic upgrade head
make retention  # purge leads older than LEAD_RETENTION_DAYS
```

Cron example (daily purge):

```bash
0 3 * * * cd /path/to/backend && uv run simandev-retention
```

Or HTTP endpoint (admin auth required):

```http
POST /api/admin/retention/purge
```

## API

- `POST /api/leads` — create lead (contract in `docs/ARCHITECTURE.md`)
- `GET /api/health` — health check
- `GET /api/admin/leads` — list leads (when `ENABLE_ADMIN=true`)
- `PATCH /api/admin/leads/{id}` — update lead status
- `POST /api/admin/retention/purge` — retention cleanup

Keep Pydantic schema in `app/schemas/lead.py` synchronized with
`frontend/lib/validation/lead.ts`.
