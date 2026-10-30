# syntax=docker/dockerfile:1

FROM node:22-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"

RUN corepack enable && corepack prepare pnpm@latest --activate

ARG VITE_GRAPHQL_ENDPOINT
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_ELEVENLABS_API_KEY
ARG VITE_ELEVENLABS_VOICE_ID
ARG VITE_ELENVENLABS_MODEL_ID
ARG VITE_ELEVENLABS_OUTPUT_FORMAT
ARG VITE_ELENVENLABS_ENABLE_TIMESTAMPS
ARG VITE_EDGETTS_VOICE_ID

ENV VITE_GRAPHQL_ENDPOINT=$VITE_GRAPHQL_ENDPOINT
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_ELEVENLABS_API_KEY=$VITE_ELEVENLABS_API_KEY
ENV VITE_ELEVENLABS_VOICE_ID=$VITE_ELEVENLABS_VOICE_ID
ENV VITE_ELENVENLABS_MODEL_ID=$VITE_ELENVENLABS_MODEL_ID
ENV VITE_ELEVENLABS_OUTPUT_FORMAT=$VITE_ELEVENLABS_OUTPUT_FORMAT
ENV VITE_ELENVENLABS_ENABLE_TIMESTAMPS=$VITE_ELENVENLABS_ENABLE_TIMESTAMPS
ENV VITE_EDGETTS_VOICE_ID=$VITE_EDGETTS_VOICE_ID

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm install --frozen-lockfile --ignore-scripts

COPY . .
RUN pnpm codegen && pnpm build

FROM node:22-slim AS production

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
ENV NODE_ENV=production

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=builder --chown=node:node /app/dist ./dist

USER node

EXPOSE 3000

CMD ["pnpx", "srvx", "--prod", "-s", "../client", "dist/server/server.js"]
