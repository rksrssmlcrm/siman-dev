# SSH-доступ к VPS Timeweb — SimanDev

Краткая инструкция, чтобы `./deploy/server-init.sh` и `./deploy/deploy.sh` могли подключаться к серверу.

---

## 1. Данные из панели Timeweb

1. Зайди в [Timeweb Cloud](https://timeweb.cloud/) → **Облачные серверы** → твой VPS.
2. Запиши:
   - **IP-адрес** (например `185.xxx.xxx.xxx`)
   - **Логин** — обычно `root` (или пользователь, если создавал)
   - **Пароль root** — приходит при создании VPS (или сбрось в панели)

---

## 2. SSH-ключ на Windows (один раз)

Открой **PowerShell**:

```powershell
# Создать ключ (Enter на все вопросы, passphrase можно оставить пустым)
ssh-keygen -t ed25519 -C "simandev-deploy" -f $env:USERPROFILE\.ssh\id_ed25519_simandev

# Показать публичный ключ — скопируй целиком
Get-Content $env:USERPROFILE\.ssh\id_ed25519_simandev.pub
```

---

## 3. Добавить ключ в Timeweb

**Вариант A — при создании VPS:** в разделе «SSH-ключи» вставь содержимое `.pub`.

**Вариант B — на работающем сервере:**

```powershell
# Первый вход по паролю (подставь IP из панели)
ssh root@185.xxx.xxx.xxx
```

На сервере:

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys   # вставь строку из .pub, сохрани
chmod 600 ~/.ssh/authorized_keys
exit
```

---

## 4. Алиас в `~/.ssh/config`

Создай или отредактируй файл `C:\Users\<ты>\.ssh\config`:

```
Host simandev
    HostName 185.xxx.xxx.xxx
    User root
    IdentityFile ~/.ssh/id_ed25519_simandev
    IdentitiesOnly yes
```

Проверка:

```powershell
ssh simandev "echo OK && uname -a"
```

Должно подключиться **без пароля** и вывести `OK`.

---

## 5. Запуск деплоя

Из **Git Bash** (или WSL) в каталоге проекта:

```bash
chmod +x deploy/server-init.sh deploy/deploy.sh
./deploy/server-init.sh simandev
# заполни .env на сервере: ssh simandev && nano /srv/simandev/deploy/.env
./deploy/deploy.sh simandev
```

---

## Домен ещё не куплен?

Пока нет домена:

1. В `.env` на сервере **оставь `STAGING_DOMAIN` пустым** или укажи IP.
2. `deploy.sh` автоматически поднимет **HTTP на порту 8080** (без TLS).
3. Открой в браузере: `http://<IP-вашего-VPS>:8080`
4. В Timeweb открой порт **8080** в файрволе панели (если есть cloud firewall).

Когда купишь домен:

1. A-запись `@` → IP VPS, подожди 5–30 мин.
2. В `.env`: `STAGING_DOMAIN=simandev.ru`, `NEXT_PUBLIC_SITE_URL=https://simandev.ru`, `CORS_ORIGINS=https://simandev.ru`
3. Снова `./deploy/deploy.sh simandev` — Caddy получит Let's Encrypt-сертификат.

---

## Cursor / агент

Агент подключается **только через твой локальный SSH** (`~/.ssh/config`).  
Секреты в чат не нужны — достаточно настроить alias `simandev` как выше и написать «готово».
