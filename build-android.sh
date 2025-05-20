#!/bin/bash

# Script pour construire l'application Android

# Étape 1: Construire la version de production de l'application React
echo "Construction de la version de production..."
npm run build

# Étape 2: Initialiser Capacitor avec Android
echo "Initialisation de Capacitor avec Android..."
npx cap init gYS com.youssoufapp.gys --web-dir=dist
npx cap add android

# Étape 3: Copier les assets web mis à jour vers la plateforme native
echo "Copie des fichiers web vers Android..."
npx cap copy android

# Étape 4: Ouvrir Android Studio pour finaliser la compilation
echo "Configuration terminée!"
echo "==================================================="
echo "Pour finir de construire l'APK:"
echo "1. Téléchargez le dossier 'android' complet de ce projet"
echo "2. Ouvrez-le dans Android Studio sur votre ordinateur"
echo "3. Cliquez sur Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo "4. Une fois l'APK généré, transférez-le sur votre téléphone et installez-le"
echo "==================================================="