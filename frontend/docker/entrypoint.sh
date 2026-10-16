#!/usr/bin/env bash
#
# Boot script for the frontend development container. Installs dependencies when
# node_modules is missing or package-lock.json has changed, then hands off.

set -euo pipefail

cd /app

log() {
    printf '\033[33m[entrypoint]\033[0m %s\n' "$*"
}

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

stamp_guard node_modules/.docker-stamp package-lock.json \
    npm ci --no-audit --no-fund

exec "$@"