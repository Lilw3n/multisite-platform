# 🤖 Implémentation de l'Import Automatique avec Gemini AI

## 📋 Vue d'ensemble

Ce document décrit l'implémentation future de l'import automatique de données de chauffeurs via Google Gemini AI.

## 🎯 Objectifs

- **Extraction automatique** de données depuis des documents PDF
- **Intégration Google Drive** pour l'accès aux fichiers
- **Validation intelligente** des données extraites
- **Interface utilisateur** intuitive pour les interlocuteurs

## 🏗️ Architecture

### Services
- `GeminiImportService` : Service principal d'extraction
- `DriverImportModal` : Interface utilisateur React
- `ValidationService` : Validation des données extraites

### APIs Requises
- **Google Gemini API** : Analyse de documents
- **Google Drive API** : Accès aux fichiers
- **OCR Service** : Reconnaissance de texte (optionnel)

## 🔧 Implémentation

### 1. Configuration Gemini

```typescript
// .env.local
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
GOOGLE_DRIVE_API_KEY=your_drive_api_key
```

### 2. Installation des dépendances

```bash
npm install @google/generative-ai
npm install googleapis
```

### 3. Implémentation du service

```typescript
// src/lib/geminiImport.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiImportService {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async extractDriverDataFromPDF(file: File): Promise<ImportedDriverData> {
    // 1. Convertir PDF en texte
    const text = await this.extractTextFromPDF(file);
    
    // 2. Analyser avec Gemini
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const prompt = this.generatePrompt('assurance');
    
    const result = await model.generateContent([prompt, text]);
    const response = await result.response;
    const jsonText = response.text();
    
    // 3. Parser et valider
    const data = JSON.parse(jsonText);
    return this.validateAndCleanData(data);
  }
}
```

### 4. Intégration dans l'interface

```typescript
// src/app/dashboard/insurance/drivers/page.tsx
import DriverImportModal from '@/components/DriverImportModal';

export default function DriversPage() {
  const [showImportModal, setShowImportModal] = useState(false);

  const handleImport = (data: ImportedDriverData) => {
    // Créer un nouveau chauffeur avec les données importées
    createDriver(data);
  };

  return (
    <div>
      <button onClick={() => setShowImportModal(true)}>
        🤖 Import Automatique
      </button>
      
      <DriverImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
      />
    </div>
  );
}
```

## 📊 Types de Documents Supportés

### 1. Contrats d'Assurance
- **AXA, Groupama, MACIF, etc.**
- **Extraction** : Périodes, primes, CRM, numéros de police
- **Validation** : Dates, montants, formats

### 2. Attestations de Sinistres
- **Types** : Matériel RC, Corporel RC, Bris de glace, Vol
- **Extraction** : Dates, montants, responsabilités
- **Validation** : Cohérence des données

### 3. Documents de Résiliation
- **Extraction** : Raisons, dates, durées
- **Validation** : Périodes de trous d'assurance

## 🎨 Interface Utilisateur

### Modal d'Import
- **Sélection de méthode** : PDF ou Google Drive
- **Upload de fichiers** : Drag & drop
- **Aperçu des données** : Validation en temps réel
- **Correction manuelle** : Édition des données extraites

### Validation Visuelle
- **Erreurs critiques** : Données manquantes
- **Avertissements** : Données suspectes
- **Suggestions** : Corrections automatiques

## 🔍 Exemples de Prompts Gemini

### Contrat d'Assurance
```
Analyse ce contrat d'assurance et extrais :
- Informations du chauffeur (nom, prénom, permis)
- Périodes de couverture (début, fin)
- Montant des primes
- Numéro de police
- Compagnie d'assurance
- Coefficient CRM si mentionné

Format de sortie : JSON structuré
```

### Attestation de Sinistre
```
Analyse cette attestation de sinistre et extrais :
- Date du sinistre
- Type de sinistre (matériel/corporel)
- Montant des dommages
- Pourcentage de responsabilité
- Compagnie d'assurance

Format de sortie : JSON structuré
```

## 🚀 Roadmap d'Implémentation

### Phase 1 : Base (2-3 semaines)
- [ ] Configuration Gemini API
- [ ] Service d'extraction basique
- [ ] Interface d'upload PDF
- [ ] Validation des données

### Phase 2 : Avancé (3-4 semaines)
- [ ] Intégration Google Drive
- [ ] OCR pour documents scannés
- [ ] Correction manuelle des données
- [ ] Historique des imports

### Phase 3 : Intelligence (4-5 semaines)
- [ ] Apprentissage des patterns
- [ ] Suggestions automatiques
- [ ] Validation croisée des données
- [ ] Export des données importées

## 🔒 Sécurité et Confidentialité

### Données Sensibles
- **Chiffrement** des fichiers uploadés
- **Suppression automatique** après traitement
- **Logs d'audit** des imports
- **Permissions granulaires** par interlocuteur

### Conformité RGPD
- **Consentement explicite** pour l'import
- **Droit à l'effacement** des données
- **Transparence** des traitements
- **Sécurisation** des accès

## 📈 Métriques et Monitoring

### Performance
- **Temps d'extraction** par document
- **Taux de réussite** de l'extraction
- **Précision** des données extraites
- **Erreurs** et corrections manuelles

### Usage
- **Nombre d'imports** par interlocuteur
- **Types de documents** les plus fréquents
- **Temps d'économie** par import
- **Satisfaction utilisateur**

## 🛠️ Maintenance et Support

### Monitoring
- **Logs détaillés** des extractions
- **Alertes** en cas d'erreur
- **Métriques** de performance
- **Rapports** d'utilisation

### Support Utilisateur
- **Documentation** complète
- **Formation** des interlocuteurs
- **Support technique** dédié
- **FAQ** et guides

## 💡 Améliorations Futures

### Intelligence Artificielle
- **Apprentissage continu** des patterns
- **Amélioration automatique** des prompts
- **Détection d'anomalies** dans les données
- **Prédiction** des erreurs

### Intégrations
- **APIs externes** (assureurs, préfectures)
- **Synchronisation** avec les systèmes existants
- **Export** vers d'autres plateformes
- **Webhooks** pour notifications

---

*Ce document sera mis à jour au fur et à mesure de l'implémentation des fonctionnalités.*
