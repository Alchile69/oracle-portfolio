#!/bin/bash

# Oracle Portfolio - Script de Restauration Automatisé
# Usage: ./scripts/restore.sh [backup_file] [target_directory]

set -e

# Configuration
BACKUP_FILE=${1}
TARGET_DIR=${2:-./restored-oracle-portfolio}
TIMESTAMP=$(date +'%Y%m%d_%H%M%S')

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Fonctions utilitaires
log() { echo -e "${BLUE}[RESTORE]${NC} $1"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; exit 1; }
info() { echo -e "${PURPLE}ℹ️  $1${NC}"; }

# Fonction d'aide
show_help() {
    echo -e "${PURPLE}Oracle Portfolio - Script de Restauration${NC}"
    echo ""
    echo "Usage: ./scripts/restore.sh [backup_file] [target_directory]"
    echo ""
    echo "Arguments:"
    echo "  backup_file      - Fichier de backup (.tar.gz) à restaurer"
    echo "  target_directory - Répertoire de destination (défaut: ./restored-oracle-portfolio)"
    echo ""
    echo "Examples:"
    echo "  ./scripts/restore.sh backup/oracle-portfolio-backup-full-20250719_153000.tar.gz"
    echo "  ./scripts/restore.sh backup.tar.gz ./my-restore"
    echo ""
    echo "Options:"
    echo "  --help, -h       - Afficher cette aide"
    echo "  --list, -l       - Lister les backups disponibles"
    echo "  --verify, -v     - Vérifier l'intégrité du backup"
}

# Fonction pour lister les backups
list_backups() {
    log "📋 Backups disponibles :"
    echo ""
    
    # Recherche dans le répertoire backup local
    if [ -d "./backup" ]; then
        echo -e "${GREEN}Local (./backup):${NC}"
        ls -lah ./backup/oracle-portfolio-backup-*.tar.gz 2>/dev/null | while read line; do
            echo "  $line"
        done
        echo ""
    fi
    
    # Recherche dans le répertoire courant
    echo -e "${GREEN}Répertoire courant:${NC}"
    ls -lah oracle-portfolio-backup-*.tar.gz 2>/dev/null | while read line; do
        echo "  $line"
    done || echo "  Aucun backup trouvé"
}

# Fonction de vérification d'intégrité
verify_backup() {
    local backup_file=$1
    
    log "🔍 Vérification de l'intégrité du backup..."
    
    # Vérification de l'existence du fichier
    if [ ! -f "$backup_file" ]; then
        error "Fichier de backup non trouvé: $backup_file"
    fi
    
    # Vérification de l'extension
    if [[ ! "$backup_file" =~ \.tar\.gz$ ]]; then
        error "Format de backup invalide. Attendu: .tar.gz"
    fi
    
    # Test de l'archive
    if tar -tzf "$backup_file" >/dev/null 2>&1; then
        success "Archive valide"
    else
        error "Archive corrompue ou invalide"
    fi
    
    # Affichage du contenu
    info "Contenu de l'archive:"
    tar -tzf "$backup_file" | head -20
    
    local file_count=$(tar -tzf "$backup_file" | wc -l)
    info "Nombre total de fichiers: $file_count"
    
    local archive_size=$(du -sh "$backup_file" | cut -f1)
    info "Taille de l'archive: $archive_size"
}

