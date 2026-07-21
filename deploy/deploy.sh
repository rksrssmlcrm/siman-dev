#!/usr/bin/env bash
# Idempotent deploy script — runs from your machine, executes on VPS via SSH.
#
# Strategy: git pull on server (not rsync).
#   • Reproducible exact commit from origin/main
#   • No accidental sync of local .env / node_modules
#   • Smaller updates after initial clone
#
# Usage (Git Bash / WSL / Linux, from repo root):
#   ./deploy/deploy.sh [ssh-host]
#
# Prerequisites:
#   • server-init.sh already run
#   • deploy/.env filled on server
#   • DNS A-record → server (for HTTPS via Caddy)
set -euo pipefail

SSH_HOST="${1:-simandev}"
REMOTE_DIR="/srv/simandev"
BRANCH="main"
COMPOSE_FILE="deploy/docker-compose.yml"
LOCAL_OVERRIDE="deploy/docker-compose.local.yml"
HEALTH_TIMEOUT=180

log() { echo "==> $*"; }
fail() {
  echo "ERROR: $*" >&2
  echo "--- docker compose ps ---" >&2
  ssh "${SSH_HOST}" "cd ${REMOTE_DIR} && docker compose -f ${COMPOSE_FILE} ps" 2>&1 || true
  echo "--- backend logs (last 40 lines) ---" >&2
  ssh "${SSH_HOST}" "cd ${REMOTE_DIR} && docker compose -f ${COMPOSE_FILE} logs --tail=40 backend" 2>&1 || true
  echo "--- caddy logs (last 40 lines) ---" >&2
  ssh "${SSH_HOST}" "cd ${REMOTE_DIR} && docker compose -f ${COMPOSE_FILE} logs --tail=40 caddy" 2>&1 || true
  exit 1
}

log "Deploying to ${SSH_HOST}:${REMOTE_DIR}"

# Read domain from remote .env (never print secret values)
DOMAIN="$(ssh "${SSH_HOST}" "grep -E '^STAGING_DOMAIN=' ${REMOTE_DIR}/deploy/.env 2>/dev/null | cut -d= -f2- | tr -d '\"'" || true)"
DOMAIN="$(echo "${DOMAIN}" | xargs)"

USE_HTTP_ONLY=0
if [ -z "${DOMAIN}" ] || [[ "${DOMAIN}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  log "No valid domain in STAGING_DOMAIN (empty or IP) — using HTTP-only compose override on :8080"
  USE_HTTP_ONLY=1
fi

log "Pulling latest code (branch ${BRANCH})"
ssh "${SSH_HOST}" "bash -s" <<REMOTE
set -euo pipefail
cd "${REMOTE_DIR}"
git fetch origin
git checkout "${BRANCH}"
git pull --ff-only origin "${BRANCH}"
REMOTE

log "Building and starting containers"
if [ "${USE_HTTP_ONLY}" -eq 1 ]; then
  ssh "${SSH_HOST}" "cd ${REMOTE_DIR} && docker compose -f ${COMPOSE_FILE} -f ${LOCAL_OVERRIDE} build && docker compose -f ${COMPOSE_FILE} -f ${LOCAL_OVERRIDE} up -d"
  COMPOSE_CMD="docker compose -f ${COMPOSE_FILE} -f ${LOCAL_OVERRIDE}"
  SMOKE_BASE="http://127.0.0.1:8080"
else
  ssh "${SSH_HOST}" "cd ${REMOTE_DIR} && docker compose -f ${COMPOSE_FILE} build && docker compose -f ${COMPOSE_FILE} up -d"
  COMPOSE_CMD="docker compose -f ${COMPOSE_FILE}"
  SMOKE_BASE="https://${DOMAIN}"
fi

log "Waiting for services to start (up to ${HEALTH_TIMEOUT}s)"
elapsed=0
while [ "${elapsed}" -lt "${HEALTH_TIMEOUT}" ]; do
  ps_out="$(ssh "${SSH_HOST}" "cd ${REMOTE_DIR} && ${COMPOSE_CMD} ps" 2>/dev/null || true)"
  if echo "${ps_out}" | grep -qi unhealthy; then
    echo "${ps_out}"
    fail "One or more containers are unhealthy"
  fi
  if echo "${ps_out}" | grep -qiE 'starting|health: starting'; then
    sleep 5
    elapsed=$((elapsed + 5))
    continue
  fi
  # All containers up and none unhealthy/starting
  if echo "${ps_out}" | grep -qiE 'Up|running'; then
    break
  fi
  sleep 5
  elapsed=$((elapsed + 5))
done

if [ "${elapsed}" -ge "${HEALTH_TIMEOUT}" ]; then
  fail "Healthchecks did not pass within ${HEALTH_TIMEOUT}s"
fi

log "Smoke-check: ${SMOKE_BASE}/api/health"
health_body="$(ssh "${SSH_HOST}" "curl -sf --max-time 15 '${SMOKE_BASE}/api/health'" || true)"
if [ -z "${health_body}" ]; then
  fail "GET ${SMOKE_BASE}/api/health failed"
fi
echo "    ${health_body}"

log "Smoke-check: ${SMOKE_BASE}/"
home_code="$(ssh "${SSH_HOST}" "curl -so /dev/null -w '%{http_code}' --max-time 15 '${SMOKE_BASE}/'" || echo "000")"
if [ "${home_code}" != "200" ]; then
  fail "GET ${SMOKE_BASE}/ returned HTTP ${home_code}"
fi
echo "    HTTP ${home_code}"

log "Container status"
ssh "${SSH_HOST}" "cd ${REMOTE_DIR} && ${COMPOSE_CMD} ps"

echo ""
echo "=============================================="
echo "  Deploy successful."
if [ "${USE_HTTP_ONLY}" -eq 1 ]; then
  SERVER_IP="$(ssh "${SSH_HOST}" "curl -sf ifconfig.me 2>/dev/null || hostname -I | awk '{print \$1}'" || true)"
  echo "  Site (HTTP): http://${SERVER_IP}:8080"
  echo "  Buy a domain and set STAGING_DOMAIN in .env for HTTPS."
else
  echo "  Site: https://${DOMAIN}"
fi
echo "=============================================="
