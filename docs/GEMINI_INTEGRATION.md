# Intégration Gemini API - Documentation

## 🎯 Vue d'ensemble

Ce système intègre l'API Gemini de Google pour analyser automatiquement les documents Google Drive et proposer des mises à jour de données avec validation manuelle.

## 🚀 Fonctionnalités

### 1. **Module Coordonnées Bancaires**
- Gestion complète des informations bancaires
- Interface intuitive avec statistiques
- Liaison avec les modules paiements et documents
- Intégration IA pour analyse automatique

### 2. **Analyse de Documents IA**
- Lecture automatique de documents Google Drive
- Extraction intelligente de données (IBAN, BIC, informations véhicule, etc.)
- Score de confiance pour chaque analyse
- Suggestions de mise à jour avec validation manuelle

### 3. **Système de Suggestions**
- Page dédiée aux suggestions IA
- Workflow d'approbation/rejet
- Historique des modifications
- Interface de gestion centralisée

## 🔧 Configuration

### 1. **Variables d'environnement**

Créez un fichier `.env.local` dans le répertoire racine :

```env
# Configuration Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Configuration Google Drive API (optionnel)
GOOGLE_DRIVE_API_KEY=your_google_drive_api_key_here
GOOGLE_DRIVE_CLIENT_ID=your_google_drive_client_id_here
```

### 2. **Obtenir une clé API Gemini**

1. Allez sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Générez une nouvelle clé API
4. Copiez la clé dans votre fichier `.env.local`

### 3. **Installation des dépendances**

```bash
npm install @google/generative-ai
```

## 📋 Utilisation

### 1. **Analyser un document**

1. Allez dans **Assurance > Coordonnées bancaires**
2. Cliquez sur **🤖 Analyser document**
3. Collez l'URL du document Google Drive
4. Sélectionnez le type de document
5. Cliquez sur **Analyser le document**

### 2. **Gérer les suggestions**

1. Allez dans **Suggestions IA**
2. Consultez les suggestions en attente
3. Approuvez ou rejetez les mises à jour
4. Visualisez les détails de chaque suggestion

### 3. **Types de documents supportés**

- **Coordonnées bancaires** : RIB, mandats SEPA, attestations bancaires
- **Informations véhicule** : Cartes grises, certificats d'immatriculation
- **Informations conducteur** : Permis de conduire, pièces d'identité
- **Informations contrat** : Contrats d'assurance, avenants
- **Informations sinistre** : Constats, rapports d'expertise

## 🏗️ Architecture

### Services

- **`GeminiDocumentService`** : Service principal pour l'analyse de documents
- **`DocumentAnalyzer`** : Composant React pour l'interface d'analyse
- **`AISuggestionsPage`** : Page de gestion des suggestions

### Flux de données

1. **Upload** : L'utilisateur fournit une URL Google Drive
2. **Analyse** : Gemini analyse le contenu du document
3. **Extraction** : Les données pertinentes sont extraites
4. **Suggestion** : Une suggestion de mise à jour est créée
5. **Validation** : L'utilisateur approuve ou rejette la suggestion
6. **Mise à jour** : Les données sont mises à jour dans le système

## 🔒 Sécurité

- Les clés API sont stockées côté serveur uniquement
- Validation manuelle obligatoire pour toutes les mises à jour
- Logs détaillés de toutes les opérations
- Gestion des erreurs robuste

## 📊 Monitoring

### Métriques disponibles

- Nombre total de suggestions
- Taux d'approbation/rejet
- Score de confiance moyen
- Temps de traitement des documents

### Logs

Tous les événements sont loggés :
- Analyse de documents
- Création de suggestions
- Approbations/rejets
- Erreurs d'analyse

## 🚨 Dépannage

### Erreurs courantes

1. **"Impossible de récupérer le contenu du document"**
   - Vérifiez que l'URL Google Drive est correcte
   - Assurez-vous que le document est accessible publiquement

2. **"Erreur lors de l'analyse du document"**
   - Vérifiez votre clé API Gemini
   - Vérifiez que le document contient du texte lisible

3. **"Document non reconnu"**
   - Le type de document n'est pas supporté
   - Le contenu ne correspond pas au format attendu

### Support

Pour toute question ou problème :
1. Consultez les logs dans la console
2. Vérifiez la configuration des variables d'environnement
3. Testez avec des documents simples d'abord

## 🔄 Mises à jour futures

### Fonctionnalités prévues

- Support de plus de types de documents
- Intégration avec d'autres APIs de stockage
- Amélioration de la précision d'extraction
- Interface de configuration avancée
- Notifications en temps réel

### Améliorations techniques

- Cache des analyses pour éviter les doublons
- Traitement par lots de documents
- API REST pour intégration externe
- Dashboard de monitoring avancé
