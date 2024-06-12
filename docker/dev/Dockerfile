# TODO: Refactor this production Dockerfile to be suitable for development.

# We use a preconfigured Bun + Node.js image.
# Bun version: 1.1.13
# Node.js version: 20.12.2

# Install dependencies
FROM imbios/bun-node:1.1.13-20.12.2-slim AS deps

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get -y update && \
  apt-get install -yq openssl git ca-certificates tzdata && \
  ln -fs /usr/share/zoneinfo/Asia/Makassar /etc/localtime && \
  dpkg-reconfigure -f noninteractive tzdata
WORKDIR /app

COPY package.json bun.lockb tsconfig.json ./
RUN bun install --frozen-lockfile

# Build the project
FROM deps AS builder

WORKDIR /app

COPY . .

# Run the project
FROM imbios/bun-node:1.1.13-20.12.2-slim AS runner

WORKDIR /app

COPY --from=deps /app/node_modules node_modules
COPY --from=builder /app/.env .env

ENV NODE_ENV=production

COPY --from=builder  /app/package.json .
COPY --from=builder  /app/tsconfig.json .
COPY --from=builder /app/src src

EXPOSE 3000

CMD [ "bun", "run", "start" ]
