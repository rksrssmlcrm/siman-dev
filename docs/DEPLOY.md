# Деплой SimanDev

Пошаговая инструкция по развёртыванию лендинга на VPS с Docker Compose и Caddy.

---

## 1. Требования к серверу

| Компонент | Версия |
|---|---|
| ОС | Ubuntu 22.04+ / Debian 12+ (или любой Linux с systemd) |
| Docker Engine | 24+ |
| Docker Compose plugin | v2 (`docker compose`, не `docker-compose`) |
| RAM | минимум 1 GB (рекомендуется 2 GB) |
| Диск | 10 GB+ |

Установка Docker (официальный скрипт):

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# перелогиниться, затем проверить:
docker compose version
```

---

## 2. DNS

Создайте A-запись, указывающую на IP вашего VPS:

```
simandev.ru.   A   <IP-адрес VPS>
```

Дождитесь распространения DNS (обычно 5–30 минут). Caddy автоматически получит Let's Encrypt-сертификат при первом запуске.

---

## 3. Подготовка сервера

```bash
# Клонировать репозиторий
git clone https://github.com/rksrssmlcrm/siman-dev.git /opt/simandev
cd /opt/simandev/deploy

# Создать файл окружения из шаблона
cp .env.production.example .env
nano .env   # заполнить все переменные (см. комментарии в файле)
```

### Обязательные переменные

| Переменная | Пример | Описание |
|---|---|---|
| `STAGING_DOMAIN` | `simandev.ru` | Домен сайта |
| `ACME_EMAIL` | `admin@simandev.ru` | Email для Let's Encrypt |
| `ENVIRONMENT` | `production` | Окружение |
| `POSTGRES_USER` | `simandev` | Пользователь БД |
| `POSTGRES_PASSWORD` | *(случайная строка)* | Пароль БД |
| `POSTGRES_DB` | `simandev` | Имя базы |
| `DATABASE_URL` | `postgresql+asyncpg://simandev:PASS@db:5432/simandev` | URL для SQLAlchemy |
| `SECRET_KEY` | *(32+ символов)* | `openssl rand -hex 32` |
| `CORS_ORIGINS` | `https://simandev.ru` | Разрешённые origin |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` | — | Уведомления о заявках |
| `NEXT_PUBLIC_SITE_URL` | `https://simandev.ru` | Публичный URL (build arg) |

> **Важно:** `deploy/.env` не коммитится в git. Храните резервную копию отдельно.

---

## 4. Первый запуск

```bash
cd /opt/simandev/deploy

# Сборка и запуск всех сервисов
docker compose up -d --build

# Проверить статус (все healthchecks должны быть healthy)
docker compose ps

# Посмотреть логи
docker compose logs -f
docker compose logs backend   # миграции и uvicorn
docker compose logs caddy     # TLS-сертификат
```

При первом запуске backend автоматически:
1. Ждёт готовности PostgreSQL (до 60 с).
2. Применяет миграции Alembic (`alembic upgrade head`).
3. Запускает uvicorn на порту 8000.

Caddy получает TLS-сертификат и начинает проксировать:
- `/` → frontend:3000
- `/api/*` → backend:8000

---

## 5. Проверка после деплоя

```bash
# Health backend
curl -s https://simandev.ru/api/health | jq .

# Отправить тестовую заявку
curl -s -X POST https://simandev.ru/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Тест","phone":"+79991234567","consent":true,"honeypot":""}' | jq .

# Статус контейнеров
docker compose ps
```

---

## 6. Обновление (новый релиз)

```bash
cd /opt/simandev

# Получить последний код
git pull origin main

cd deploy

# Пересобрать и перезапустить (миграции применятся автоматически)
docker compose up -d --build

# Проверить
docker compose ps
docker compose logs backend --tail 50
```

### Откат на предыдущую версию

```bash
cd /opt/simandev
git log --oneline -5          # найти нужный коммит
git checkout <commit-hash>
cd deploy
docker compose up -d --build
```

> Откат миграций Alembic (`alembic downgrade`) выполняется вручную при необходимости:
> `docker compose exec backend alembic downgrade -1`

---

## 7. Локальная проверка prod-сборки (без TLS)

На машине разработчика, с установленным Docker:

```bash
cd deploy
cp .env.production.example .env
# заполнить .env (можно использовать тестовые значения)

docker compose -f docker-compose.yml -f docker-compose.local.yml up --build
```

Сайт доступен на **http://localhost:8080**. PostgreSQL — на `localhost:5432` (только в local override).

```bash
# Проверка
curl http://localhost:8080/api/health
docker compose -f docker-compose.yml -f docker-compose.local.yml ps
```

---

## 8. Бэкап базы данных

### Ручной бэкап

