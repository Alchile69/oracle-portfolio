#!/bin/bash

# Oracle Portfolio - Planificateur de Backups Locaux
# Usage: ./scripts/backup-scheduler.sh [action]

set -e

# Configuration
CRON_USER=$(whoami)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backup"
LOG_FILE="$BACKUP_DIR/backup.log"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Fonctions utilitaires
log() { echo -e "${BLUE}[SCHEDULER]${NC} $1"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; exit 1; }
info() { echo -e "${PURPLE}ℹ️  $1${NC}"; }

# Fonction d'aide
show_help() {
    echo -e "${PURPLE}Oracle Portfolio - Planificateur de Backups${NC}"
    echo ""
    echo "Usage: ./scripts/backup-scheduler.sh [action]"
    echo ""
    echo "Actions:"
    echo "  install    - Installer les tâches cron de backup"
    echo "  uninstall  - Désinstaller les tâches cron"
    echo "  status     - Afficher le statut des backups planifiés"
    echo "  list       - Lister les backups existants"
    echo "  cleanup    - Nettoyer les anciens backups"
    echo "  test       - Tester un backup manuel"
    echo "  help       - Afficher cette aide"
    echo ""
    echo "Planification par défaut:"
    echo "  - Backup incrémental : Tous les jours à 2h00"
    echo "  - Backup complet : Tous les dimanches à 3h00"
    echo "  - Nettoyage : Tous les mois le 1er à 4h00"
}

# Fonction d'installation des tâches cron
install_cron() {
    log "📅 Installation des tâches cron de backup..."
    
    # Création du répertoire de backup
    mkdir -p "$BACKUP_DIR"
    
    # Création du fichier de log
    touch "$LOG_FILE"
    
    # Sauvegarde du crontab actuel
    crontab -l > /tmp/crontab_backup 2>/dev/null || true
    
    # Suppression des anciennes tâches Oracle Portfolio
    crontab -l 2>/dev/null | grep -v "Oracle Portfolio Backup" > /tmp/crontab_new || true
    
    # Ajout des nouvelles tâches
    cat >> /tmp/crontab_new << EOF

# Oracle Portfolio Backup - Backup incrémental quotidien
0 2 * * * cd "$PROJECT_DIR" && ./scripts/backup.sh incremental "$BACKUP_DIR" >> "$LOG_FILE" 2>&1

# Oracle Portfolio Backup - Backup complet hebdomadaire
0 3 * * 0 cd "$PROJECT_DIR" && ./scripts/backup.sh full "$BACKUP_DIR" >> "$LOG_FILE" 2>&1

# Oracle Portfolio Backup - Nettoyage mensuel
0 4 1 * * cd "$PROJECT_DIR" && ./scripts/backup-scheduler.sh cleanup >> "$LOG_FILE" 2>&1

EOF
    
    # Installation du nouveau crontab
    crontab /tmp/crontab_new
    
    # Nettoyage
    rm -f /tmp/crontab_new
    
    success "Tâches cron installées"
    info "Backup incrémental : Quotidien à 2h00"
    info "Backup complet : Hebdomadaire (dimanche) à 3h00"
    info "Nettoyage : Mensuel (1er du mois) à 4h00"
    info "Logs : $LOG_FILE"
}

# Fonction de désinstallation des tâches cron
uninstall_cron() {
    log "🗑️  Désinstallation des tâches cron de backup..."
    
    # Suppression des tâches Oracle Portfolio
    crontab -l 2>/dev/null | grep -v "Oracle Portfolio Backup" > /tmp/crontab_new || true
    crontab /tmp/crontab_new
    
    # Nettoyage
    rm -f /tmp/crontab_new
    
    success "Tâches cron désinstallées"
}

# Fonction de statut
show_status() {
    log "📊 Statut des backups planifiés"
    echo ""
    
    # Vérification des tâches cron
    echo -e "${GREEN}Tâches cron actives:${NC}"
    crontab -l 2>/dev/null | grep "Oracle Portfolio Backup" || echo "  Aucune tâche planifiée"
    echo ""
    
    # Statut du répertoire de backup
    if [ -d "$BACKUP_DIR" ]; then
        echo -e "${GREEN}Répertoire de backup: $BACKUP_DIR${NC}"
        echo "  Taille totale: $(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1 || echo "0")"
        echo "  Nombre de backups: $(ls "$BACKUP_DIR"/*.tar.gz 2>/dev/null | wc -l || echo "0")"
        echo ""
    else
        warning "Répertoire de backup non trouvé: $BACKUP_DIR"
        echo ""
    fi
    
    # Derniers logs
    if [ -f "$LOG_FILE" ]; then
        echo -e "${GREEN}Derniers logs de backup:${NC}"
        tail -10 "$LOG_FILE" 2>/dev/null || echo "  Aucun log disponible"
    else
        info "Fichier de log non trouvé: $LOG_FILE"
    fi
}

