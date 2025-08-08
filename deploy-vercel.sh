#!/bin/bash

echo "🚀 Déploiement Oracle Portfolio sur Vercel..."

# Vérification des fichiers critiques
echo "📋 Vérification des fichiers critiques..."

if [ ! -f "public/site.webmanifest" ]; then
    echo "❌ Fichier site.webmanifest manquant dans public/"
    exit 1
fi

if [ ! -f "public/sw.js" ]; then
    echo "❌ Fichier sw.js manquant dans public/"
    exit 1
fi

if [ ! -f "vercel.json" ]; then
    echo "❌ Fichier vercel.json manquant"
    exit 1
fi

echo "✅ Tous les fichiers critiques sont présents"

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

# Build du projet
echo "🔨 Build du projet..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

# Vérification du build
echo "🔍 Vérification du build..."
if [ ! -d "dist" ]; then
    echo "❌ Dossier dist manquant après le build"
    exit 1
fi

# Vérification des fichiers dans dist
if [ ! -f "dist/site.webmanifest" ]; then
    echo "⚠️  site.webmanifest manquant dans dist/, copie depuis public/"
    cp public/site.webmanifest dist/
fi

if [ ! -f "dist/sw.js" ]; then
    echo "⚠️  sw.js manquant dans dist/, copie depuis public/"
    cp public/sw.js dist/
fi

# Déploiement sur Vercel
echo "🌐 Déploiement sur Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi!"
    echo "🔗 Votre application est maintenant en ligne"
    echo "📱 Service Worker et manifest configurés"
    echo "🛡️  Headers de sécurité appliqués"
else
    echo "❌ Erreur lors du déploiement"
    exit 1
fi

echo "🎉 Déploiement terminé avec succès!" 