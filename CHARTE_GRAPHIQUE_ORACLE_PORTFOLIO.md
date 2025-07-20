# CHARTE GRAPHIQUE ORACLE PORTFOLIO
**Version 2.5.0 - Juillet 2025**

---

## 📋 PRÉSENTATION

Oracle Portfolio est une plateforme de gestion d'actifs intelligente offrant des outils d'allocation, de backtesting et d'analyse multi-pays. Cette charte graphique définit l'identité visuelle complète de l'application.

---

## 🎨 PALETTE DE COULEURS

### **Couleurs principales**
| Couleur | Code Hex | Usage |
|---------|----------|-------|
| **Noir profond** | `#0f0f23` | Arrière-plan principal |
| **Bleu nuit** | `#1a1a2e` | Arrière-plan secondaire |
| **Bleu électrique** | `#00d4ff` | Accents, liens, boutons |
| **Blanc pur** | `#ffffff` | Texte principal |

### **Couleurs secondaires**
| Couleur | Code Hex | Usage |
|---------|----------|-------|
| **Gris foncé** | `#2a2a3e` | Bordures, séparateurs |
| **Gris moyen** | `#4a4a5e` | Texte secondaire |
| **Vert succès** | `#00ff88` | Indicateurs positifs |
| **Rouge alerte** | `#ff4757` | Indicateurs négatifs, erreurs |
| **Orange warning** | `#ffa502` | Avertissements |

### **Dégradés**
```css
/* Dégradé principal */
background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);

/* Dégradé de fond */
background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%);
```

---

## 📝 TYPOGRAPHIE

### **Police principale**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### **Hiérarchie typographique**
| Élément | Taille | Poids | Couleur | Usage |
|---------|--------|-------|---------|-------|
| **H1** | `32px` | `700` | `#ffffff` | Titres principaux |
| **H2** | `24px` | `600` | `#ffffff` | Titres de section |
| **H3** | `20px` | `600` | `#ffffff` | Sous-titres |
| **H4** | `18px` | `500` | `#ffffff` | Titres de carte |
| **Body** | `16px` | `400` | `#ffffff` | Texte principal |
| **Small** | `14px` | `400` | `#4a4a5e` | Texte secondaire |
| **Caption** | `12px` | `400` | `#4a4a5e` | Légendes, notes |

---

## 📐 LAYOUT ET ESPACEMENT

