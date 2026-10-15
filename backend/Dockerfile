FROM node:22-alpine AS builder

WORKDIR /app

ENV CI=true

RUN npm install -g pnpm@11.1.1 \
    --fetch-retries=5 \
    --fetch-timeout=300000

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm config set fetch-timeout 120000 \
    && pnpm config set fetch-retries 5 \
    && pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate
RUN pnpm build

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm@11.1.1

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm config set fetch-timeout 120000 \
    && pnpm config set fetch-retries 5 \
    && pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000

CMD ["pnpm", "start"]
