# Oracle Portfolio

> Interface React complète avec backtesting avancé, allocations sectorielles et système de plugins extensible

[![Version](https://img.shields.io/badge/version-2.5.0-blue.svg)](https://github.com/oracle-portfolio/oracle-portfolio)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange.svg)](https://firebase.google.com/)

## 🚀 Fonctionnalités

### 📊 **Modules Financiers Avancés**
- **Backtesting Engine** : Courbes de performance temps réel avec Recharts
- **Allocations de portefeuille** : Graphiques sectoriels interactifs (Actions, Obligations, Commodités, Cash)
- **Market Stress Indicators** : Jauges professionnelles avec données temps réel
- **Régimes économiques** : Analyse automatique par pays avec métriques détaillées
- **ETF Prices** : Suivi des prix avec variations en temps réel

### 🔧 **Backoffice Avancé**
- **Configuration extensible** : Interface de création d'indicateurs personnalisés
- **Système de plugins** : PluginWizard pour extensions modulaires
- **Authentification sécurisée** : Système de login avec rôles
- **15 pays majeurs** : Support complet avec corrections de dates intelligentes

### 🎨 **Interface Utilisateur**
- **Design élégant** : Thème sombre professionnel avec Shadcn/ui
- **Responsive** : Compatible desktop et mobile
- **Animations fluides** : Transitions et interactions optimisées
- **Accessibilité** : Conforme aux standards WCAG

## 🏗️ Architecture Technique

### **Stack Principal**
- **Frontend** : React 18 + TypeScript + Vite
- **UI Components** : Shadcn/ui + Tailwind CSS
- **Charts** : Recharts pour visualisations avancées
- **State Management** : Context API + Custom Hooks
- **Build** : Vite avec optimisations de production

### **APIs & Intégrations**
- **Firebase Functions** : Backend Node.js pour APIs historiques
- **Google Cloud Run** : Backend Python pour fonctionnalités IA
- **Architecture hybride** : Fallback automatique entre APIs
- **Données temps réel** : Intégration multi-sources (EIA, Eurostat, etc.)

## 🚀 Installation & Démarrage

### **Prérequis**
- Node.js 18+ 
- npm ou yarn
- Git

### **Installation**
```bash
# Cloner le repository
git clone https://github.com/[username]/oracle-portfolio.git
cd oracle-portfolio

# Installer les dépendances
npm install --legacy-peer-deps

# Démarrer en développement
npm run dev

# Build pour production
npm run build
```

### **Variables d'environnement**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=oracle-portfolio-prod
VITE_PYTHON_API_BASE=https://your-cloud-run-url
```

## 📊 Métriques de Performance

- **Build size** : 742.87 kB JS + 98.75 kB CSS
- **Modules** : 2270 modules transformés
- **Build time** : ~5 secondes
- **Dependencies** : 306 packages optimisés

## 🔐 Authentification

### **Accès Configuration**
- **Username** : `admin`
- **Password** : `scalabla2025`
- **Rôles** : Configuration, Plugins, Analytics

## 📱 Fonctionnalités par Module

### **Dashboard Principal**
- Sélection dynamique des pays (15 majeurs)
- Régimes économiques avec métriques temps réel
- Market Stress avec jauges circulaires
- ETF Prices avec variations colorées

### **Backtesting Engine**
- Interface de sélection de dates intelligente
- Support "today"/"aujourd'hui" automatique
- Courbes de performance comparative
- Métriques de risque avancées

### **Allocations de Portefeuille**
- Graphiques sectoriels (Pie Charts)
- Répartition dynamique par asset class
- Visualisation responsive
- Données temps réel

### **Configuration Avancée**
- Création d'indicateurs personnalisés
- Système de plugins extensible
- Interface de gestion des formules
- Wizard de création guidée

## 🛠️ Développement

### **Structure du Projet**
```
src/
├── components/
│   ├── widgets/          # Modules financiers
│   ├── admin/           # Backoffice
│   ├── auth/            # Authentification
│   ├── charts/          # Graphiques
│   └── ui/              # Composants UI
├── contexts/            # State management
├── hooks/               # Custom hooks
├── utils/               # Utilitaires
└── data/                # Données statiques
```

### **Commandes Utiles**
```bash
# Développement avec hot reload
npm run dev

# Build optimisé
npm run build

# Preview du build
npm run preview

# Linting
npm run lint

# Tests (à implémenter)
npm run test
```

## 🚀 Déploiement

### **Firebase Hosting**
```bash
# Build du projet
npm run build

# Déploiement Firebase
firebase deploy --only hosting
```

### **Variables de Production**
- **URL** : https://oracle-portfolio-prod.web.app
- **CDN** : Firebase CDN global
- **SSL** : Certificat automatique
- **Performance** : Optimisations automatiques

## 📈 Roadmap

### **Version 2.6.0 (Prochaine)**
- [ ] Tests unitaires complets
- [ ] Documentation API détaillée
- [ ] Mode offline avec cache
- [ ] Notifications push

### **Version 3.0.0 (Future)**
- [ ] Architecture micro-frontends
- [ ] WebAssembly pour calculs intensifs
- [ ] Intelligence artificielle intégrée
- [ ] API GraphQL

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🏆 Crédits

- **Architecture** : React + TypeScript + Vite
- **UI/UX** : Shadcn/ui + Tailwind CSS  
- **Charts** : Recharts
- **Hosting** : Firebase
- **APIs** : Firebase Functions + Google Cloud Run

---

**Oracle Portfolio** - Interface financière professionnelle pour l'analyse de portefeuilles multi-pays 🌍📊

