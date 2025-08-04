# Oracle Portfolio v4.3 - Architecture Hybride

## 🚀 Vue d'Ensemble

Oracle Portfolio utilise maintenant une **architecture hybride complète** combinant le meilleur des deux mondes :
- **Node.js (Firebase Functions)** pour les fonctions critiques existantes
- **Python (Google Cloud Run)** pour les nouvelles fonctionnalités et l'intelligence artificielle

## 🏗️ Architecture Technique

### Frontend React
- **URL Production** : https://oracle-portfolio-prod.web.app/
- **Déploiement** : Firebase Hosting avec CI/CD GitHub Actions
- **Framework** : React + TypeScript + Vite + Tailwind CSS
- **Design** : Oracle Portfolio Brand Guide (couleurs électriques, fond sombre)

### Backend Node.js (Existant)
- **URL Base** : https://us-central1-oracle-portfolio-prod.cloudfunctions.net
- **Runtime** : Node.js 18/20 sur Firebase Functions
- **Fonctions Déployées** :
  - ✅ `getCountries` - Données des pays
  - ✅ `getBacktesting` - Backtesting de portefeuille
  - ✅ `getMarketStress` - Stress tests de marché
  - ✅ `getMarketData` - Données de marché
  - ✅ `getAllocations` - Allocations d'actifs
  - ✅ `getHealth` - Santé du système
  - ✅ `getRegime` - Régimes économiques

### Backend Python (Nouveau)
- **URL Base** : https://vgh0i1cowmwm.manus.space
- **Runtime** : Python 3.11 sur Google Cloud Run
- **Framework** : Flask + Gunicorn
- **Fonctions Déployées** :
  - ✅ `getSystemHealth` - Santé du système Python
  - ✅ `getRegimePython` - Régimes économiques (Python)
  - ✅ `getIndicatorsBreakdown` - Analyse détaillée des indicateurs
  - ✅ `getMultiRegime` - Analyse multi-pays
  - ✅ `getAllocationsPython` - Allocations basées sur l'IA

## 🎯 Stratégie de Déploiement

### Phase 1 : Coexistence ✅ TERMINÉE
- Déploiement du backend Python sur Cloud Run
- Tests de tous les endpoints Python
- Validation de la performance et fiabilité

### Phase 2 : Intégration Progressive 🔄 EN COURS
- Configuration hybride dans le frontend
- Appels API avec fallback automatique
- Monitoring des deux backends

### Phase 3 : Optimisation 🔮 FUTURE
- Migration progressive des fonctions critiques
- Optimisation des performances
- Consolidation de l'architecture

## 🔗 Endpoints et APIs

### APIs Node.js (Firebase Functions)

| Endpoint | URL | Description | Status |
|----------|-----|-------------|--------|
| getCountries | `/getCountries` | Liste des pays avec données économiques | ✅ Actif |
| getBacktesting | `/getBacktesting` | Backtesting de portefeuille | ✅ Actif |
| getMarketStress | `/getMarketStress` | Tests de stress de marché | ✅ Actif |
| getMarketData | `/getMarketData` | Données de marché en temps réel | ✅ Actif |
| getAllocations | `/getAllocations` | Allocations d'actifs | ✅ Actif |
| getHealth | `/getHealth` | Santé du système Node.js | ✅ Actif |
| getRegime | `/getRegime` | Régimes économiques | ✅ Actif |

### APIs Python (Cloud Run)

| Endpoint | URL | Description | Status |
|----------|-----|-------------|--------|
| getSystemHealth | `/getSystemHealth` | Santé du système Python | ✅ Actif |
| getRegimePython | `/getRegimePython` | Régimes économiques (Python) | ✅ Actif |
| getIndicatorsBreakdown | `/getIndicatorsBreakdown` | Analyse détaillée des indicateurs | ✅ Actif |
| getMultiRegime | `/getMultiRegime` | Analyse multi-pays simultanée | ✅ Actif |
| getAllocationsPython | `/getAllocationsPython` | Allocations basées sur l'IA | ✅ Actif |

