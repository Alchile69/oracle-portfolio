# Oracle Portfolio v4.1 - Replit Ready

🔮 **Application d'allocation sectorielle intelligente basée sur les régimes économiques**

Cette version est optimisée pour Replit avec une structure plate et des imports simplifiés, tout en conservant toutes les fonctionnalités avancées de la v4.1.

## 🚀 Fonctionnalités

### 📊 **Composants Principaux**
- **AllocationChart** - Graphique sectoriel interactif avec Recharts
- **RegimeIndicator** - Indicateur de régime économique sophistiqué  
- **SectorTable** - Table détaillée des allocations sectorielles

### 🎯 **Fonctionnalités Avancées**
- ✅ **Animations Framer Motion** - Transitions fluides et professionnelles
- ✅ **Types TypeScript** - Typage complet pour secteurs et régimes
- ✅ **Hooks personnalisés** - Gestion d'état et données temps réel
- ✅ **Design Oracle Portfolio** - Charte graphique complète
- ✅ **Responsive Design** - Compatible mobile et desktop

### 🏗️ **Architecture**
- **Next.js 14** - Framework React moderne
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles utilitaires
- **Framer Motion** - Animations
- **Recharts** - Graphiques interactifs

## 🛠️ Installation

### Sur Replit
1. **Importer depuis GitHub** : Utilisez l'URL de cette branche
2. **Installation automatique** : Replit détecte Next.js automatiquement
3. **Lancer** : Cliquez sur "Run" ou utilisez `npm run dev`

### En local
```bash
# Cloner le repository
git clone https://github.com/Alchile69/oracle-portfolio.git
cd oracle-portfolio

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

## 📁 Structure du Projet

```
oracle-portfolio-v41-replit/
├── components/              # Composants React
│   ├── AllocationChart.tsx  # Graphique sectoriel
│   ├── RegimeIndicator.tsx  # Indicateur de régime
│   └── SectorTable.tsx      # Table des secteurs
├── hooks/                   # Hooks personnalisés
│   ├── useAllocationData.ts # Données d'allocation
│   └── useRegimeData.ts     # Données de régime
├── lib/                     # Utilitaires et types
│   └── types/               # Types TypeScript
│       ├── regime.types.ts  # Types régimes économiques
│       └── sector.types.ts  # Types secteurs d'activité
├── pages/                   # Pages Next.js
│   ├── _app.tsx            # Configuration app
│   └── index.tsx           # Page principale
├── styles/                  # Styles globaux
│   └── globals.css         # CSS + Tailwind
├── package.json            # Dépendances
├── next.config.js          # Configuration Next.js
├── tailwind.config.js      # Configuration Tailwind
└── tsconfig.json           # Configuration TypeScript
```

## 🎨 Design System

### 🎯 **Couleurs Oracle Portfolio**
```css
--primary: #00d4ff          /* Bleu Oracle */
--background: #0f0f23       /* Fond principal */
--background-secondary: #1a1a2e  /* Fond secondaire */
--success: #00ff88          /* Vert succès */
--error: #ff4757            /* Rouge erreur */
--warning: #ffa502          /* Orange warning */
```

### 📊 **Couleurs Sectorielles**
- **Technology**: `#00d4ff` (Cyan)
- **Healthcare**: `#00ff88` (Vert)
- **Financials**: `#ffa502` (Orange)
- **Energy**: `#ff6b6b` (Rouge)
- **Consumer**: `#4ecdc4` (Teal)

### 🏛️ **Couleurs Régimes**
- **Expansion**: `#00ff88` (Vert)
- **Recovery**: `#40a9ff` (Bleu)
- **Stagflation**: `#ffa502` (Orange)
- **Recession**: `#ff4757` (Rouge)

## 📊 Types de Données

### 🏛️ **Régimes Économiques**
```typescript
type RegimeType = 'EXPANSION' | 'RECOVERY' | 'STAGFLATION' | 'RECESSION';

interface RegimeData {
  regime: RegimeType;
  confidence: number;        // 0-100
  growthScore: number;       // Percentage
  inflationScore: number;    // Percentage
  unemploymentScore?: number; // Percentage
  detectedAt: Date;
  lastUpdated: Date;
  country: string;
}
```

### 📈 **Secteurs d'Activité**
```typescript
type SectorType = 'TECHNOLOGY' | 'HEALTHCARE' | 'FINANCIALS' | 'ENERGY' | ...;

interface SectorAllocation {
  sector: SectorType;
  allocation: number;        // Percentage (0-100)
  performance: number;       // Percentage return
  confidence: number;        // 0-100
  lastUpdated: Date;
  trend: 'UP' | 'DOWN' | 'STABLE';
  riskScore: number;         // 0-100
}
```

## 🔧 Configuration

### 🎯 **Next.js (next.config.js)**
- Configuration optimisée pour Replit
- Support des images non-optimisées
- Headers CORS pour développement
- Fallbacks webpack

### 🎨 **Tailwind (tailwind.config.js)**
- Thème Oracle Portfolio complet
- Couleurs personnalisées
- Animations avancées
- Classes utilitaires

### 📝 **TypeScript (tsconfig.json)**
- Paths mapping pour imports propres
- Configuration stricte
- Support Next.js

## 🚀 Scripts Disponibles

```bash
npm run dev      # Développement (port 3000)
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # Linting ESLint
npm run type-check # Vérification TypeScript
```

## 🔮 Données Mock

Pour le développement sur Replit, l'application utilise des données simulées :

- **8 secteurs** avec allocations réalistes
- **Régimes économiques** avec scores dynamiques
- **Mise à jour automatique** toutes les 5-10 minutes
- **Randomisation** pour simuler les variations de marché

## 🌟 Migration vers Production

Cette version Replit peut être facilement migrée vers un VPS de production :

1. **Même code source** - Aucune modification nécessaire
2. **Ajout PostgreSQL** - Remplacer les données mock
3. **Ajout Redis** - Cache et sessions
4. **Monitoring** - Prometheus + Grafana
5. **Docker** - Containerisation complète

## 📚 Documentation

- **Composants** : Chaque composant est documenté avec JSDoc
- **Types** : Types TypeScript complets avec commentaires
- **Hooks** : Hooks documentés avec exemples d'usage
- **Styles** : Classes CSS documentées

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

- **Issues GitHub** : Pour les bugs et demandes de fonctionnalités
- **Discussions** : Pour les questions générales
- **Wiki** : Documentation détaillée

---

**Oracle Portfolio v4.1** - *Allocation sectorielle intelligente basée sur les régimes économiques* 🔮

