# 🏢 Plateforme Multisite - Gestion d'Interlocuteurs

Une plateforme complète de gestion d'interlocuteurs avec système de modules modulaires et liaisons intelligentes.

## 🚀 Fonctionnalités Principales

### 👥 Gestion d'Interlocuteurs
- **Création et gestion** d'interlocuteurs (utilisateurs internes et externes)
- **Profils détaillés** avec informations complètes
- **Système d'authentification** intégré
- **Statistiques** en temps réel

### 🔗 Système de Modules Modulaires
- **Sinistres** : Gestion complète des réclamations d'assurance
- **Véhicules** : Suivi des véhicules assurés
- **Conducteurs** : Gestion des permis et conducteurs
- **Contrats** : Suivi des contrats d'assurance
- **Demandes d'Assurance** : Pipeline de traitement
- **Événements** : Historique des interactions
- **Famille** : Gestion des membres de famille
- **Entreprise** : Relations professionnelles

### 🔄 Liaisons Intelligentes
- **Transfert de modules** entre interlocuteurs
- **Liaison automatique** des conducteurs salariés
- **Création automatique** de fiches interlocuteurs
- **Persistance** des données avec localStorage

### 🎨 Interface Utilisateur
- **Design moderne** avec Tailwind CSS
- **Layout responsive** adaptatif
- **Sidebar d'événements** configurable
- **Modules optimisés** pour l'espace
- **Gradients et animations** fluides

## 🛠️ Technologies Utilisées

- **Frontend** : Next.js 14, React 18, TypeScript
- **Styling** : Tailwind CSS
- **État** : React Context API
- **Stockage** : localStorage (mode développement)
- **Authentification** : Système personnalisé

## 📁 Structure du Projet

```
multisite-platform/
├── src/
│   ├── app/                    # Pages Next.js
│   │   ├── dashboard/         # Interface principale
│   │   │   ├── interlocutors/ # Gestion des interlocuteurs
│   │   │   └── ...
│   │   ├── external/          # Pages publiques
│   │   └── login/             # Authentification
│   ├── components/            # Composants React
│   │   ├── auth/             # Authentification
│   │   ├── dashboard/        # Interface dashboard
│   │   ├── ui/               # Composants UI
│   │   └── ...
│   ├── contexts/             # Contextes React
│   ├── lib/                  # Services et utilitaires
│   └── types/                # Types TypeScript
├── public/                   # Assets statiques
└── docs/                    # Documentation
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone <url-du-repo>
cd multisite-platform

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### Accès
- **Application** : http://localhost:3000
- **Dashboard** : http://localhost:3000/dashboard
- **Login** : http://localhost:3000/login

## 🔧 Configuration

### Variables d'Environnement
Créer un fichier `.env.local` :
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Authentification
Le système utilise un contexte d'authentification minimal :
- **Utilisateur par défaut** : admin@example.com
- **Token** : stocké dans localStorage
- **Sessions** : persistantes entre les rechargements

## 📊 Modules Disponibles

### 🚨 Sinistres
- Types : RC100, RC50, RC25, RC0, bris de glace, vol, incendie
- Responsabilité et pourcentage
- Statuts : En cours, Résolu, Refusé, En attente

### 🚗 Véhicules
- Informations complètes (marque, modèle, année)
- Types : Voiture, Utilitaire, Moto, Camion
- Statuts : Assuré, En attente, Expiré

### 👤 Conducteurs
- Permis et types de conduite
- Statuts : Actif, En attente, Expiré
- **Liaison automatique** avec les entreprises

### 📄 Contrats
- Types : Assurance, Transport, Maintenance
- Numéros de contrat/devis
- Chargés d'affaires assignés

### 📋 Demandes d'Assurance
- Pipeline complet de traitement
- Priorités et assignations
- Suivi des montants

### 📅 Événements
- Types : Appel, Email, Réunion, Tâche, Note, Document
- Participants et pièces jointes
- URLs et liens externes
- Priorités et statuts

### 👨‍👩‍👧‍👦 Famille
- Relations : Conjoint, Enfant, Parent, Frère/Sœur
- Bénéficiaires et contacts d'urgence
- Informations complètes

### 🏢 Entreprise
- Rôles : Salarié, Associé, Dirigeant, Actionnaire
- Positions et départements
- Relations actives/inactives

## 🔄 Système de Liaisons

### Transfert de Modules
- **Lier** : Déplacer un module vers un autre interlocuteur
- **Délier** : Retirer un module de l'interlocuteur actuel
- **Persistance** : Sauvegarde automatique des changements

### Liaisons Automatiques
- **Conducteurs salariés** → Création automatique de fiche interlocuteur
- **Membres de famille** → Liaison logique avec l'interlocuteur principal
- **Relations d'entreprise** → Gestion des rôles et positions

## 🎨 Interface et UX

### Layout Responsive
- **Desktop** : Sidebar d'événements + modules principaux
- **Mobile** : Layout empilé optimisé
- **Tablet** : Adaptation fluide

### Optimisations
- **Espace réduit** : Modules compacts et efficaces
- **Navigation fluide** : Transitions et animations
- **Feedback visuel** : États de chargement et confirmations

## 🧪 Données de Test

Le projet inclut des données mockées complètes :
- **Jean Dupont** : Client avec tous les modules
- **Marie Martin** : Utilisateur interne
- **Données réalistes** : Sinistres, véhicules, contrats, etc.

## 🔮 Roadmap

### Fonctionnalités Prévues
- [ ] **API Backend** : Remplacement du localStorage
- [ ] **Base de données** : PostgreSQL/MongoDB
- [ ] **Authentification** : OAuth2/JWT
- [ ] **Notifications** : Système de notifications temps réel
- [ ] **Rapports** : Génération de rapports PDF
- [ ] **Import/Export** : Données CSV/Excel
- [ ] **Audit** : Logs des modifications
- [ ] **Permissions** : Système de rôles avancé

### Améliorations Techniques
- [ ] **Tests** : Tests unitaires et d'intégration
- [ ] **Performance** : Optimisation des requêtes
- [ ] **Sécurité** : Validation et sanitisation
- [ ] **Monitoring** : Logs et métriques
- [ ] **CI/CD** : Pipeline de déploiement

## 🤝 Contribution

### Guidelines
1. **Fork** le repository
2. **Créer** une branche feature
3. **Commiter** les changements
4. **Pousser** vers la branche
5. **Créer** une Pull Request

### Standards
- **Code** : TypeScript strict
- **Style** : ESLint + Prettier
- **Commits** : Messages descriptifs
- **Tests** : Couverture minimale

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

Développé avec ❤️ pour la gestion moderne d'interlocuteurs.

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2025  
**Statut** : En développement actif