# Oracle Portfolio - Plan Version Hybride v2.4.0 + Secteurs v4.1

## 🎯 OBJECTIF

Créer une version "propre" qui combine :
- ✅ **Base v2.4.0** : Structure simple qui fonctionne sur Replit
- ✅ **Secteurs v4.1** : Composants sectoriels avancés (AllocationChart + RegimeIndicator)
- ✅ **Import Replit garanti** : Structure plate, pas de monorepo complexe

## 📋 COMPOSANTS À RÉCUPÉRER DE v4.1

### 1. AllocationChart.tsx (180 lignes)
```typescript
// Fonctionnalités principales :
- Interface SectorAllocation avec SECTOR_NAMES
- Graphique PieChart avec secteurs colorés  
- Tooltip personnalisé avec détails sectoriels
- Statistiques : Total allocation, Risk Score
- Animations Framer Motion
- Design Oracle Portfolio (couleurs #3B82F6, #EF4444, etc.)

// Props :
interface AllocationChartProps {
  allocations?: SectorAllocation[];
  regime?: string;
}
```

### 2. RegimeIndicator.tsx (113 lignes)
```typescript
// Fonctionnalités principales :
- Interface RegimeType avec REGIME_CHARACTERISTICS
- 4 régimes : EXPANSION, RECOVERY, STAGFLATION, RECESSION
- Couleurs par régime (vert, bleu, orange, rouge)
- Scores détaillés : Croissance, Inflation, Confiance
- Animations Framer Motion
- Design Oracle Portfolio

// Props :
interface RegimeIndicatorProps {
  regime?: {
    regime: RegimeType;
    confidence: number;
    growthScore: number;
    inflationScore: number;
    detectedAt: string;
  };
}
```

## 🏗️ STRUCTURE HYBRIDE CIBLE

```
oracle-portfolio-hybrid/
├── components/
│   ├── AllocationChart.tsx      ← v4.1 (NOUVEAU)
│   ├── RegimeIndicator.tsx      ← v4.1 (NOUVEAU)
│   └── [autres composants v2.4.0]
├── hooks/
│   ├── useAllocationData.ts     ← v4.1 (NOUVEAU)
│   ├── useRegimeData.ts         ← v4.1 (NOUVEAU)
│   └── [autres hooks v2.4.0]
├── types/
│   ├── sectors.ts               ← v4.1 (NOUVEAU)
│   ├── regimes.ts               ← v4.1 (NOUVEAU)
│   └── [autres types v2.4.0]
├── constants/
│   ├── sectors.ts               ← v4.1 (NOUVEAU)
│   └── regimes.ts               ← v4.1 (NOUVEAU)
├── pages/
│   └── index.tsx                ← v2.4.0 MODIFIÉ (+ secteurs)
├── styles/
│   └── globals.css              ← v2.4.0 (conservé)
├── package.json                 ← v2.4.0 base + dépendances v4.1
├── next.config.js               ← v2.4.0 (conservé)
├── tailwind.config.js           ← v2.4.0 + couleurs v4.1
└── README.md                    ← Hybride
```

## 📦 DÉPENDANCES À AJOUTER

```json
{
  "dependencies": {
    // Base v2.4.0 conservée
    "next": "14.0.0",
    "react": "18.0.0",
    "tailwindcss": "3.0.0",
    
    // Ajouts v4.1
    "framer-motion": "^10.0.0",    // Animations
    "recharts": "^2.8.0",          // Graphiques PieChart
    "lucide-react": "^0.263.0"     // Icônes
  }
}
```

## 🎨 TYPES TYPESCRIPT À CRÉER

### types/sectors.ts
```typescript
export interface SectorAllocation {
  sector: string;
  allocation: number;
  confidence: number;
}

export const SECTOR_NAMES: Record<string, string> = {
  technology: 'Technologie',
  healthcare: 'Santé',
  finance: 'Finance',
  energy: 'Énergie',
  consumer: 'Consommation',
  industrial: 'Industriel',
  materials: 'Matériaux',
  utilities: 'Services'
};
```

