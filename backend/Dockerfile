# syntax=docker/dockerfile:1

FROM php:8.4-cli-bookworm

# pdo_pgsql drives Postgres. redis is required because REDIS_CLIENT=phpredis;
# predis is not a dependency. The rest are the usual Laravel expectations, with
# gd included because invoices are going to need image rendering.
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/install-php-extensions
RUN chmod +x /usr/local/bin/install-php-extensions \
    && install-php-extensions \
        bcmath \
        gd \
        intl \
        opcache \
        pdo_pgsql \
        redis \
        zip

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# `php artisan dev` runs `npm run dev` to start Vite, so this image needs Node.
# node:24-bookworm-slim shares Debian bookworm with the PHP base, so the
# binaries are glibc compatible.
COPY --from=node:24-bookworm-slim /usr/local/bin/node /usr/local/bin/node
COPY --from=node:24-bookworm-slim /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

# Keep Composer out of /root so the bind-mounted project stays clean, and cache
# downloads in a volume so lockfile changes reinstall quickly.
ENV COMPOSER_HOME=/tmp/.composer \
    COMPOSER_CACHE_DIR=/composer-cache

WORKDIR /var/www/html

# The application itself is bind-mounted at runtime, never copied in: composer
# install and npm ci both run on first boot, into the volumes above.
COPY docker/entrypoint.sh ./docker/entrypoint.sh
RUN chmod +x docker/entrypoint.sh

ENTRYPOINT ["./docker/entrypoint.sh"]
CMD ["php", "artisan", "dev", "--inline"]