#!/usr/bin/env bash
#
# Boot script for the backend development container.
#
# Installs dependencies when they are missing or a lockfile has changed,
# prepares the environment, then hands off to the container command. Every step
# is idempotent so `docker compose restart` stays fast.

set -euo pipefail

cd /var/www/html

log() {
    printf '\033[33m[entrypoint]\033[0m %s\n' "$*"
}

# Runs a command only when the source file's checksum differs from the one
# recorded in a stamp file. The stamp lives inside the dependency volume, so it
# survives restarts but is discarded along with the dependencies it describes.
stamp_guard() {
    local stamp="$1" source="$2"
    shift 2

    local current=''
    if [ -f "$source" ]; then
        current="$(md5sum "$source" | cut -d' ' -f1)"
    fi

    if [ -n "$current" ] && [ -f "$stamp" ] && [ "$(cat "$stamp")" = "$current" ]; then
        return
    fi

    log 'installing dependencies'
    "$@"
    printf '%s' "$current" > "$stamp"
}

wait_for_database() {
    local attempts="${DB_WAIT_ATTEMPTS:-60}" attempt=1

    log "waiting for postgres at ${DB_HOST}:${DB_PORT:-5432}"

    until php -r '$pdo = new PDO(sprintf("pgsql:host=%s;port=%s;dbname=%s", getenv("DB_HOST"), getenv("DB_PORT") ?: "5432", getenv("DB_DATABASE")), getenv("DB_USERNAME"), getenv("DB_PASSWORD"));' 2>/dev/null; do
        if [ "$attempt" -ge "$attempts" ]; then
            log 'database never became available'
            exit 1
        fi

        attempt=$((attempt + 1))
        sleep 1
    done

    log 'database is ready'
}

# The app key lives in .env.docker on the bind mount rather than in the image or
# a volume, so it is stable per machine and survives `docker compose down -v`.
prepare_app_key() {
    if [ -f .env.docker ]; then
        set -a
        # shellcheck disable=SC1091
        . ./.env.docker
        set +a
    fi

    if [ -n "${APP_KEY:-}" ]; then
        return
    fi

    log 'generating an application key'
    printf 'APP_KEY=%s\n' "$(php artisan key:generate --force --no-interaction --show)" > .env.docker
    APP_KEY="$(cut -d= -f2- .env.docker)"
    export APP_KEY
}

stamp_guard vendor/.docker-stamp composer.lock \
    composer install --no-interaction --no-progress --prefer-dist

stamp_guard node_modules/.docker-stamp package-lock.json \
    npm ci --no-audit --no-fund

wait_for_database
prepare_app_key

php artisan config:clear --no-interaction
php artisan storage:link --no-interaction --force > /dev/null 2>&1 ||
    log 'could not create the public/storage symlink'
php artisan migrate --force --no-interaction

exec "$@"