## 📊 Exemples de Réponses API

### Node.js - getRegime
```json
{
  "success": true,
  "country": "FRA",
  "country_name": "France",
  "regime": "EXPANSION",
  "confidence": 95.2,
  "growth": 2.5,
  "inflation": 2.8,
  "unemployment": 7.5,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Python - getRegimePython
```json
{
  "success": true,
  "data": {
    "country": "FRA",
    "regime": "EXPANSION",
    "confidence": 94.8,
    "indicators": {
      "gdp_growth": 2.5,
      "inflation_rate": 2.8,
      "unemployment_rate": 7.5,
      "consumer_confidence": 85.2
    },
    "ai_analysis": "Strong expansion signals with moderate inflation pressure"
  },
  "backend": "python",
  "timestamp": 1705312200000
}
```

## 🛠️ Installation et Développement

### Prérequis
- Node.js 18+
- npm ou yarn
- Git

### Installation
```bash
# Cloner le repository
git clone https://github.com/Alchile69/oracle-portfolio.git
cd oracle-portfolio

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

### Scripts disponibles
```bash
npm run dev          # Démarrage du serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
npm run lint         # Vérification du code
```

## 🎨 Design System

### Couleurs Oracle Portfolio
- **Primary** : `#00d4ff` (Bleu électrique)
- **Secondary** : `#1a1a2e` (Bleu nuit)
- **Dark** : `#0f0f23` (Noir profond)
- **Success** : `#00ff88` (Vert succès)
- **Error** : `#ff4757` (Rouge alerte)
- **Warning** : `#ffa502` (Orange warning)

### Typographie
- **Font** : Inter (Google Fonts)
- **Weights** : 300, 400, 500, 600, 700

## 🔧 Configuration

### Variables d'environnement
```env
# Backend Node.js
NODEJS_BASE_URL=https://us-central1-oracle-portfolio-prod.cloudfunctions.net

# Backend Python
PYTHON_BASE_URL=https://vgh0i1cowmwm.manus.space

# Configuration API
API_TIMEOUT=10000
API_RETRY_ATTEMPTS=3
API_RETRY_DELAY=1000
```

### Configuration hybride
Le système utilise une stratégie de fallback automatique :
1. **Node.js en premier** (par défaut)
2. **Fallback vers Python** si Node.js échoue
3. **Monitoring en temps réel** de la santé des backends

## 📈 Monitoring et Performance

### Métriques surveillées
- **Temps de réponse** des APIs
- **Taux de succès** des requêtes
- **Disponibilité** des backends
- **Performance** du frontend

### Alertes configurées
- **Seuil de réponse** : 5 secondes
- **Taux d'erreur** : 5%
- **Disponibilité** : 99%

## 🚀 Déploiement

### Vercel (Frontend)
```bash
# Déploiement automatique via GitHub
git push origin main
```

### Firebase Functions (Backend Node.js)
```bash
firebase deploy --only functions
```

### Google Cloud Run (Backend Python)
```bash
gcloud run deploy oracle-portfolio-python
```

## 🔍 Dépannage

### Problèmes courants
1. **Backend Node.js inaccessible**
   - Vérifier Firebase Functions
   - Contrôler les quotas

2. **Backend Python inaccessible**
   - Vérifier Cloud Run
   - Contrôler les logs

3. **Design non appliqué**
   - Vérifier Tailwind CSS
   - Contrôler les classes CSS

### Logs et debugging
```bash
# Logs Vercel
vercel logs

# Logs Firebase
firebase functions:log

# Logs Cloud Run
gcloud logging read "resource.type=cloud_run_revision"
```

## 📞 Support

Pour toute question ou problème :
- **Issues GitHub** : [Créer une issue](https://github.com/Alchile69/oracle-portfolio/issues)
- **Documentation** : [Wiki du projet](https://github.com/Alchile69/oracle-portfolio/wiki)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Version** : 4.3.0  
**Dernière mise à jour** : 2024-01-15  
**Architecture** : Hybride Node.js + Python  
**Status** : Production Ready ✅ 