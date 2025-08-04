#!/bin/bash

echo "🚀 DÉPLOIEMENT VERCEL - ORACLE PORTFOLIO v2.5.0"
echo "================================================"

# 1. Nettoyage
echo "🧹 Nettoyage des caches..."
rm -rf node_modules package-lock.json .vite dist

# 2. Installation avec legacy peer deps
echo "📦 Installation des dépendances..."
npm install --legacy-peer-deps

# 3. Test de build local
echo "🔨 Test de build local..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build local réussi !"
    
    # 4. Commit et push
    echo "📤 Commit et push vers GitHub..."
    git add .
    git commit -m "fix: compatibilité Vercel - date-fns v3.6.0"
    git push origin backup-v2.5-full-fonctionnelle
    
    echo "🎉 Déploiement déclenché sur Vercel !"
    echo "📋 URL: https://oracle-portfolio-backup-v25.vercel.app"
else
    echo "❌ Build local échoué ! Vérifiez les erreurs ci-dessus."
    exit 1
fi

