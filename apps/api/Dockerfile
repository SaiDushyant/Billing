FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY . .

ENV CI=true

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @erp/api build

EXPOSE 4000

CMD ["pnpm", "--filter", "@erp/api", "start"]