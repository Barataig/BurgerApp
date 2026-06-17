FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

FROM node:18-alpine AS final
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY src ./src
COPY package*.json ./

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3002/health || exit 1

CMD ["node", "src/infra/server.js"]
