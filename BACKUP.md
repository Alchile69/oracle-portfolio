# Oracle Portfolio - Stratégie de Backup Automatisée

## 🗄️ **Vue d'Ensemble**

Oracle Portfolio dispose d'un **système de backup automatisé complet** pour garantir la sécurité et la récupération des données en cas de problème.

## 📋 **Types de Backup**

### **🔄 Backup Incrémental**
- **Contenu** : Configurations + Code modifié + Git
- **Fréquence** : Quotidien (automatique)
- **Usage** : Sauvegarde rapide des changements récents

### **📦 Backup Complet**
- **Contenu** : Configurations + Données + Code + Documentation + Build + Git
- **Fréquence** : Hebdomadaire (automatique)
- **Usage** : Sauvegarde complète pour restauration totale

### **⚙️ Backup Configurations**
- **Contenu** : Firebase, package.json, vite.config.js, etc.
- **Usage** : Sauvegarde rapide des paramètres

### **💾 Backup Données**
- **Contenu** : src/data, variables d'environnement, logs
- **Usage** : Sauvegarde des données applicatives

### **💻 Backup Code**
- **Contenu** : src/, scripts/, .github/, Git
- **Usage** : Sauvegarde du code source uniquement

## 🚀 **Scripts Disponibles**

### **Scripts NPM**
```bash
# Backups manuels
npm run backup:full        # Backup complet
npm run backup:configs     # Backup configurations
npm run backup:incremental # Backup incrémental

# Gestion des backups
npm run backup:status      # Statut des backups
npm run backup:list        # Liste des backups
npm run backup:cleanup     # Nettoyage des anciens

# Restauration
npm run restore           # Script de restauration
```

### **Scripts Shell Directs**
```bash
# Backup manuel
./scripts/backup.sh [type] [destination]
./scripts/backup.sh full ./backup
./scripts/backup.sh configs ./backup

# Restauration
./scripts/restore.sh [backup_file] [target_directory]
./scripts/restore.sh backup/oracle-portfolio-backup-full-*.tar.gz

# Planification
./scripts/backup-scheduler.sh [action]
./scripts/backup-scheduler.sh install    # Installer les tâches cron
./scripts/backup-scheduler.sh status     # Statut des backups
```

## 📅 **Automatisation**

### **🤖 GitHub Actions (Cloud)**
- **Backup quotidien** : 2h00 UTC (incrémental)
- **Backup hebdomadaire** : 3h00 UTC dimanche (complet)
- **Rétention** : 30 jours dans GitHub Artifacts
- **Releases** : Backup hebdomadaire publié comme release

### **⏰ Cron Local (Serveur)**
```bash
# Installation des tâches automatiques
./scripts/backup-scheduler.sh install

# Planification installée :
# 0 2 * * * - Backup incrémental quotidien
# 0 3 * * 0 - Backup complet hebdomadaire  
# 0 4 1 * * - Nettoyage mensuel
```

### **📊 Monitoring**
- **Logs** : `backup/backup.log`
- **Notifications** : GitHub Actions (succès/échec)
- **Vérification** : Intégrité automatique des archives

## 🔧 **Configuration**

### **Répertoires de Backup**
```
backup/
├── oracle-portfolio-backup-full-YYYYMMDD_HHMMSS.tar.gz
├── oracle-portfolio-backup-incremental-YYYYMMDD_HHMMSS.tar.gz
├── oracle-portfolio-backup-configs-YYYYMMDD_HHMMSS.tar.gz
└── backup.log
```

### **Contenu des Backups**
```
Backup Complet:
├── Configurations (Firebase, package.json, vite.config.js, etc.)
├── Code source (src/, scripts/, .github/)
├── Documentation (README.md, CHANGELOG.md, etc.)
├── Données (src/data, variables d'environnement)
├── Build (dist/)
├── Git (branches, commits, status)
└── BACKUP_MANIFEST.md
```

### **Rétention des Backups**
- **Incrémentiaux** : 14 derniers (2 semaines)
- **Complets** : 4 derniers (1 mois)
- **Autres** : 7 derniers (1 semaine)
- **GitHub Artifacts** : 30 jours
- **GitHub Releases** : Permanent

## 🔄 **Procédures de Restauration**

### **1. Restauration Simple**
```bash
# Lister les backups disponibles
./scripts/restore.sh --list

# Restaurer un backup
./scripts/restore.sh backup/oracle-portfolio-backup-full-20250719_153929.tar.gz

# Vérifier la restauration
cd restored-oracle-portfolio
npm ci --legacy-peer-deps
npm test
npm run dev
```

