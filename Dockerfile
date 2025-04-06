# ── 1) Build stage ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci                    
COPY . ./                 
RUN npm run build          

# ── 2) Runtime stage ───────────────────────────────────────────
FROM node:20-alpine
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci --omit=dev          # only prod deps
COPY --from=builder /src/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
