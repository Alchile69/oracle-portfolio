#!/bin/bash

# Script de push Oracle Portfolio v4.1 Replit-Ready
# Selon les procédures Git définies

echo "🚀 Oracle Portfolio v4.1 - Push vers GitHub v4.1-replit-ready"
echo "=============================================================="

# Configuration
REPO_URL="https://github.com/Alchile69/oracle-portfolio.git"
BRANCH_NAME="v4.1-replit-ready"
LOCAL_DIR="oracle-portfolio"

echo "📁 Étape 1: Clonage du repository"
echo "---------------------------------"

# Cloner le repository
if [ ! -d "$LOCAL_DIR" ]; then
    echo "🔄 Clonage du repository..."
    git clone $REPO_URL
else
    echo "📂 Repository déjà présent, mise à jour..."
    cd $LOCAL_DIR
    git fetch origin
    cd ..
fi

# Aller dans le répertoire
cd $LOCAL_DIR

echo "🌿 Étape 2: Basculer sur la branche v4.1-replit-ready"
echo "----------------------------------------------------"

# Basculer sur la branche
git checkout $BRANCH_NAME

echo "📋 Étape 3: Préparation des fichiers"
echo "------------------------------------"

echo "⚠️  MANUEL: Vous devez maintenant :"
echo "1. Extraire oracle-portfolio-v41-replit-ready.zip"
echo "2. Copier TOUS les fichiers de replit_clean/ dans ce dossier"
echo ""
echo "Fichiers à copier :"
echo "- package.json"
echo "- next.config.js"
echo "- tailwind.config.js"
echo "- tsconfig.json"
echo "- lib/ (dossier complet)"
echo "- components/ (dossier complet)"
echo "- hooks/ (dossier complet)"
echo "- pages/ (dossier complet)"
echo "- styles/ (dossier complet)"
echo "- README.md"
echo "- INSTALLATION.md"

# Attendre confirmation
read -p "✅ Appuyez sur Entrée quand tous les fichiers sont copiés..."

echo "🔍 Étape 4: Vérification des changements"
echo "----------------------------------------"

# Vérifier les changements (selon vos procédures)
git status

echo ""
echo "📋 Fichiers détectés:"
git status --short

echo ""
read -p "✅ Les fichiers ci-dessus sont-ils corrects ? (Entrée pour continuer)"

echo "➕ Étape 5: Ajout des fichiers"
echo "------------------------------"

# Ajouter tous les fichiers (selon vos procédures)
git add .

echo "✅ Tous les fichiers ajoutés"

echo "💾 Étape 6: Commit avec message descriptif"
echo "------------------------------------------"

# Commit avec message descriptif (selon vos procédures)
git commit -m "feat: Oracle Portfolio v4.1 Replit-Ready - Architecture complète

- Structure plate optimisée pour Replit
- Composants v4.1: AllocationChart, RegimeIndicator, SectorTable  
- Hooks avec vraies APIs (Node.js + Python backends)
- Types TypeScript complets pour secteurs et régimes
- Design Oracle Portfolio avec Tailwind CSS
- Documentation complète (README + INSTALLATION)
- Configuration Next.js 14 + TypeScript
- Auto-refresh toutes les 5 minutes
- Animations Framer Motion
- Responsive design mobile/desktop

Endpoints utilisés:
- Node.js: https://us-central1-oracle-portfolio-prod.cloudfunctions.net
- Python: https://vgh0i1cowmwm.manus.space

Prêt pour import Replit immédiat."

echo "✅ Commit créé avec succès"

echo "🚀 Étape 7: Push vers GitHub"
echo "----------------------------"

# Push vers GitHub (selon vos procédures)
git push origin $BRANCH_NAME

echo ""
echo "🎉 SUCCÈS !"
echo "==========="
echo "✅ La branche $BRANCH_NAME a été mise à jour sur GitHub"
echo ""
echo "🔗 URLs importantes:"
echo "📂 Repository: https://github.com/Alchile69/oracle-portfolio"
echo "🌿 Branche: https://github.com/Alchile69/oracle-portfolio/tree/$BRANCH_NAME"
echo ""
echo "🎯 Prochaines étapes:"
echo "1. Vérifier la branche sur GitHub"
echo "2. Importer dans Replit avec l'URL:"
echo "   https://github.com/Alchile69/oracle-portfolio/tree/$BRANCH_NAME"
echo "3. Tester l'application sur Replit"
echo ""
echo "🔥 Oracle Portfolio v4.1 Replit-Ready est maintenant disponible sur GitHub !"

# Retourner au répertoire parent
cd ..