### **2. Restauration d'Urgence**
```bash
# Télécharger depuis GitHub Releases
wget https://github.com/user/oracle-portfolio/releases/download/backup-123/backup.tar.gz

# Restaurer rapidement
./scripts/restore.sh backup.tar.gz ./emergency-restore

# Déployer immédiatement
cd emergency-restore
./scripts/deploy.sh production
```

### **3. Restauration Sélective**
```bash
# Extraire manuellement
tar -xzf backup.tar.gz

# Copier seulement les fichiers nécessaires
cp backup/firebase.json ./
cp backup/package.json ./
cp -r backup/src/data ./src/
```

## 🧪 **Tests et Validation**

### **Test de Backup**
```bash
# Test manuel complet
./scripts/backup-scheduler.sh test

# Vérification d'intégrité
./scripts/restore.sh --verify backup/[fichier].tar.gz

# Test de restauration
./scripts/restore.sh backup/[fichier].tar.gz ./test-restore
```

### **Validation Automatique**
- **Intégrité** : Vérification md5sum automatique
- **Contenu** : Validation du manifeste
- **Fonctionnalité** : Tests npm après restauration

## 📊 **Monitoring et Alertes**

### **Statut des Backups**
```bash
# Statut complet
npm run backup:status

# Liste des backups
npm run backup:list

# Logs récents
tail -f backup/backup.log
```

### **Métriques Importantes**
- **Fréquence** : Respect des planifications
- **Taille** : Évolution de la taille des backups
- **Intégrité** : Succès des vérifications
- **Rétention** : Nettoyage automatique

## 🚨 **Procédures d'Urgence**

### **Perte Complète du Serveur**
1. **Récupération depuis GitHub** :
   ```bash
   git clone https://github.com/user/oracle-portfolio.git
   cd oracle-portfolio
   ```

2. **Téléchargement du dernier backup** :
   ```bash
   # Depuis GitHub Releases ou Artifacts
   wget [URL_BACKUP]
   ```

3. **Restauration rapide** :
   ```bash
   ./scripts/restore.sh backup.tar.gz ./
   npm ci --legacy-peer-deps
   ./scripts/deploy.sh production
   ```

### **Corruption de Données**
1. **Identification** : Logs et monitoring
2. **Sélection** : Dernier backup valide
3. **Restauration** : Sélective ou complète
4. **Validation** : Tests complets
5. **Redéploiement** : Environnements affectés

## 📈 **Optimisations**

### **Performance**
- **Compression** : tar.gz pour réduire la taille
- **Incrémental** : Seulement les changements Git
- **Parallélisation** : GitHub Actions multiples

### **Sécurité**
- **Chiffrement** : Possibilité d'ajouter GPG
- **Accès** : Contrôle des permissions
- **Audit** : Logs détaillés

### **Évolutivité**
- **Cloud Storage** : AWS S3, Google Cloud
- **Base de données** : Backup des données externes
- **Multi-sites** : Réplication géographique

## 📋 **Checklist de Validation**

### **✅ Implémentation Complète**
- [x] Scripts de backup automatisés (5 types)
- [x] Script de restauration avec validation
- [x] Planificateur cron local
- [x] Workflow GitHub Actions
- [x] Scripts NPM intégrés
- [x] Documentation complète
- [x] Tests de validation
- [x] Monitoring et logs

### **✅ Tests Validés**
- [x] Backup configurations (107K)
- [x] Backup complet (427K)
- [x] Vérification d'intégrité
- [x] Génération de manifeste
- [x] Compression automatique
- [x] Nettoyage des anciens backups

## 🎯 **Prochaines Améliorations**

### **Phase 1 : Sécurité**
- Chiffrement GPG des backups sensibles
- Authentification pour les restaurations
- Audit trail complet

### **Phase 2 : Cloud**
- Synchronisation AWS S3/Google Cloud
- Backup cross-region
- API de gestion des backups

### **Phase 3 : Intelligence**
- Backup différentiel avancé
- Détection automatique des corruptions
- Restauration assistée par IA

---

**Oracle Portfolio v2.5.0 - Stratégie de Backup Automatisée**  
*Implémentée le : 19/07/2025*  
*Status : ✅ 100% Opérationnelle*  
*Sécurité : Garantie de récupération complète*

