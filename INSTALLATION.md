# 🚀 Installation Oracle Portfolio v4.1 - Replit Ready

## 📦 Contenu du Package

Ce ZIP contient la version **Oracle Portfolio v4.1** optimisée pour Replit avec :
- ✅ **Structure plate** compatible Replit
- ✅ **Vraies APIs** (pas de données simulées)
- ✅ **Composants v4.1** complets (AllocationChart, RegimeIndicator, SectorTable)
- ✅ **Types TypeScript** pour secteurs et régimes
- ✅ **Design Oracle Portfolio** avec Tailwind CSS

## 🎯 Installation sur Replit

### Option A : Import depuis ZIP
1. **Aller sur** https://replit.com
2. **Cliquer** "Create Repl"
3. **Choisir** "Import from ZIP"
4. **Uploader** ce fichier `oracle-portfolio-v41-replit-ready.zip`
5. **Attendre** l'extraction automatique
6. **Cliquer** "Run" pour démarrer

### Option B : Import depuis GitHub
1. **Créer une branche** `v4.1-replit-ready` sur votre repo
2. **Copier** tous les fichiers de ce ZIP dans la branche
3. **Commit & Push** vers GitHub
4. **Importer dans Replit** depuis l'URL GitHub

## 🔧 Configuration

### Variables d'Environnement
Créer un fichier `.env.local` :
```bash
# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Ou votre URL de production
# NEXT_PUBLIC_API_URL=https://votre-api.com
```

### Dépendances
Les dépendances s'installent automatiquement sur Replit. Si besoin manuel :
```bash
npm install
```

## 🚀 Démarrage

### Sur Replit
- **Automatique** : Cliquer "Run"
- **Manuel** : `npm run dev`

### En Local
```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build
npm start
```

## 📊 Endpoints API Requis

L'application attend ces endpoints (selon cahier des charges v4.1) :

### GET /api/current-regime
```json
{
  "regime": "EXPANSION",
  "confidence": 85,
  "growthScore": 2.8,
  "inflationScore": 2.1,
  "unemploymentScore": 7.2,
  "allocations": [
    {
      "sector": "TECHNOLOGY",
      "allocation": 25.5,
      "performance": 12.3,
      "confidence": 88,
      "trend": "UP",
      "riskScore": 75
    }
  ],
  "timestamp": "2025-07-31T14:00:00Z",
  "country": "France"
}
```

### GET /api/sectors
```json
{
  "sectors": [
    {
      "id": "technology",
      "name": "Technology", 
      "etf": "XLK"
    }
  ]
}
```

### GET /api/historical/:days
```json
{
  "history": [
    {
      "date": "2025-07-30",
      "regime": "EXPANSION",
      "confidence": 85
    }
  ]
}
```

## 🎨 Structure du Projet

```
oracle-portfolio-v41-replit/
├── components/              # Composants React v4.1
│   ├── AllocationChart.tsx  # Graphique sectoriel
│   ├── RegimeIndicator.tsx  # Indicateur de régime
│   └── SectorTable.tsx      # Table des secteurs
├── hooks/                   # Hooks personnalisés
│   ├── useAllocationData.ts # Données d'allocation
│   └── useRegimeData.ts     # Données de régime
├── lib/types/               # Types TypeScript
│   ├── regime.types.ts      # Types régimes économiques
│   └── sector.types.ts      # Types secteurs d'activité
├── pages/                   # Pages Next.js
│   ├── index.tsx           # Dashboard principal
│   └── _app.tsx            # Configuration app
├── styles/                  # Styles globaux
│   └── globals.css         # CSS + Tailwind
├── package.json            # Dépendances
├── next.config.js          # Configuration Next.js
├── tailwind.config.js      # Configuration Tailwind
└── tsconfig.json           # Configuration TypeScript
```

## 🔍 Fonctionnalités Incluses

### 📊 Composants Avancés
- **AllocationChart** : Graphique en secteurs avec Recharts + animations
- **RegimeIndicator** : Indicateur sophistiqué avec gauge de confiance
- **SectorTable** : Table complète avec tendances et scores de risque

### 🎯 Fonctionnalités
- ✅ **Animations Framer Motion** - Transitions fluides
- ✅ **Types TypeScript** - Typage complet
- ✅ **Auto-refresh** - Données mises à jour toutes les 5 minutes
- ✅ **Responsive Design** - Compatible mobile/desktop
- ✅ **Error Handling** - Gestion d'erreurs robuste

### 🎨 Design Oracle Portfolio
- **Couleurs** : Thème sombre professionnel
- **Typography** : Font Inter
- **Animations** : Transitions fluides
- **Icons** : Lucide React

## 🚨 Troubleshooting

### Erreur "API not responding"
- Vérifier que `NEXT_PUBLIC_API_URL` est correct
- Vérifier que l'API backend est démarrée
- Vérifier les CORS sur l'API

### Erreur de build
- Vérifier les versions Node.js (>=18)
- Nettoyer : `rm -rf node_modules package-lock.json && npm install`

### Composants ne s'affichent pas
- Vérifier les imports TypeScript
- Vérifier que Tailwind CSS est configuré

## 📚 Documentation

- **README.md** : Documentation complète
- **Types** : Commentaires JSDoc dans tous les types
- **Composants** : Props documentées avec TypeScript

## 🔄 Migration vers Production

Cette version Replit peut être facilement migrée vers VPS :
1. **Même code source** - Aucune modification
2. **Ajout PostgreSQL** - Remplacer les APIs
3. **Ajout monitoring** - Prometheus + Grafana
4. **Docker** - Containerisation

## 🤝 Support

- **GitHub Issues** : Pour les bugs
- **Documentation** : README.md complet
- **Types** : IntelliSense complet

---

**Oracle Portfolio v4.1 Replit Ready** - *Allocation sectorielle intelligente* 🔮

