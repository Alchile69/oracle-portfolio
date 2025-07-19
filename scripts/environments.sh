#!/bin/bash

# Oracle Portfolio - Gestionnaire d'environnements
# Usage: ./scripts/environments.sh [command] [environment]

set -e

# Configuration
ENVIRONMENTS=("development" "staging" "production")
COMMAND=${1:-help}
ENVIRONMENT=${2:-development}

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Fonctions utilitaires
log() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Fonction d'aide
show_help() {
    echo -e "${PURPLE}Oracle Portfolio - Gestionnaire d'environnements${NC}"
    echo ""
    echo "Usage: ./scripts/environments.sh [command] [environment]"
    echo ""
    echo "Commands:"
    echo "  status     - Afficher le statut de tous les environnements"
    echo "  switch     - Basculer vers un environnement spécifique"
    echo "  deploy     - Déployer vers un environnement"
    echo "  test       - Tester un environnement"
    echo "  logs       - Afficher les logs d'un environnement"
    echo "  rollback   - Revenir à la version précédente"
    echo "  help       - Afficher cette aide"
    echo ""
    echo "Environments: ${ENVIRONMENTS[*]}"
    echo ""
    echo "Examples:"
    echo "  ./scripts/environments.sh status"
    echo "  ./scripts/environments.sh switch staging"
    echo "  ./scripts/environments.sh deploy production"
    echo "  ./scripts/environments.sh test development"
}

# Fonction de statut
show_status() {
    log "📊 Statut des environnements Oracle Portfolio"
    echo ""
    
    # Production
    echo -e "${GREEN}🏭 Production${NC}"
    echo "   Branch: restore/elegant-full-version"
    echo "   URL: https://oracle-portfolio-prod.web.app"
    echo "   Status: $(curl -s -o /dev/null -w "%{http_code}" https://oracle-portfolio-prod.web.app || echo "Unknown")"
    echo ""
    
    # Staging
    echo -e "${YELLOW}🧪 Staging${NC}"
    echo "   Branch: environments/staging"
    echo "   URL: https://oracle-portfolio-staging.web.app"
    echo "   Status: $(curl -s -o /dev/null -w "%{http_code}" https://oracle-portfolio-staging.web.app 2>/dev/null || echo "Not deployed")"
    echo ""
    
    # Development
    echo -e "${BLUE}🛠️  Development${NC}"
    echo "   Branch: environments/development"
    echo "   URL: https://oracle-portfolio-dev.web.app"
    echo "   Status: $(curl -s -o /dev/null -w "%{http_code}" https://oracle-portfolio-dev.web.app 2>/dev/null || echo "Not deployed")"
    echo ""
    
    # Local
    echo -e "${PURPLE}💻 Local${NC}"
    echo "   URL: http://localhost:5173"
    echo "   Status: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 2>/dev/null || echo "Not running")"
}

# Fonction de basculement
switch_environment() {
    if [[ ! " ${ENVIRONMENTS[@]} " =~ " ${ENVIRONMENT} " ]]; then
        error "Environnement invalide: $ENVIRONMENT"
    fi
    
    log "🔄 Basculement vers l'environnement: $ENVIRONMENT"
    
    case $ENVIRONMENT in
        "development")
            git checkout environments/development
            cp .firebaserc.development .firebaserc
            ;;
        "staging")
            git checkout environments/staging
            cp .firebaserc.staging .firebaserc
            ;;
        "production")
            git checkout restore/elegant-full-version
            # .firebaserc par défaut pour production
            ;;
    esac
    
    success "✅ Basculé vers $ENVIRONMENT"
    log "📋 Branche actuelle: $(git branch --show-current)"
}

# Fonction de test
test_environment() {
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
        *)
            error "Environnement invalide: $ENVIRONMENT"
            ;;
    esac
    
    log "🧪 Test de l'environnement: $ENVIRONMENT"
    log "🌐 URL: $URL"
    
    # Test de connectivité
    if curl -f -s $URL > /dev/null; then
        success "✅ Environnement accessible"
    else
        error "❌ Environnement inaccessible"
    fi
    
    # Test des fonctionnalités critiques
    log "🔍 Test des fonctionnalités critiques..."
    
    # Vérification du titre de la page
    TITLE=$(curl -s $URL | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g' || echo "")
    if [[ $TITLE == *"Oracle Portfolio"* ]]; then
        success "✅ Titre de la page correct"
    else
        warning "⚠️  Titre de la page non détecté"
    fi
    
    success "🎉 Tests terminés pour $ENVIRONMENT"
}

# Fonction de logs
show_logs() {
    log "📋 Logs pour l'environnement: $ENVIRONMENT"
    
    case $ENVIRONMENT in
        "development"|"staging"|"production")
            log "🔍 Vérification des logs Firebase..."
            firebase functions:log --limit 50 2>/dev/null || warning "Logs Firebase non disponibles"
            ;;
        *)
            error "Environnement invalide: $ENVIRONMENT"
            ;;
    esac
}

# Fonction de rollback
rollback_environment() {
    log "🔄 Rollback de l'environnement: $ENVIRONMENT"
    warning "⚠️  Cette opération va restaurer la version précédente"
    
    read -p "Êtes-vous sûr de vouloir continuer? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Rollback annulé"
        exit 0
    fi
    
    # Logique de rollback (à implémenter selon les besoins)
    warning "🚧 Fonctionnalité de rollback en cours de développement"
}

# Traitement des commandes
case $COMMAND in
    "status")
        show_status
        ;;
    "switch")
        switch_environment
        ;;
    "deploy")
        ./scripts/deploy.sh $ENVIRONMENT
        ;;
    "test")
        test_environment
        ;;
    "logs")
        show_logs
        ;;
    "rollback")
        rollback_environment
        ;;
    "help"|*)
        show_help
        ;;
esac
