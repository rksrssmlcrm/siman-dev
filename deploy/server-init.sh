#!/usr/bin/env bash
# One-time server bootstrap for SimanDev.
# Usage (from repo root, Git Bash / WSL / Linux):
#   ./deploy/server-init.sh [ssh-host]
#
# Does NOT accept secrets as arguments. Creates deploy/.env from template only.
set -euo pipefail

SSH_HOST="${1:-simandev}"
REMOTE_DIR="/srv/simandev"
REPO_URL="https://github.com/rksrssmlcrm/siman-dev.git"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Connecting to ${SSH_HOST} (${REMOTE_DIR})"

ssh -o BatchMode=yes -o ConnectTimeout=15 "${SSH_HOST}" "bash -s" <<REMOTE
set -euo pipefail
REMOTE_DIR="${REMOTE_DIR}"
REPO_URL="${REPO_URL}"

run_root() {
  if sudo -n true 2>/dev/null; then
    sudo "\$@"
  else
    echo ">>> Run manually (sudo required): \$*"
    return 1
  fi
}

echo "==> Checking Docker"
if ! command -v docker >/dev/null 2>&1; then
  echo "    Installing Docker..."
  if curl -fsSL https://get.docker.com | run_root sh; then
    run_root usermod -aG docker "\${USER}" || true
    echo "    Docker installed. You may need to re-login for group membership."
  else
    echo "    Install Docker manually: curl -fsSL https://get.docker.com | sh"
  fi
else
  echo "    Docker already installed: \$(docker --version)"
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "ERROR: docker compose plugin not found after Docker install."
  exit 1
fi

echo "==> Creating project directory"
run_root mkdir -p "\${REMOTE_DIR}" || mkdir -p "\${REMOTE_DIR}"
run_root chown "\${USER}:\${USER}" "\${REMOTE_DIR}" 2>/dev/null || true

echo "==> Cloning repository (if missing)"
if [ ! -d "\${REMOTE_DIR}/.git" ]; then
  git clone "\${REPO_URL}" "\${REMOTE_DIR}"
else
  echo "    Repository already exists at \${REMOTE_DIR}"
fi

echo "==> Environment file"
ENV_FILE="\${REMOTE_DIR}/deploy/.env"
if [ ! -f "\${ENV_FILE}" ]; then
  cp "\${REMOTE_DIR}/deploy/.env.production.example" "\${ENV_FILE}"
  echo "    Created \${ENV_FILE} from template."
else
  echo "    \${ENV_FILE} already exists — not overwritten."
fi

echo "==> UFW firewall"
if command -v ufw >/dev/null 2>&1; then
  run_root ufw allow 22/tcp comment 'SSH' 2>/dev/null || true
  run_root ufw allow 80/tcp comment 'HTTP' 2>/dev/null || true
  run_root ufw allow 443/tcp comment 'HTTPS' 2>/dev/null || true
  if run_root ufw status 2>/dev/null | grep -q "Status: active"; then
    echo "    UFW already active."
  else
    run_root ufw --force enable 2>/dev/null || echo ">>> Enable UFW manually: sudo ufw enable"
  fi
else
  echo ">>> UFW not installed. Optional: sudo apt install ufw && sudo ufw allow 22,80,443 && sudo ufw enable"
fi

echo "==> unattended-upgrades"
if command -v apt-get >/dev/null 2>&1; then
  if dpkg -s unattended-upgrades >/dev/null 2>&1; then
    echo "    unattended-upgrades already installed."
  else
    run_root apt-get update -qq && run_root apt-get install -y unattended-upgrades 2>/dev/null || \
      echo ">>> Install manually: sudo apt install unattended-upgrades"
  fi
else
  echo "    Skipped (not Debian/Ubuntu)."
fi

echo "==> fail2ban"
if command -v fail2ban-client >/dev/null 2>&1; then
  echo "    fail2ban already installed."
  run_root systemctl enable fail2ban 2>/dev/null || true
  run_root systemctl start fail2ban 2>/dev/null || true
else
  if command -v apt-get >/dev/null 2>&1; then
    run_root apt-get install -y fail2ban 2>/dev/null || \
      echo ">>> Install manually: sudo apt install fail2ban && sudo systemctl enable --now fail2ban"
  else
    echo ">>> Install fail2ban manually for your OS."
  fi
fi

echo "==> Backups directory"
run_root mkdir -p /backups/simandev 2>/dev/null || mkdir -p "\${HOME}/backups/simandev" 2>/dev/null || true
if [ -d /backups/simandev ]; then
  run_root chmod 700 /backups/simandev 2>/dev/null || echo ">>> Run: sudo chmod 700 /backups/simandev"
fi

echo ""
echo "=============================================="
echo "  Server init complete."
echo "=============================================="
echo ""
echo "  NEXT STEP — fill in secrets on the server:"
echo "    ssh ${SSH_HOST}"
echo "    nano ${REMOTE_DIR}/deploy/.env"
echo ""
echo "  Required variables (see deploy/.env.production.example):"
echo "    STAGING_DOMAIN, ACME_EMAIL, POSTGRES_*, DATABASE_URL,"
echo "    SECRET_KEY, CORS_ORIGINS, TELEGRAM_* (or SMTP_*),"
echo "    NEXT_PUBLIC_SITE_URL"
echo ""
echo "  Without a domain yet: set STAGING_DOMAIN to your server IP"
echo "  and use HTTP-only deploy (see docs/DEPLOY.md § Staging)."
echo ""
echo "  When .env is ready, run from your machine:"
echo "    ./deploy/deploy.sh ${SSH_HOST}"
echo ""
REMOTE

echo "==> Done."
