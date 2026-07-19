FROM node:22-alpine

WORKDIR /app

ENV CI=true

# Install pnpm
RUN npm install -g pnpm@11.1.1

# Copy pnpm files first (better caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm config set fetch-timeout 120000
RUN pnpm config set fetch-retries 5

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

EXPOSE 5000

CMD ["pnpm", "dev"]