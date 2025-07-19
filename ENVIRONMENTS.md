# Oracle Portfolio - Guide des Environnements

## 🏗️ **Architecture Multi-Environnements**

Oracle Portfolio dispose de **4 environnements** pour un workflow de développement professionnel :

```
🏭 Production    → oracle-portfolio-prod.web.app      (Utilisateurs finaux)
🧪 Staging       → oracle-portfolio-staging.web.app   (Tests pré-production)
🛠️  Development  → oracle-portfolio-dev.web.app       (Développement actif)
💻 Local         → localhost:5173                      (Développement local)
```

## 📋 **Configuration des Environnements**

### **🏭 Production**
- **Branche** : `restore/elegant-full-version`
- **URL** : https://oracle-portfolio-prod.web.app
- **Firebase** : `oracle-portfolio-prod`
- **Fonctionnalités** :
  - ✅ Analytics activées
  - ❌ Debug désactivé
  - ❌ Mode test désactivé
  - ✅ Monitoring activé

### **🧪 Staging**
- **Branche** : `environments/staging`
- **URL** : https://oracle-portfolio-staging.web.app
- **Firebase** : `oracle-portfolio-staging`
- **Fonctionnalités** :
  - ❌ Analytics désactivées
  - ✅ Debug activé
  - ✅ Mode test activé
  - ✅ Monitoring activé

### **🛠️ Development**
- **Branche** : `environments/development`
- **URL** : https://oracle-portfolio-dev.web.app
- **Firebase** : `oracle-portfolio-dev`
- **Fonctionnalités** :
  - ❌ Analytics désactivées
  - ✅ Debug activé
  - ✅ Mode test activé
  - ❌ Monitoring désactivé

### **💻 Local**
- **URL** : http://localhost:5173
- **Fonctionnalités** :
  - ❌ Analytics désactivées
  - ✅ Debug activé
  - ✅ Mode test activé
  - ❌ Monitoring désactivé

## 🚀 **Scripts de Déploiement**

### **Scripts NPM Disponibles**
```bash
# Déploiements
npm run deploy:dev      # Déploiement vers development
npm run deploy:staging  # Déploiement vers staging
npm run deploy:prod     # Déploiement vers production

# Gestion des environnements
npm run env:status      # Statut de tous les environnements
npm run env:switch      # Basculer entre environnements
npm run env:test        # Tester un environnement

# Tests
npm test                # Suite de tests complète
npm run test:coverage   # Rapport de couverture
npm run test:watch      # Mode surveillance
```

### **Scripts Shell Directs**
```bash
# Déploiement
./scripts/deploy.sh [environment]
./scripts/deploy.sh development
./scripts/deploy.sh staging
./scripts/deploy.sh production

# Gestion des environnements
./scripts/environments.sh status
./scripts/environments.sh switch staging
./scripts/environments.sh test production
./scripts/environments.sh deploy development
```

## 🔄 **Workflow de Développement**

### **1. Développement Local**
```bash
# Développement en local
npm run dev
# Tests en continu
npm run test:watch
```

### **2. Déploiement Development**
```bash
# Basculer vers la branche development
git checkout environments/development
# Déployer
npm run deploy:dev
# Tester
npm run env:test development
```

### **3. Promotion vers Staging**
```bash
# Merger development vers staging
git checkout environments/staging
git merge environments/development
# Déployer
npm run deploy:staging
# Tests complets
npm test -- --run
```

### **4. Déploiement Production**
```bash
# Merger staging vers production
git checkout restore/elegant-full-version
git merge environments/staging
# Tests complets + linting
npm test -- --run && npm run lint
# Déploiement production
npm run deploy:prod
```

## 🧪 **Pipelines CI/CD**

### **GitHub Actions Configurées**

#### **Development** (`.github/workflows/deploy-development.yml`)
- **Déclencheur** : Push sur `environments/development`
- **Tests** : Tests de base uniquement
- **Déploiement** : Automatique vers `oracle-portfolio-dev`

#### **Staging** (`.github/workflows/deploy-staging.yml`)
- **Déclencheur** : Push sur `environments/staging`
- **Tests** : Suite complète + linting + couverture
- **Déploiement** : Automatique vers `oracle-portfolio-staging`
- **Post-déploiement** : Tests E2E

#### **Production** (`.github/workflows/deploy-production.yml`)
- **Déclencheur** : Push sur `restore/elegant-full-version`
- **Tests** : Suite complète + linting + audit sécurité
- **Déploiement** : Automatique vers `oracle-portfolio-prod`
- **Post-déploiement** : Health checks + tagging

## 📊 **Monitoring et Logs**

### **Vérification du Statut**
```bash
# Statut de tous les environnements
npm run env:status

# Test d'un environnement spécifique
npm run env:test staging
```

### **Accès aux Logs**
```bash
# Logs Firebase
./scripts/environments.sh logs production

# Logs GitHub Actions
# Disponibles dans l'interface GitHub
```

## 🔧 **Configuration Technique**

### **Variables d'Environnement**
```javascript
// Development
VITE_ENVIRONMENT=development
VITE_API_BASE_URL=https://api.oracle-portfolio-dev.web.app
VITE_ENABLE_DEBUGGING=true
VITE_TEST_MODE=true

// Staging
VITE_ENVIRONMENT=staging
VITE_API_BASE_URL=https://api.oracle-portfolio-staging.web.app
VITE_ENABLE_DEBUGGING=true
VITE_TEST_MODE=true

// Production
VITE_ENVIRONMENT=production
VITE_API_BASE_URL=https://api.oracle-portfolio-prod.web.app
VITE_ENABLE_DEBUGGING=false
VITE_TEST_MODE=false
```

### **Fichiers de Configuration**
- `environments.config.js` : Configuration centralisée
- `.firebaserc.*` : Configurations Firebase par environnement
- `firebase.*.json` : Configurations hosting par environnement

## 🚦 **Bonnes Pratiques**

### **Développement**
1. **Toujours développer** sur `environments/development`
2. **Tester localement** avant de pousser
3. **Utiliser les tests automatisés** en continu

### **Staging**
1. **Valider toutes les fonctionnalités** avant production
2. **Exécuter la suite de tests complète**
3. **Tester l'intégration** avec les APIs externes

### **Production**
1. **Déployer uniquement** du code testé en staging
2. **Vérifier les health checks** après déploiement
3. **Monitorer les performances** et erreurs

## 🆘 **Dépannage**

### **Problèmes Courants**
```bash
# Environnement inaccessible
npm run env:test [environment]

# Problème de build
npm run build
npm run deploy:[environment]

# Tests qui échouent
npm test -- --run
npm run test:coverage

# Problème de branches
git status
git checkout [branch]
./scripts/environments.sh switch [environment]
```

### **Rollback d'Urgence**
```bash
# Rollback automatique (en développement)
./scripts/environments.sh rollback production

# Rollback manuel
git checkout [previous-commit]
npm run deploy:prod
```

---

**Oracle Portfolio v2.5.0 - Environnements Multi-Stages**  
*Configuré le : 19/07/2025*  
*Architecture : Development → Staging → Production*

