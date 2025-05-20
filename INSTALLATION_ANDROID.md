# Guide d'installation de l'application gYS sur Android

## Méthode 1: Via le serveur web (plus simple)

Pour cette méthode, vous devez déployer l'application:

1. Cliquez sur le bouton "Run" dans Replit pour démarrer l'application
2. À partir de votre téléphone Android, ouvrez Google Chrome
3. Accédez à l'URL de l'application (que Replit vous indiquera après le déploiement)
4. Dans Chrome, ouvrez le menu (trois points verticaux en haut à droite)
5. Sélectionnez "Ajouter à l'écran d'accueil"
6. Donnez un nom à l'application (par exemple "gYS") et confirmez
7. Vous aurez maintenant une icône sur votre écran d'accueil qui lancera l'application dans une vue plein écran

Cette méthode crée une PWA (Progressive Web App) qui fonctionne hors ligne et ressemble à une application native.

## Méthode 2: Création d'un APK natif (plus complet)

Si vous préférez une application Android native complète (APK), voici les étapes:

### Prérequis
- Un ordinateur avec Android Studio installé
- JDK (Java Development Kit) version 11 ou supérieure
- Git installé sur votre ordinateur

### Étapes

1. Clonez ce projet Replit sur votre ordinateur:
   ```bash
   git clone <URL_DU_PROJET>
   cd <NOM_DU_DOSSIER>
   ```

2. Installez les dépendances:
   ```bash
   npm install
   ```

3. Construisez l'application et initialisez Capacitor:
   ```bash
   npm run build
   npx cap init gYS com.youssoufapp.gys --web-dir=dist
   npx cap add android
   npx cap copy android
   ```

4. Ouvrez le projet Android dans Android Studio:
   ```bash
   npx cap open android
   ```

5. Dans Android Studio:
   - Attendez que la synchronisation Gradle se termine
   - Allez dans Build > Build Bundle(s) / APK(s) > Build APK(s)
   - Une fois l'APK généré, Android Studio vous montrera où il est sauvegardé

6. Transférez ce fichier APK sur votre téléphone Android (par email, WhatsApp, USB, etc.)

7. Sur votre téléphone Android:
   - Ouvrez le fichier APK
   - Si demandé, autorisez l'installation d'applications de sources inconnues
   - Suivez les instructions pour compléter l'installation

Votre application gYS sera maintenant installée sur votre téléphone et fonctionnera comme une application native.

## Remarques

- L'application native (APK) permet une meilleure intégration avec les fonctionnalités de l'appareil
- La PWA est plus facile à déployer et à mettre à jour
- Les deux méthodes permettent d'utiliser l'application hors-ligne après le premier chargement