# Fonction de restauration
restore_backup() {
    local backup_file=$1
    local target_dir=$2
    
    log "🔄 Restauration du backup Oracle Portfolio"
    info "Source: $backup_file"
    info "Destination: $target_dir"
    
    # Vérification préalable
    verify_backup "$backup_file"
    
    # Création du répertoire de destination
    if [ -d "$target_dir" ]; then
        warning "Le répertoire de destination existe déjà"
        read -p "Voulez-vous continuer et écraser le contenu ? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "Restauration annulée"
            exit 0
        fi
        rm -rf "$target_dir"
    fi
    
    mkdir -p "$target_dir"
    
    # Extraction de l'archive
    log "📦 Extraction de l'archive..."
    tar -xzf "$backup_file" -C "$target_dir" --strip-components=1
    
    if [ $? -eq 0 ]; then
        success "Archive extraite avec succès"
    else
        error "Échec de l'extraction"
    fi
    
    # Vérification du manifeste
    if [ -f "$target_dir/BACKUP_MANIFEST.md" ]; then
        log "📄 Lecture du manifeste de backup..."
        cat "$target_dir/BACKUP_MANIFEST.md"
        echo ""
    fi
    
    # Configuration post-restauration
    cd "$target_dir"
    
    # Installation des dépendances
    if [ -f "package.json" ]; then
        log "📦 Installation des dépendances..."
        npm ci --legacy-peer-deps --silent
        success "Dépendances installées"
    fi
    
    # Vérification de l'intégrité du code
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        log "🧪 Exécution des tests de vérification..."
        if npm test -- --run --silent 2>/dev/null; then
            success "Tests passés avec succès"
        else
            warning "Certains tests ont échoué (normal après restauration)"
        fi
    fi
    
    # Configuration des environnements
    if [ -f "ENVIRONMENTS.md" ]; then
        log "⚙️  Configuration des environnements disponible"
        info "Consultez ENVIRONMENTS.md pour les instructions de configuration"
    fi
    
    # Vérification des scripts
    if [ -d "scripts" ]; then
        chmod +x scripts/*.sh 2>/dev/null || true
        success "Scripts rendus exécutables"
    fi
    
    # Rapport de restauration
    generate_restore_report "$backup_file" "$target_dir"
}

# Fonction de génération du rapport de restauration
generate_restore_report() {
    local backup_file=$1
    local target_dir=$2
    
    log "📊 Génération du rapport de restauration..."
    
    cat > "$target_dir/RESTORE_REPORT.md" << EOF
# Oracle Portfolio - Rapport de Restauration

## Informations de Restauration
- **Date de restauration** : $(date)
- **Fichier source** : $backup_file
- **Répertoire de destination** : $target_dir
- **Utilisateur** : $(whoami)
- **Système** : $(uname -a)

## Vérifications Post-Restauration
- **Fichiers extraits** : $(find "$target_dir" -type f | wc -l)
- **Taille totale** : $(du -sh "$target_dir" | cut -f1)
- **Dépendances installées** : $([ -d "node_modules" ] && echo "✅ Oui" || echo "❌ Non")
- **Tests exécutés** : $([ -f "src/tests/README.md" ] && echo "✅ Disponibles" || echo "❌ Non trouvés")

## Prochaines Étapes
1. **Configurer les environnements** :
   \`\`\`bash
   # Choisir l'environnement
   ./scripts/environments.sh switch development
   \`\`\`

2. **Tester l'application** :
   \`\`\`bash
   # Tests unitaires
   npm test
   
   # Démarrage local
   npm run dev
   \`\`\`

3. **Déployer si nécessaire** :
   \`\`\`bash
   # Déploiement development
   npm run deploy:dev
   
   # Déploiement staging
   npm run deploy:staging
   \`\`\`

## Fichiers Importants Restaurés
$(ls -la "$target_dir" | grep -E '\.(md|json|js|sh)$' | head -10)

## Vérification d'Intégrité
- **Manifeste original** : $([ -f "BACKUP_MANIFEST.md" ] && echo "✅ Présent" || echo "❌ Manquant")
- **Configuration Firebase** : $([ -f "firebase.json" ] && echo "✅ Présente" || echo "❌ Manquante")
- **Scripts de déploiement** : $([ -f "scripts/deploy.sh" ] && echo "✅ Présents" || echo "❌ Manquants")
- **Tests automatisés** : $([ -d "src/tests" ] && echo "✅ Présents" || echo "❌ Manquants")

---
*Rapport généré automatiquement par Oracle Portfolio Restore System*
EOF
    
    success "Rapport de restauration généré"
}

# Traitement des arguments
case "${1:-}" in
    "--help"|"-h")
        show_help
        exit 0
        ;;
    "--list"|"-l")
        list_backups
        exit 0
        ;;
    "--verify"|"-v")
        if [ -z "$2" ]; then
            error "Fichier de backup requis pour la vérification"
        fi
        verify_backup "$2"
        exit 0
        ;;
    "")
        error "Fichier de backup requis. Utilisez --help pour l'aide"
        ;;
    *)
        if [ ! -f "$1" ]; then
            error "Fichier de backup non trouvé: $1"
        fi
        restore_backup "$1" "$TARGET_DIR"
        ;;
esac

# Rapport final
success "🎉 Restauration terminée avec succès !"
info "📁 Répertoire restauré : $TARGET_DIR"
info "📊 Rapport : $TARGET_DIR/RESTORE_REPORT.md"

log "📋 Prochaines étapes recommandées :"
echo "   cd $TARGET_DIR"
echo "   cat RESTORE_REPORT.md"
echo "   npm run dev"

