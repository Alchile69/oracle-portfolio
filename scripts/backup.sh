#!/bin/bash

# Oracle Portfolio - Script de Backup Automatisé
# Usage: ./scripts/backup.sh [type] [destination]

set -e

# Configuration
BACKUP_TYPES=("full" "configs" "data" "code" "incremental")
BACKUP_TYPE=${1:-full}
DESTINATION=${2:-./backup}
TIMESTAMP=$(date +'%Y%m%d_%H%M%S')
BACKUP_NAME="oracle-portfolio-backup-${BACKUP_TYPE}-${TIMESTAMP}"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Fonctions utilitaires
log() { echo -e "${BLUE}[BACKUP]${NC} $1"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; exit 1; }
info() { echo -e "${PURPLE}ℹ️  $1${NC}"; }

# Validation des paramètres
if [[ ! " ${BACKUP_TYPES[@]} " =~ " ${BACKUP_TYPE} " ]]; then
    error "Type de backup invalide: $BACKUP_TYPE. Utilisez: ${BACKUP_TYPES[*]}"
fi

log "🗄️  Démarrage du backup Oracle Portfolio"
info "Type: $BACKUP_TYPE"
info "Destination: $DESTINATION"
info "Timestamp: $TIMESTAMP"

# Création du répertoire de backup
mkdir -p "$DESTINATION/$BACKUP_NAME"
BACKUP_DIR="$DESTINATION/$BACKUP_NAME"

# Fonction de backup des configurations
backup_configs() {
    log "📋 Backup des configurations..."
    
    # Configurations Firebase
    cp .firebaserc* "$BACKUP_DIR/" 2>/dev/null || true
    cp firebase*.json "$BACKUP_DIR/" 2>/dev/null || true
    
    # Configurations de projet
    cp package.json "$BACKUP_DIR/"
    cp package-lock.json "$BACKUP_DIR/" 2>/dev/null || true
    cp pnpm-lock.yaml "$BACKUP_DIR/" 2>/dev/null || true
    cp vite.config.js "$BACKUP_DIR/"
    cp vitest.config.js "$BACKUP_DIR/" 2>/dev/null || true
    cp eslint.config.js "$BACKUP_DIR/" 2>/dev/null || true
    cp components.json "$BACKUP_DIR/" 2>/dev/null || true
    cp jsconfig.json "$BACKUP_DIR/" 2>/dev/null || true
    cp environments.config.js "$BACKUP_DIR/" 2>/dev/null || true
    
    # Configurations Git
    cp .gitignore "$BACKUP_DIR/" 2>/dev/null || true
    
    success "Configurations sauvegardées"
}

# Fonction de backup des données
backup_data() {
    log "💾 Backup des données..."
    
    # Données de l'application
    if [ -d "src/data" ]; then
        cp -r src/data "$BACKUP_DIR/"
    fi
    
    # Fichiers de configuration d'environnement
    if [ -f ".env" ]; then
        cp .env "$BACKUP_DIR/"
    fi
    if [ -f ".env.local" ]; then
        cp .env.local "$BACKUP_DIR/"
    fi
    
    # Logs et fichiers temporaires importants
    if [ -f "dev.log" ]; then
        cp dev.log "$BACKUP_DIR/"
    fi
    
    success "Données sauvegardées"
}

# Fonction de backup du code source
backup_code() {
    log "💻 Backup du code source..."
    
    # Code source principal
    cp -r src "$BACKUP_DIR/"
    cp -r public "$BACKUP_DIR/" 2>/dev/null || true
    cp index.html "$BACKUP_DIR/" 2>/dev/null || true
    
    # Scripts personnalisés
    if [ -d "scripts" ]; then
        cp -r scripts "$BACKUP_DIR/"
    fi
    
    # Workflows GitHub Actions
    if [ -d ".github" ]; then
        cp -r .github "$BACKUP_DIR/"
    fi
    
    success "Code source sauvegardé"
}

# Fonction de backup de la documentation
backup_docs() {
    log "📚 Backup de la documentation..."
    
    # Documentation principale
    cp README.md "$BACKUP_DIR/" 2>/dev/null || true
    cp CHANGELOG.md "$BACKUP_DIR/" 2>/dev/null || true
    cp TODO.md "$BACKUP_DIR/" 2>/dev/null || true
    cp BUGS.md "$BACKUP_DIR/" 2>/dev/null || true
    cp ENVIRONMENTS.md "$BACKUP_DIR/" 2>/dev/null || true
    
    # Tests et documentation des tests
    if [ -d "src/tests" ]; then
        mkdir -p "$BACKUP_DIR/tests"
        cp -r src/tests "$BACKUP_DIR/"
    fi
    
    success "Documentation sauvegardée"
}

