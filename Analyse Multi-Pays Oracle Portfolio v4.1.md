# Analyse Multi-Pays Oracle Portfolio v4.1

## 🌍 OBJECTIF : 15 PAYS EUROPÉENS

### 📊 **PAYS CIBLES**

1. **🇫🇷 France** (déjà configuré)
2. **🇩🇪 Allemagne** 
3. **🇮🇹 Italie**
4. **🇪🇸 Espagne**
5. **🇬🇧 Royaume-Uni**
6. **🇳🇱 Pays-Bas**
7. **🇧🇪 Belgique**
8. **🇦🇹 Autriche**
9. **🇵🇹 Portugal**
10. **🇸🇪 Suède**
11. **🇩🇰 Danemark**
12. **🇫🇮 Finlande**
13. **🇳🇴 Norvège**
14. **🇨🇭 Suisse**
15. **🇵🇱 Pologne**

## 🔍 **ÉTAT ACTUEL DES DONNÉES**

### ✅ **Secteurs Définis (11 secteurs)**
```typescript
TECHNOLOGY, HEALTHCARE, FINANCIALS, ENERGY, 
CONSUMER_DISCRETIONARY, CONSUMER_STAPLES, 
INDUSTRIALS, MATERIALS, UTILITIES, 
REAL_ESTATE, COMMUNICATION_SERVICES
```

### ✅ **Structure Pays Existante**
- `country: string` dans RegimeData
- Interface prête pour multi-pays
- Composant RegimeIndicator affiche déjà le pays

### ❌ **DONNÉES MANQUANTES PAR PAYS**

#### 1. **Allocations Sectorielles par Pays**
Chaque pays a des spécificités économiques :
- **Allemagne** : Fort secteur industriel et automobile
- **Pays-Bas** : Services financiers et énergie
- **Italie** : Luxe, mode, agroalimentaire
- **Espagne** : Tourisme, immobilier, énergie renouvelable
- **Suède** : Technologie, télécoms, matières premières

#### 2. **Indicateurs Économiques par Pays**
Sources de données spécifiques :
- **Électricité** : RTE (France), Terna (Italie), REE (Espagne)
- **PMI** : Markit par pays
- **Trafic Maritime** : Ports nationaux
- **Yields** : Obligations souveraines 10 ans
- **Spreads** : vs Bund allemand

#### 3. **Régimes Économiques par Pays**
Seuils différents selon l'économie :
- **Croissance** : Allemagne (2-4%), Pologne (3-6%)
- **Inflation** : Zone Euro vs hors zone euro
- **Chômage** : Niveaux structurels différents

## 🎯 **PLAN D'IMPLÉMENTATION**

### **Phase 1 : Structure Multi-Pays**
1. **Types TypeScript étendus**
   ```typescript
   interface CountryConfig {
     code: string;
     name: string;
     flag: string;
     currency: string;
     timezone: string;
     market: string;
   }
   ```

2. **Composant CountrySelector**
   - Dropdown avec drapeaux
   - Sauvegarde sélection utilisateur
   - Mise à jour automatique des données

### **Phase 2 : Données Sectorielles par Pays**
1. **Allocations par défaut par pays**
   ```typescript
   const COUNTRY_SECTOR_ALLOCATIONS = {
     'FR': { TECHNOLOGY: 15, HEALTHCARE: 12, ... },
     'DE': { INDUSTRIALS: 25, TECHNOLOGY: 18, ... },
     'IT': { FINANCIALS: 20, CONSUMER_DISCRETIONARY: 15, ... }
   }
   ```

2. **Caractéristiques économiques**
   - PIB par secteur
   - Indices boursiers principaux
   - Spécificités nationales

### **Phase 3 : Sources de Données par Pays**
1. **APIs nationales**
   - Banques centrales
   - Instituts statistiques
   - Opérateurs d'énergie

2. **Indicateurs adaptés**
   - Seuils de régimes ajustés
   - Pondérations spécifiques
   - Formules localisées

## 📋 **DONNÉES SECTORIELLES NÉCESSAIRES**

### **Allemagne 🇩🇪**
```typescript
{
  INDUSTRIALS: 28,      // Automobile, machines
  TECHNOLOGY: 18,       // SAP, Infineon
  FINANCIALS: 15,       // Deutsche Bank, Allianz
  HEALTHCARE: 12,       // Bayer, Merck
  MATERIALS: 10,        // BASF, Covestro
  ENERGY: 8,           // E.ON, RWE
  CONSUMER_DISCRETIONARY: 5,
  UTILITIES: 2,
  CONSUMER_STAPLES: 1,
  REAL_ESTATE: 1,
  COMMUNICATION_SERVICES: 0
}
```

### **Pays-Bas 🇳🇱**
```typescript
{
  FINANCIALS: 25,       // ING, ABN AMRO
  ENERGY: 20,          // Shell, TotalEnergies
  TECHNOLOGY: 15,       // ASML, Philips
  CONSUMER_STAPLES: 12, // Unilever, Heineken
  INDUSTRIALS: 10,      // Airbus, DSM
  HEALTHCARE: 8,        // Philips Healthcare
  UTILITIES: 5,         // Eneco
  MATERIALS: 3,
  CONSUMER_DISCRETIONARY: 2,
  REAL_ESTATE: 0,
  COMMUNICATION_SERVICES: 0
}
```

### **Italie 🇮🇹**
```typescript
{
  FINANCIALS: 22,       // Intesa Sanpaolo, UniCredit
  ENERGY: 18,          // Eni, Enel
  CONSUMER_DISCRETIONARY: 15, // Ferrari, Luxottica
  INDUSTRIALS: 12,      // Leonardo, Fincantieri
  UTILITIES: 10,        // Enel, Terna
  TECHNOLOGY: 8,        // STMicroelectronics
  HEALTHCARE: 7,        // DiaSorin
  MATERIALS: 5,         // Tenaris
  CONSUMER_STAPLES: 3,
  REAL_ESTATE: 0,
  COMMUNICATION_SERVICES: 0
}
```

## 🚀 **PROCHAINES ÉTAPES**

### **Étape 1 : Créer les Types Multi-Pays**
- Interface CountryConfig
- Types pour allocations par pays
- Enum des codes pays

### **Étape 2 : Composant CountrySelector**
- Dropdown avec drapeaux
- Gestion état global
- Persistance localStorage

### **Étape 3 : Données par Pays**
- Allocations sectorielles
- Seuils de régimes
- Sources d'indicateurs

### **Étape 4 : Intégration**
- Mise à jour hooks existants
- Adaptation composants
- Tests multi-pays

## ✅ **VALIDATION**

**Question clé :** Avons-nous besoin de données temps réel pour les 15 pays ou des allocations par défaut suffisent-elles ?

**Recommandation :** Commencer avec des allocations par défaut basées sur les indices nationaux, puis ajouter les APIs temps réel progressivement.

**Complexité estimée :** 2-3 heures pour l'implémentation complète.

