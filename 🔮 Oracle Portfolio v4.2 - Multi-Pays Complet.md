# 🔮 Oracle Portfolio v4.2 - Multi-Pays Complet

**Application professionnelle d'allocation sectorielle avec système multi-pays et configuration avancée**

## ✨ Nouveautés v4.2

### 🌍 **Système Multi-Pays**
- **4 pays complets** : France 🇫🇷, Allemagne 🇩🇪, États-Unis 🇺🇸, Royaume-Uni 🇬🇧
- **Sélecteur de pays** avec drapeaux et informations détaillées
- **Données spécifiques** par pays (régimes, secteurs, indicateurs)
- **Persistance** de la sélection utilisateur

### ⚙️ **Système de Configuration Avancé**
- **5 modules** : Général, Indicateurs, Formules, Régimes, Plugins
- **7 indicateurs économiques** configurables avec pondérations
- **4 régimes économiques** personnalisables par pays
- **Éditeur de formules** mathématiques avec test temps réel
- **Gestionnaire de plugins** extensible

## 🏗️ Architecture Complète

### 📊 **Dashboard Professionnel**
- **Interface temps réel** avec données par pays
- **11 secteurs** parfaitement définis et fonctionnels
- **Graphiques interactifs** (AllocationChart, SectorTable)
- **Indicateur de régime** avec confiance et scores

### 🔧 **Composants Sectoriels**
- **AllocationChart** - Graphique circulaire avec répartition sectorielle
- **SectorTable** - Table détaillée des performances sectorielles
- **RegimeIndicator** - Affichage du régime économique actuel
- **CountrySelector** - Sélection pays avec interface élégante

### 🌐 **Données par Pays**

#### 🇫🇷 **France**
- **Régime** : Expansion (85% confiance)
- **Secteurs dominants** : Technology (18%), Financials (20%), Healthcare (15%)
- **Indicateurs** : RTE, Markit France, OAT 10 ans

#### 🇩🇪 **Allemagne**
- **Régime** : Recovery (78% confiance)
- **Secteurs dominants** : Industrials (28%), Technology (18%), Financials (15%)
- **Indicateurs** : Bundesnetzagentur, Markit Germany, Bund 10 ans

#### 🇺🇸 **États-Unis**
- **Régime** : Stagflation (92% confiance)
- **Secteurs dominants** : Technology (25%), Healthcare (15%), Financials (13%)
- **Indicateurs** : EIA, ISM Manufacturing, Treasury 10Y

#### 🇬🇧 **Royaume-Uni**
- **Régime** : Recession (88% confiance)
- **Secteurs dominants** : Financials (25%), Consumer Staples (15%), Energy (12%)
- **Indicateurs** : National Grid, Markit UK, Gilt 10Y

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Git

### Installation Rapide
```bash
# Cloner le projet
git clone <repository-url>
cd oracle-portfolio-v42

# Installer les dépendances
npm install

# Démarrer en développement
npm run dev
```

### Déploiement Replit
1. **Importer** le projet sur Replit
2. **Run** - L'application démarre automatiquement
3. **Accéder** via l'URL fournie par Replit

## 📁 Structure du Projet

```
oracle-portfolio-v42/
├── components/
│   ├── AllocationChart.tsx      # Graphique d'allocation
│   ├── RegimeIndicator.tsx      # Indicateur de régime
│   ├── SectorTable.tsx          # Table des secteurs
│   ├── CountrySelector.tsx      # Sélecteur de pays
│   ├── ConfigurationTabs.tsx    # Navigation configuration
│   └── config/                  # Modules de configuration
│       ├── GeneralConfig.tsx
│       ├── IndicatorsConfig.tsx
│       ├── FormulasConfig.tsx
│       ├── RegimesConfig.tsx
│       └── PluginsConfig.tsx
├── hooks/
│   ├── useAllocationData.ts     # Données d'allocation
│   ├── useRegimeData.ts         # Données de régime
│   ├── useCountrySelection.ts   # Gestion pays
│   └── useConfiguration.ts      # Configuration
├── lib/types/
│   ├── country.types.ts         # Types pays
│   ├── regime.types.ts          # Types régimes
│   ├── sector.types.ts          # Types secteurs
│   └── config.types.ts          # Types configuration
├── pages/
│   ├── index.tsx                # Dashboard principal
│   ├── configuration.tsx        # Page configuration
│   └── _app.tsx                 # Application wrapper
└── styles/
    └── globals.css              # Styles globaux
```

## 🎯 Fonctionnalités Principales

### 🌍 **Multi-Pays**
- Sélection dynamique entre 4 pays
- Données spécifiques par pays
- Persistance de la sélection
- Interface adaptée par marché

### 📊 **Allocation Sectorielle**
- 11 secteurs économiques
- Allocations personnalisées par pays
- Performance temps réel
- Analyse de risque

### ⚙️ **Configuration Avancée**
- 5 modules de configuration
- Sauvegarde/Export/Import
- Validation des données
- Interface intuitive

### 🔧 **Système Extensible**
- Architecture modulaire
- Types TypeScript complets
- Hooks personnalisés
- Composants réutilisables

## 🛠️ Technologies Utilisées

- **Frontend** : Next.js 14, React 18, TypeScript
- **Styling** : Tailwind CSS, Framer Motion
- **Charts** : Recharts, Lucide Icons
- **State** : React Hooks, LocalStorage
- **Build** : Next.js, ESLint, PostCSS

## 📈 Performance

- **Temps de chargement** : < 2s
- **Bundle size** : Optimisé
- **Responsive** : Mobile-first
- **Accessibilité** : WCAG 2.1

## 🔒 Sécurité

- **Validation** des données d'entrée
- **Sanitization** des inputs utilisateur
- **Types** TypeScript stricts
- **Error boundaries** React

## 📝 Changelog v4.2

### ✅ Ajouté
- Système multi-pays complet (4 pays)
- Composant CountrySelector avec drapeaux
- Données spécifiques par pays
- Hook useCountrySelection
- Types country.types.ts
- Configuration persistante par pays

### 🔄 Modifié
- useAllocationData : support multi-pays
- useRegimeData : support multi-pays
- Interface principale : intégration CountrySelector
- Version : 4.1.0 → 4.2.0

### 🐛 Corrigé
- Gestion d'erreur améliorée
- Fallback données par défaut
- Performance optimisée

## 🎯 Prochaines Étapes (v4.3)

- [ ] APIs temps réel par pays
- [ ] Historique des régimes
- [ ] Alertes personnalisées
- [ ] Export PDF des rapports
- [ ] Mode sombre/clair
- [ ] Notifications push

## 📞 Support

Pour toute question ou problème :
- **Documentation** : Voir INSTALLATION.md
- **Issues** : Créer une issue GitHub
- **Contact** : Via les canaux officiels

---

**Oracle Portfolio v4.2** - *La solution complète d'allocation sectorielle multi-pays* 🚀

