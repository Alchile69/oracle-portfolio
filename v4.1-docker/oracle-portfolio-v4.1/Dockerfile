# Multi-stage build pour optimiser la taille de l'image
FROM node:20-alpine AS base

# Installer les dépendances système
RUN apk add --no-cache \
    postgresql-client \
    curl \
    && rm -rf /var/cache/apk/*

# Stage de build pour les dépendances
FROM base AS deps
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/backend/package*.json ./packages/backend/
COPY packages/frontend/package*.json ./packages/frontend/

# Installer les dépendances
RUN npm ci --only=production

# Stage de build pour le backend
FROM base AS backend-builder
WORKDIR /app

# Copier les dépendances
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/packages/backend/node_modules ./packages/backend/node_modules

# Copier le code source
COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend

# Build du backend
RUN cd packages/shared && npm run build
RUN cd packages/backend && npm run build

# Stage de build pour le frontend
FROM base AS frontend-builder
WORKDIR /app

# Copier les dépendances
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/packages/frontend/node_modules ./packages/frontend/node_modules

# Copier le code source
COPY packages/shared ./packages/shared
COPY packages/frontend ./packages/frontend

# Build du frontend
RUN cd packages/shared && npm run build
RUN cd packages/frontend && npm run build

# Stage de production
FROM base AS production
WORKDIR /app

# Créer l'utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copier les builds
COPY --from=backend-builder --chown=nextjs:nodejs /app/packages/backend/dist ./packages/backend/dist
COPY --from=frontend-builder --chown=nextjs:nodejs /app/packages/frontend/.next ./packages/frontend/.next
COPY --from=frontend-builder --chown=nextjs:nodejs /app/packages/frontend/public ./packages/frontend/public

# Copier les dépendances de production
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nextjs:nodejs /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps --chown=nextjs:nodejs /app/packages/backend/node_modules ./packages/backend/node_modules
COPY --from=deps --chown=nextjs:nodejs /app/packages/frontend/node_modules ./packages/frontend/node_modules

# Copier les fichiers de configuration
COPY --chown=nextjs:nodejs package*.json ./
COPY --chown=nextjs:nodejs packages/shared/package*.json ./packages/shared/
COPY --chown=nextjs:nodejs packages/backend/package*.json ./packages/backend/
COPY --chown=nextjs:nodejs packages/frontend/package*.json ./packages/frontend/

# Copier les scripts
COPY --chown=nextjs:nodejs scripts ./scripts

# Créer les répertoires nécessaires
RUN mkdir -p logs data && chown -R nextjs:nodejs logs data

# Exposer les ports
EXPOSE 3000 3001

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3001
ENV FRONTEND_PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Utilisateur non-root
USER nextjs

# Script de démarrage
COPY --chown=nextjs:nodejs docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"] 