# Fonction de backup Git
backup_git() {
    log "🔄 Backup des informations Git..."
    
    # Informations sur les branches
    git branch -a > "$BACKUP_DIR/git-branches.txt" 2>/dev/null || true
    git log --oneline -20 > "$BACKUP_DIR/git-log.txt" 2>/dev/null || true
    git status > "$BACKUP_DIR/git-status.txt" 2>/dev/null || true
    git remote -v > "$BACKUP_DIR/git-remotes.txt" 2>/dev/null || true
    
    # Hash du commit actuel
    git rev-parse HEAD > "$BACKUP_DIR/git-commit-hash.txt" 2>/dev/null || true
    
    success "Informations Git sauvegardées"
}

# Fonction de backup des builds
backup_builds() {
    log "🏗️  Backup des builds..."
    
    if [ -d "dist" ]; then
        cp -r dist "$BACKUP_DIR/"
        success "Build dist/ sauvegardé"
    else
        warning "Aucun build trouvé (dist/)"
    fi
}

# Fonction de génération du manifeste
generate_manifest() {
    log "📄 Génération du manifeste de backup..."
    
    cat > "$BACKUP_DIR/BACKUP_MANIFEST.md" << EOF
# Oracle Portfolio - Manifeste de Backup

## Informations Générales
- **Date de création** : $(date)
- **Type de backup** : $BACKUP_TYPE
- **Version** : $(grep '"version"' package.json | cut -d'"' -f4 2>/dev/null || echo "Unknown")
- **Commit** : $(git rev-parse HEAD 2>/dev/null || echo "Unknown")
- **Branche** : $(git branch --show-current 2>/dev/null || echo "Unknown")

## Contenu du Backup
$(ls -la "$BACKUP_DIR" | tail -n +2)

## Environnements
- **Production** : oracle-portfolio-prod.web.app
- **Staging** : oracle-portfolio-staging.web.app
- **Development** : oracle-portfolio-dev.web.app

## Instructions de Restauration
1. Extraire le backup dans un nouveau répertoire
2. Installer les dépendances : \`npm ci --legacy-peer-deps\`
3. Configurer les environnements selon ENVIRONMENTS.md
4. Restaurer les configurations Firebase
5. Tester avec : \`npm test\`
6. Déployer avec : \`./scripts/deploy.sh [environment]\`

## Vérification d'Intégrité
- **Taille totale** : $(du -sh "$BACKUP_DIR" | cut -f1)
- **Nombre de fichiers** : $(find "$BACKUP_DIR" -type f | wc -l)
- **Checksum** : $(find "$BACKUP_DIR" -type f -exec md5sum {} \; | md5sum | cut -d' ' -f1)

---
*Backup généré automatiquement par Oracle Portfolio Backup System*
EOF
    
    success "Manifeste généré"
}

# Fonction de compression
compress_backup() {
    log "🗜️  Compression du backup..."
    
    cd "$DESTINATION" 2>/dev/null || true
    tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
    
    if [ $? -eq 0 ]; then
        rm -rf "$BACKUP_NAME"
        success "Backup compressé : ${BACKUP_NAME}.tar.gz"
        info "Taille : $(du -sh "${BACKUP_NAME}.tar.gz" | cut -f1)"
    else
        error "Échec de la compression"
    fi
}

# Exécution selon le type de backup
case $BACKUP_TYPE in
    "full")
        backup_configs
        backup_data
        backup_code
        backup_docs
        backup_git
        backup_builds
        ;;
    "configs")
        backup_configs
        ;;
    "data")
        backup_data
        ;;
    "code")
        backup_code
        backup_git
        ;;
    "incremental")
        # Backup incrémental basé sur les changements Git
        if git diff --quiet; then
            warning "Aucun changement détecté pour le backup incrémental"
            exit 0
        fi
        backup_configs
        backup_code
        backup_git
        ;;
esac

# Génération du manifeste et compression
generate_manifest
compress_backup

# Nettoyage des anciens backups (garde les 10 plus récents)
log "🧹 Nettoyage des anciens backups..."
cd "$DESTINATION" 2>/dev/null || true
ls -t oracle-portfolio-backup-*.tar.gz 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true

# Rapport final
success "🎉 Backup terminé avec succès !"
info "📁 Fichier : $DESTINATION/${BACKUP_NAME}.tar.gz"
info "📊 Taille : $(du -sh "$DESTINATION/${BACKUP_NAME}.tar.gz" | cut -f1)"
info "🔍 Vérification : md5sum $DESTINATION/${BACKUP_NAME}.tar.gz"

log "📋 Pour restaurer ce backup :"
echo "   tar -xzf $DESTINATION/${BACKUP_NAME}.tar.gz"
echo "   cd ${BACKUP_NAME}"
echo "   cat BACKUP_MANIFEST.md"

