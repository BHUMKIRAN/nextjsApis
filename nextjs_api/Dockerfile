FROM node:20-alpine AS base
WORKDIR /app

# Alpine compatibility for some native deps (and Next's tooling in some setups)
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD [ "npm","run","build" ]

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force


EXPOSE 3000
USER node
CMD ["npm","run","start","--","-p","3000","-H","0.0.0.0"]

