#!/bin/bash

# Script pour pousser Oracle Portfolio v4.1 Replit-Ready sur GitHub
# À exécuter depuis votre machine locale

echo "🚀 Oracle Portfolio v4.1 - Push vers GitHub"
echo "============================================="

# Configuration
REPO_URL="https://github.com/Alchile69/oracle-portfolio.git"
BRANCH_NAME="v4.1-replit-ready"
LOCAL_DIR="oracle-portfolio-v41-replit"

echo "📁 Étape 1: Préparation du répertoire local"
echo "-------------------------------------------"

# Créer un répertoire temporaire
mkdir -p $LOCAL_DIR
cd $LOCAL_DIR

# Initialiser git si pas déjà fait
if [ ! -d ".git" ]; then
    echo "🔧 Initialisation du repository Git..."
    git init
    git remote add origin $REPO_URL
fi

echo "📥 Étape 2: Récupération du repository"
echo "--------------------------------------"

# Récupérer les dernières modifications
git fetch origin

# Créer et basculer sur la nouvelle branche
echo "🌿 Création de la branche $BRANCH_NAME..."
git checkout -b $BRANCH_NAME

echo "📋 Étape 3: Copie des fichiers v4.1"
echo "-----------------------------------"

# Ici vous devez extraire le ZIP et copier les fichiers
echo "⚠️  MANUEL: Extrayez oracle-portfolio-v41-replit-ready.zip dans ce dossier"
echo "⚠️  MANUEL: Copiez tous les fichiers du dossier replit_clean/ ici"

# Attendre confirmation
read -p "✅ Appuyez sur Entrée quand les fichiers sont copiés..."

echo "📝 Étape 4: Ajout des fichiers au Git"
echo "-------------------------------------"

# Ajouter tous les fichiers
git add .

# Vérifier les fichiers ajoutés
echo "📋 Fichiers qui seront committés:"
git status --short

echo "💾 Étape 5: Commit des modifications"
echo "-----------------------------------"

# Commit avec message descriptif
git commit -m "feat: Add Oracle Portfolio v4.1 Replit-Ready

✨ Features:
- Complete v4.1 architecture with flat structure for Replit
- Real API endpoints (no mock data)
- Advanced components: AllocationChart, RegimeIndicator, SectorTable
- TypeScript types for sectors and regimes
- Oracle Portfolio design with Tailwind CSS
- Auto-refresh every 5 minutes
- Framer Motion animations
- Responsive design

🔧 Technical:
- Next.js 14 with TypeScript
- Tailwind CSS with custom Oracle theme
- Recharts for data visualization
- Real API integration (/api/current-regime, /api/sectors)
- Error handling and loading states

📚 Documentation:
- Complete README.md
- Installation guide for Replit
- TypeScript documentation
- API endpoint specifications

🎯 Ready for:
- Replit import (ZIP or GitHub)
- Local development
- Production deployment on VPS"

echo "🚀 Étape 6: Push vers GitHub"
echo "----------------------------"

# Push de la nouvelle branche
git push -u origin $BRANCH_NAME

echo "✅ TERMINÉ!"
echo "==========="
echo "🎉 La branche $BRANCH_NAME a été créée sur GitHub!"
echo "🔗 URL: https://github.com/Alchile69/oracle-portfolio/tree/$BRANCH_NAME"
echo ""
echo "🎯 Prochaines étapes:"
echo "1. Vérifiez la branche sur GitHub"
echo "2. Importez dans Replit avec cette URL:"
echo "   https://github.com/Alchile69/oracle-portfolio/tree/$BRANCH_NAME"
echo "3. Testez l'application sur Replit"
echo ""
echo "🔥 Oracle Portfolio v4.1 Replit-Ready est maintenant disponible!"

