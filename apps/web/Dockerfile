FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy workspace files first
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./

# Copy full repo
COPY . .

ENV CI=true

# Install dependencies (monorepo aware)
RUN pnpm install --frozen-lockfile

# Build ONLY frontend
RUN pnpm --filter web build

# Install a static server
RUN npm install -g serve

EXPOSE 5173

# Serve built Vite app
CMD ["serve", "-s", "apps/web/dist", "-l", "5173"]