### **Container principal**
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
```

### **Système de grille**
- **Colonnes** : 12 colonnes responsives
- **Gutters** : `20px`
- **Marges** : `20px` (mobile), `40px` (desktop)

### **Échelle d'espacement**
| Nom | Taille | Usage |
|-----|--------|-------|
| **XS** | `4px` | Espacement minimal |
| **S** | `8px` | Espacement interne |
| **M** | `16px` | Espacement standard |
| **L** | `24px` | Espacement de section |
| **XL** | `32px` | Espacement de bloc |
| **XXL** | `48px` | Espacement de page |

---

## 🧩 COMPOSANTS UI

### **Boutons**

#### Bouton principal
```css
.btn-primary {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### Bouton secondaire
```css
.btn-secondary {
  background: transparent;
  border: 2px solid #00d4ff;
  border-radius: 8px;
  padding: 10px 22px;
  color: #00d4ff;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #00d4ff;
  color: #ffffff;
}
```

### **Cartes**
```css
.card {
  background: #1a1a2e;
  border: 1px solid #2a2a3e;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.card-header {
  border-bottom: 1px solid #2a2a3e;
  padding-bottom: 16px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}
```

### **Navigation**
```css
.nav-tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #2a2a3e;
  margin-bottom: 24px;
}

.nav-tab {
  background: transparent;
  border: none;
  color: #4a4a5e;
  padding: 12px 20px;
  border-radius: 8px 8px 0 0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.nav-tab:hover {
  color: #00d4ff;
  background: rgba(0, 212, 255, 0.1);
}

.nav-tab.active {
  background: #00d4ff;
  color: #ffffff;
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #00d4ff;
}
```

### **Formulaires**
```css
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #ffffff;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: #2a2a3e;
  border: 1px solid #4a4a5e;
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

.form-input::placeholder {
  color: #4a4a5e;
}
```

---

## 📊 GRAPHIQUES ET VISUALISATIONS

### **Couleurs des graphiques**
```css
/* Palette pour les graphiques */
.chart-colors {
  --primary: #00d4ff;
  --secondary: #00ff88;
  --tertiary: #ffa502;
  --quaternary: #ff4757;
  --quinary: #9c88ff;
  --senary: #ff6b6b;
}
```

### **Style des graphiques**
- **Fond** : Transparent ou `#1a1a2e`
- **Grille** : `#2a2a3e` avec opacité 0.3
- **Texte** : `#ffffff` pour les labels
- **Bordures** : `#2a2a3e`
- **Animations** : Transitions fluides de 0.3s

---

## 📱 RESPONSIVE DESIGN

### **Breakpoints**
```css
/* Mobile */
@media (max-width: 767px) {
  .container { padding: 16px; }
  .nav-tabs { flex-direction: column; }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .container { padding: 24px; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { padding: 32px; }
}
```

### **Adaptations mobiles**
- **Navigation** : Menu hamburger
- **Grille** : 1 colonne sur mobile
- **Cartes** : Padding réduit
- **Boutons** : Taille adaptée au touch

---

## ⚡ ÉTATS ET INTERACTIONS

### **Transitions**
```css
/* Transition standard */
transition: all 0.3s ease;

/* Transition rapide */
transition: all 0.15s ease;

/* Transition lente */
transition: all 0.5s ease;
```

### **États de focus**
```css
.focus-visible {
  outline: 2px solid #00d4ff;
  outline-offset: 2px;
  border-radius: 4px;
}
```

### **États de chargement**
```css
.loading {
  position: relative;
  overflow: hidden;
}

.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.2), transparent);
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { left: -100%; }
  100% { left: 100%; }
}
```

---

## 🎯 ICÔNES ET VISUELS

### **Style d'icônes**
- **Famille** : Lucide React / Feather Icons
- **Taille standard** : `20px`
- **Couleur active** : `#00d4ff`
- **Couleur inactive** : `#4a4a5e`
- **Taille grande** : `24px` (pour les CTA)

### **Illustrations**
- **Style** : Minimaliste, moderne
- **Couleurs** : Palette cohérente
- **Format** : SVG préféré
- **Animations** : Subtiles et fluides

---

## ♿ ACCESSIBILITÉ

### **Contraste**
- **Ratio minimum** : 4.5:1
- **Ratio recommandé** : 7:1
- **Focus visible** : Toujours visible

### **Navigation clavier**
- **Tab order** : Logique et intuitif
- **Skip links** : Pour la navigation principale
- **ARIA labels** : Pour les éléments interactifs

### **Sémantique HTML**
```html
<!-- Structure recommandée -->
<nav role="navigation" aria-label="Navigation principale">
<main role="main">
<aside role="complementary">
<footer role="contentinfo">
```

---

## 📋 CHECKLIST D'IMPLÉMENTATION

### **À respecter impérativement**
- [ ] Utiliser uniquement la palette de couleurs définie
- [ ] Respecter la hiérarchie typographique
- [ ] Implémenter les états hover/focus
- [ ] Tester sur mobile et desktop
- [ ] Vérifier l'accessibilité
- [ ] Optimiser les performances

### **Technologies autorisées**
- ✅ HTML5 sémantique
- ✅ CSS3 (Grid, Flexbox, animations)
- ✅ JavaScript vanilla (ES6+)
- ✅ Chart.js ou D3.js pour les graphiques
- ❌ Pas de frameworks React/Vue/Angular
- ❌ Pas de build tools complexes

---

## 📞 CONTACT

**Pour toute question sur cette charte graphique :**
- **Projet** : Oracle Portfolio v2.5.0
- **Date** : Juillet 2025
- **Version** : 1.0

---

*Cette charte graphique garantit une interface moderne, cohérente et professionnelle pour Oracle Portfolio.* 