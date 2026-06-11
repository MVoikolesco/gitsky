FROM node:24-alpine

WORKDIR /workspace

RUN corepack enable pnpm

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/app/package.json ./packages/app/package.json
COPY packages/api/package.json ./packages/api/package.json

RUN pnpm install

COPY . .

CMD ["pnpm", "dev"]