# Fonction de listage des backups
list_backups() {
    log "📋 Liste des backups disponibles"
    echo ""
    
    if [ -d "$BACKUP_DIR" ]; then
        echo -e "${GREEN}Backups locaux ($BACKUP_DIR):${NC}"
        ls -lah "$BACKUP_DIR"/*.tar.gz 2>/dev/null | while read line; do
            echo "  $line"
        done || echo "  Aucun backup trouvé"
    else
        warning "Répertoire de backup non trouvé"
    fi
    
    echo ""
    info "Pour restaurer un backup:"
    echo "  ./scripts/restore.sh $BACKUP_DIR/[nom_du_backup].tar.gz"
}

# Fonction de nettoyage
cleanup_backups() {
    log "🧹 Nettoyage des anciens backups..."
    
    if [ ! -d "$BACKUP_DIR" ]; then
        warning "Répertoire de backup non trouvé"
        return
    fi
    
    cd "$BACKUP_DIR"
    
    # Comptage initial
    local initial_count=$(ls *.tar.gz 2>/dev/null | wc -l || echo "0")
    local initial_size=$(du -sh . 2>/dev/null | cut -f1 || echo "0")
    
    info "Backups initiaux: $initial_count ($initial_size)"
    
    # Nettoyage des backups incrémentiaux (garde les 14 derniers)
    log "Nettoyage des backups incrémentiaux..."
    ls -t oracle-portfolio-backup-incremental-*.tar.gz 2>/dev/null | tail -n +15 | xargs rm -f 2>/dev/null || true
    
    # Nettoyage des backups complets (garde les 4 derniers)
    log "Nettoyage des backups complets..."
    ls -t oracle-portfolio-backup-full-*.tar.gz 2>/dev/null | tail -n +5 | xargs rm -f 2>/dev/null || true
    
    # Nettoyage des autres types (garde les 7 derniers)
    log "Nettoyage des autres backups..."
    ls -t oracle-portfolio-backup-configs-*.tar.gz 2>/dev/null | tail -n +8 | xargs rm -f 2>/dev/null || true
    ls -t oracle-portfolio-backup-data-*.tar.gz 2>/dev/null | tail -n +8 | xargs rm -f 2>/dev/null || true
    ls -t oracle-portfolio-backup-code-*.tar.gz 2>/dev/null | tail -n +8 | xargs rm -f 2>/dev/null || true
    
    # Comptage final
    local final_count=$(ls *.tar.gz 2>/dev/null | wc -l || echo "0")
    local final_size=$(du -sh . 2>/dev/null | cut -f1 || echo "0")
    local cleaned_count=$((initial_count - final_count))
    
    success "Nettoyage terminé"
    info "Backups supprimés: $cleaned_count"
    info "Backups restants: $final_count ($final_size)"
    
    # Log du nettoyage
    echo "$(date): Nettoyage automatique - $cleaned_count backups supprimés" >> "$LOG_FILE"
}

# Fonction de test
test_backup() {
    log "🧪 Test de backup manuel..."
    
    # Création d'un backup de test
    local test_dir="/tmp/oracle-portfolio-backup-test"
    mkdir -p "$test_dir"
    
    info "Exécution d'un backup de test..."
    if "$SCRIPT_DIR/backup.sh" configs "$test_dir"; then
        success "Backup de test réussi"
        
        # Vérification du backup
        local backup_file=$(ls "$test_dir"/*.tar.gz 2>/dev/null | head -1)
        if [ -n "$backup_file" ]; then
            info "Fichier créé: $(basename "$backup_file")"
            info "Taille: $(du -sh "$backup_file" | cut -f1)"
            
            # Test de restauration
            log "Test de restauration..."
            if "$SCRIPT_DIR/restore.sh" --verify "$backup_file"; then
                success "Vérification de restauration réussie"
            else
                warning "Problème de vérification de restauration"
            fi
        fi
        
        # Nettoyage
        rm -rf "$test_dir"
        success "Test terminé avec succès"
    else
        error "Échec du backup de test"
    fi
}

# Traitement des commandes
case "${1:-help}" in
    "install")
        install_cron
        ;;
    "uninstall")
        uninstall_cron
        ;;
    "status")
        show_status
        ;;
    "list")
        list_backups
        ;;
    "cleanup")
        cleanup_backups
        ;;
    "test")
        test_backup
        ;;
    "help"|*)
        show_help
        ;;
esac