```bash
cd /opt/simandev/deploy
docker compose exec db pg_dump -U $POSTGRES_USER $POSTGRES_DB \
  | gzip > /backups/simandev-$(date +%Y%m%d-%H%M%S).sql.gz
```

### Автоматический бэкап (cron, хранение 7 дней)

```bash
# Создать каталог
sudo mkdir -p /backups/simandev

# Добавить в crontab (root или пользователь docker)
crontab -e
```

```cron
# Ежедневный бэкап в 03:00, удаление старше 7 дней
0 3 * * * cd /opt/simandev/deploy && docker compose exec -T db pg_dump -U simandev simandev | gzip > /backups/simandev/$(date +\%Y\%m\%d).sql.gz && find /backups/simandev -name "*.sql.gz" -mtime +7 -delete
```

### Восстановление из бэкапа

```bash
# Остановить backend (чтобы не было записей во время restore)
docker compose stop backend

# Восстановить
gunzip -c /backups/simandev/20260721.sql.gz \
  | docker compose exec -T db psql -U simandev simandev

# Запустить backend
docker compose start backend
```

---

## 9. Структура сервисов

```
Браузер → Caddy (:443 TLS)
            ├── /          → frontend:3000  (Next.js standalone)
            └── /api/*     → backend:8000   (FastAPI + Alembic)
                                    └── db:5432 (PostgreSQL, internal network)
```

| Сервис | Сеть | Порт наружу |
|---|---|---|
| caddy | web | 80, 443 |
| frontend | web | — |
| backend | web + internal | — |
| db | internal | — |

---

## 10. Troubleshooting

| Симптом | Решение |
|---|---|
| `backend` unhealthy | `docker compose logs backend` — проверить DATABASE_URL и миграции |
| Caddy не получает сертификат | DNS ещё не обновился; проверить `STAGING_DOMAIN` и порты 80/443 |
| 502 Bad Gateway | frontend/backend ещё стартуют; подождать healthcheck |
| Заявки не приходят в Telegram | проверить `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в `.env` |
| Нужны логи | `docker compose logs -f <service>` |

---

## 11. Полезные команды

```bash
# Статус
docker compose ps

# Логи всех сервисов
docker compose logs -f

# Перезапуск одного сервиса
docker compose restart backend

# Зайти в контейнер БД
docker compose exec db psql -U simandev simandev

# Применить миграции вручную
docker compose exec backend alembic upgrade head

# Очистка просроченных заявок
docker compose exec backend simandev-retention
```

---

## 12. Staging / production деплой одной командой

Скрипты в `deploy/` запускаются **с вашей машины** (Git Bash / WSL / Linux) и работают через SSH.

| Скрипт | Когда | Что делает |
|---|---|---|
| `deploy/server-init.sh [host]` | один раз | Docker, каталог `/srv/simandev`, git clone, `.env` из шаблона, ufw/fail2ban |
| `deploy/deploy.sh [host]` | каждое обновление | `git pull` → `docker compose build` → `up -d` → smoke-check |

По умолчанию SSH-хост — **`simandev`** (alias из `~/.ssh/config`).  
Подробная настройка SSH для Timeweb: [deploy/SSH-SETUP.md](../deploy/SSH-SETUP.md).

### Первый деплой

```bash
chmod +x deploy/server-init.sh deploy/deploy.sh
./deploy/server-init.sh simandev
ssh simandev
nano /srv/simandev/deploy/.env   # заполнить переменные
exit
./deploy/deploy.sh simandev
```

### Обновление (релиз)

```bash
./deploy/deploy.sh simandev
```

### Логи на сервере

```bash
ssh simandev
cd /srv/simandev/deploy
docker compose logs -f              # все сервисы
docker compose logs -f backend      # API + миграции
docker compose logs -f caddy        # TLS / прокси
docker compose ps                   # статус healthchecks
```

### Staging: закрыть от индексации

В `deploy/.env` на сервере:

```env
STAGING=1
```

Caddy добавит `X-Robots-Tag: noindex, nofollow`. Для публичного запуска поставь `STAGING=0` и передеплой.

### Без домена (временно)

Если `STAGING_DOMAIN` пуст или это IP — `deploy.sh` использует HTTP-only override на **:8080**.  
После покупки домена обнови `.env` и запусти `deploy.sh` снова — включится HTTPS.

---

## 13. Проверка после деплоя

```bash
# Security-заголовки (с вашей машины)
curl -sI https://simandev.ru/ | grep -iE 'strict|x-frame|x-content|referrer|permissions|robots'

# Health API
curl -s https://simandev.ru/api/health

# Тестовая заявка
curl -s -X POST https://simandev.ru/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Тест","phone":"+79991234567","consent":true,"consent_text_version":"2026-07-21","honeypot":""}'
```

Проверь, что уведомление пришло в Telegram (или email, если настроен SMTP).
