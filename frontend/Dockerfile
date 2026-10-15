
FROM node:22-alpine AS builder

WORKDIR /app

ENV CI=true

RUN npm install -g pnpm@11.1.1 \
    --fetch-retries=5 \
    --fetch-timeout=300000

COPY frontend/package.json frontend/pnpm-lock.yaml ./

RUN pnpm config set fetch-timeout 120000 \
    && pnpm config set fetch-retries 5 \
    && pnpm install --frozen-lockfile

COPY frontend/ .

RUN pnpm build

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
