FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@11.1.1

# Copy pnpm files
COPY package.json pnpm-lock.yaml ./

RUN pnpm config set fetch-timeout 120000
RUN pnpm config set fetch-retries 5

# Install dependencies
RUN pnpm install --frozen-lockfile 

# Copy source
COPY . .

# Vite default port
EXPOSE 5173

# Start Vite dev server
CMD ["pnpm", "dev", "--host", "0.0.0.0"]