### types/regimes.ts
```typescript
export type RegimeType = 'EXPANSION' | 'RECOVERY' | 'STAGFLATION' | 'RECESSION';

export interface RegimeData {
  regime: RegimeType;
  confidence: number;
  growthScore: number;
  inflationScore: number;
  detectedAt: string;
}

export const REGIME_CHARACTERISTICS: Record<RegimeType, any> = {
  EXPANSION: {
    description: 'Croissance forte, inflation modérée',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  // ... autres régimes
};
```

## 🔧 MODIFICATIONS À APPORTER

### 1. pages/index.tsx (v2.4.0 modifié)
```typescript
// Ajouter les imports v4.1
import AllocationChart from '../components/AllocationChart';
import RegimeIndicator from '../components/RegimeIndicator';
import { useAllocationData } from '../hooks/useAllocationData';
import { useRegimeData } from '../hooks/useRegimeData';

// Intégrer les composants dans le dashboard existant
export default function Dashboard() {
  const { allocations, loading: allocationsLoading } = useAllocationData();
  const { regime, loading: regimeLoading } = useRegimeData();
  
  return (
    <div className="dashboard">
      {/* Composants v2.4.0 existants */}
      
      {/* NOUVEAUX composants v4.1 */}
      <RegimeIndicator regime={regime} />
      <AllocationChart allocations={allocations} regime={regime?.regime} />
    </div>
  );
}
```

### 2. tailwind.config.js (couleurs v4.1)
```javascript
module.exports = {
  // Configuration v2.4.0 existante
  theme: {
    extend: {
      colors: {
        // Couleurs Oracle Portfolio v4.1
        primary: '#00d4ff',
        background: '#0f0f23',
        'background-secondary': '#1a1a2e',
        border: '#2a2a3e',
        // ... autres couleurs
      }
    }
  }
}
```

## 🚀 PLAN DE CRÉATION

### Phase 1 : Préparation des fichiers
1. ✅ Récupérer AllocationChart.tsx depuis v4.1
2. ✅ Récupérer RegimeIndicator.tsx depuis v4.1
3. ✅ Créer les types TypeScript (sectors.ts, regimes.ts)
4. ✅ Créer les constantes (SECTOR_NAMES, REGIME_CHARACTERISTICS)
5. ✅ Créer les hooks (useAllocationData.ts, useRegimeData.ts)

### Phase 2 : Intégration
1. ✅ Modifier pages/index.tsx pour intégrer les nouveaux composants
2. ✅ Mettre à jour package.json avec les nouvelles dépendances
3. ✅ Adapter tailwind.config.js avec les couleurs v4.1
4. ✅ Créer un README.md hybride

### Phase 3 : Commit GitHub
1. ✅ Créer une nouvelle branche `v4.1-replit-ready`
2. ✅ Commit tous les fichiers hybrides
3. ✅ Push vers GitHub
4. ✅ Tester l'import Replit

## 🎯 RÉSULTAT ATTENDU

**Version hybride parfaite :**
- ✅ **Base stable v2.4.0** : Fonctionne sur Replit
- ✅ **Secteurs avancés v4.1** : AllocationChart avec graphiques
- ✅ **Régimes sophistiqués v4.1** : RegimeIndicator avec scores
- ✅ **Structure simple** : Pas de monorepo, import Replit garanti
- ✅ **Design cohérent** : Oracle Portfolio unifié
- ✅ **TypeScript complet** : Types et interfaces propres

## 📋 CHECKLIST FINALE

- [ ] AllocationChart.tsx récupéré et adapté
- [ ] RegimeIndicator.tsx récupéré et adapté  
- [ ] Types secteurs et régimes créés
- [ ] Hooks de données créés
- [ ] pages/index.tsx modifié
- [ ] package.json mis à jour
- [ ] tailwind.config.js adapté
- [ ] README.md hybride créé
- [ ] Branche GitHub créée
- [ ] Import Replit testé

## 🎉 AVANTAGES DE CETTE APPROCHE

1. **Compatibilité Replit** : Structure simple qui s'importe facilement
2. **Meilleur des deux mondes** : Stabilité v2.4.0 + fonctionnalités v4.1
3. **Pas de régression** : Base v2.4.0 préservée
4. **Secteurs complets** : Enfin les allocations sectorielles !
5. **Maintenance facile** : Structure claire et documentée

