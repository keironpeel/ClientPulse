# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# The application is bind-mounted at runtime; npm ci runs on first boot into the
# node_modules volume above.
COPY docker/entrypoint.sh ./docker/entrypoint.sh
RUN chmod +x docker/entrypoint.sh

ENTRYPOINT ["./docker/entrypoint.sh"]
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]