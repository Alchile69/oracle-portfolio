#!/bin/bash

# Oracle Portfolio - Script de déploiement multi-environnements
# Usage: ./scripts/deploy.sh [environment]

set -e

# Configuration
ENVIRONMENTS=("development" "staging" "production")
ENVIRONMENT=${1:-development}

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Validation de l'environnement
if [[ ! " ${ENVIRONMENTS[@]} " =~ " ${ENVIRONMENT} " ]]; then
    error "Environnement invalide: $ENVIRONMENT. Utilisez: ${ENVIRONMENTS[*]}"
fi

log "🚀 Déploiement Oracle Portfolio vers: $ENVIRONMENT"

# Vérification des prérequis
log "Vérification des prérequis..."
command -v node >/dev/null 2>&1 || error "Node.js n'est pas installé"
command -v npm >/dev/null 2>&1 || error "npm n'est pas installé"
command -v firebase >/dev/null 2>&1 || error "Firebase CLI n'est pas installé"

# Installation des dépendances
log "Installation des dépendances..."
npm ci --legacy-peer-deps

# Exécution des tests
if [ "$ENVIRONMENT" = "production" ]; then
    log "Exécution de la suite de tests complète..."
    npm test -- --run || error "Les tests ont échoué"
    npm run lint || error "Le linting a échoué"
else
    log "Exécution des tests de base..."
    npm test src/tests/BasicComponents.test.jsx -- --run || warning "Certains tests ont échoué"
fi

# Configuration de l'environnement
case $ENVIRONMENT in
    "development")
        export VITE_ENVIRONMENT=development
        export VITE_API_BASE_URL=https://api.oracle-portfolio-dev.web.app
        export VITE_ENABLE_DEBUGGING=true
        export VITE_TEST_MODE=true
        FIREBASE_CONFIG="firebase.development.json"
        FIREBASE_PROJECT="oracle-portfolio-dev"
        FIREBASE_TARGET="development"
        ;;
    "staging")
        export VITE_ENVIRONMENT=staging
        export VITE_API_BASE_URL=https://api.oracle-portfolio-staging.web.app
        export VITE_ENABLE_DEBUGGING=true
        export VITE_TEST_MODE=true
        FIREBASE_CONFIG="firebase.staging.json"
        FIREBASE_PROJECT="oracle-portfolio-staging"
        FIREBASE_TARGET="staging"
        ;;
    "production")
        export VITE_ENVIRONMENT=production
        export VITE_API_BASE_URL=https://api.oracle-portfolio-prod.web.app
        export VITE_ENABLE_DEBUGGING=false
        export VITE_TEST_MODE=false
        FIREBASE_CONFIG="firebase.json"
        FIREBASE_PROJECT="oracle-portfolio-prod"
        FIREBASE_TARGET=""
        ;;
esac

# Build de l'application
log "Build de l'application pour $ENVIRONMENT..."
npm run build

# Configuration Firebase
log "Configuration Firebase pour $ENVIRONMENT..."
firebase use $FIREBASE_PROJECT

# Déploiement
log "Déploiement vers Firebase Hosting..."
if [ -n "$FIREBASE_TARGET" ]; then
    firebase deploy --only hosting:$FIREBASE_TARGET --config $FIREBASE_CONFIG
else
    firebase deploy --only hosting --config $FIREBASE_CONFIG
fi

# Vérification du déploiement
case $ENVIRONMENT in
    "development")
        URL="https://oracle-portfolio-dev.web.app"
        ;;
    "staging")
        URL="https://oracle-portfolio-staging.web.app"
        ;;
    "production")
        URL="https://oracle-portfolio-prod.web.app"
        ;;
esac

log "Vérification du déploiement..."
sleep 5
if curl -f -s $URL > /dev/null; then
    success "Déploiement réussi!"
    success "🌐 URL: $URL"
    success "📊 Oracle Portfolio v2.5.0 est en ligne!"
else
    error "Échec de la vérification du déploiement"
fi

log "🎉 Déploiement terminé avec succès!"
