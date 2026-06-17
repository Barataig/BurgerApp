# ================================================
# Dockerfile — order-service
# Multi-stage: separa dependências de dev das de prod
# ================================================

FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

FROM node:18-alpine AS final
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY src ./src
COPY package*.json ./

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "src/infra/server.js"]
