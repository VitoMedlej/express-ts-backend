# ── 1) Build stage ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci                     # install all deps
COPY . .                       # copy source
RUN npm run build              # tsup → dist/

# ── 2) Runtime stage ───────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev          # only prod deps
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
