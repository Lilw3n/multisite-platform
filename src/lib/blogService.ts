import { BlogPost, BlogCategory, BlogAuthor } from '@/types/blog';

export class BlogService {
  private static readonly STORAGE_KEY = 'blog_posts';
  private static readonly CATEGORIES_KEY = 'blog_categories';

  // Charger tous les articles
  static loadPosts(): BlogPost[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultPosts();
    } catch (error) {
      console.error('Erreur chargement articles:', error);
      return this.getDefaultPosts();
    }
  }

  // Obtenir les catégories
  static getCategories(): BlogCategory[] {
    return [
      {
        id: 'assurance',
        name: 'Assurance',
        slug: 'assurance',
        description: 'Conseils et guides pour bien s\'assurer',
        icon: '🛡️',
        color: 'blue',
        seo: {
          title: 'Blog Assurance - Conseils d\'Expert Courtier',
          description: 'Découvrez nos conseils d\'expert en assurance. Guides pratiques pour particuliers et professionnels.',
          keywords: ['assurance', 'courtier', 'protection', 'garanties', 'sinistre']
        },
        subcategories: [
          {
            id: 'auto',
            name: 'Assurance Auto',
            slug: 'assurance-auto',
            description: 'Tout sur l\'assurance automobile',
            keywords: ['assurance auto', 'véhicule', 'malus', 'bonus', 'sinistre auto']
          },
          {
            id: 'habitation',
            name: 'Assurance Habitation',
            slug: 'assurance-habitation',
            description: 'Protégez votre logement efficacement',
            keywords: ['assurance habitation', 'logement', 'dégât des eaux', 'vol', 'incendie']
          },
          {
            id: 'pro',
            name: 'Assurance Professionnelle',
            slug: 'assurance-professionnelle',
            description: 'Solutions pour les entreprises et indépendants',
            keywords: ['assurance pro', 'RC pro', 'multirisque', 'entreprise', 'artisan']
          }
        ],
        targetKeywords: ['courtier assurance', 'conseil assurance', 'comparateur assurance']
      },
      {
        id: 'immobilier',
        name: 'Immobilier',
        slug: 'immobilier',
        description: 'Investissement et négociation immobilière',
        icon: '🏠',
        color: 'green',
        seo: {
          title: 'Blog Immobilier - Conseils Négociateur Expert',
          description: 'Conseils immobiliers d\'un négociateur professionnel. Achat, vente, investissement.',
          keywords: ['immobilier', 'négociateur', 'investissement', 'achat', 'vente']
        },
        subcategories: [
          {
            id: 'achat',
            name: 'Achat Immobilier',
            slug: 'achat-immobilier',
            description: 'Guide complet pour acheter sereinement',
            keywords: ['achat immobilier', 'primo-accédant', 'crédit', 'notaire', 'compromis']
          },
          {
            id: 'vente',
            name: 'Vente Immobilier',
            slug: 'vente-immobilier',
            description: 'Optimiser la vente de votre bien',
            keywords: ['vente immobilier', 'estimation', 'home staging', 'négociation', 'mandat']
          },
          {
            id: 'investissement',
            name: 'Investissement Locatif',
            slug: 'investissement-locatif',
            description: 'Stratégies d\'investissement rentables',
            keywords: ['investissement locatif', 'rentabilité', 'LMNP', 'Pinel', 'déficit foncier']
          }
        ],
        targetKeywords: ['négociateur immobilier', 'conseil immobilier', 'expert immobilier']
      },
      {
        id: 'finance',
        name: 'Finance',
        slug: 'finance',
        description: 'Gestion financière et investissements',
        icon: '💰',
        color: 'yellow',
        seo: {
          title: 'Blog Finance - Conseils Financiers d\'Expert',
          description: 'Conseils financiers pour particuliers et professionnels. Épargne, crédit, investissement.',
          keywords: ['finance', 'épargne', 'crédit', 'investissement', 'fiscalité']
        },
        subcategories: [
          {
            id: 'epargne',
            name: 'Épargne & Placements',
            slug: 'epargne-placements',
            description: 'Optimiser son épargne et ses placements',
            keywords: ['épargne', 'livret A', 'assurance vie', 'PEA', 'placements']
          },
          {
            id: 'credit',
            name: 'Crédit & Financement',
            slug: 'credit-financement',
            description: 'Tout sur les crédits et financements',
            keywords: ['crédit immobilier', 'prêt personnel', 'rachat crédit', 'taux', 'TAEG']
          },
          {
            id: 'fiscalite',
            name: 'Fiscalité',
            slug: 'fiscalite',
            description: 'Optimisation fiscale légale',
            keywords: ['impôts', 'déclaration', 'réduction fiscale', 'IFI', 'plus-value']
          }
        ],
        targetKeywords: ['conseiller financier', 'gestion patrimoine', 'optimisation fiscale']
      },
      {
        id: 'e-commerce',
        name: 'E-commerce',
        slug: 'e-commerce',
        description: 'Stratégies de vente en ligne',
        icon: '🛒',
        color: 'purple',
        seo: {
          title: 'Blog E-commerce - Stratégies de Vente en Ligne',
          description: 'Conseils e-commerce pour développer votre business en ligne. Dropshipping, marketing digital.',
          keywords: ['e-commerce', 'boutique en ligne', 'dropshipping', 'marketing digital', 'conversion']
        },
        subcategories: [
          {
            id: 'creation',
            name: 'Création Boutique',
            slug: 'creation-boutique',
            description: 'Lancer sa boutique en ligne',
            keywords: ['créer boutique en ligne', 'Shopify', 'WooCommerce', 'PrestaShop', 'e-commerce']
          },
          {
            id: 'marketing',
            name: 'Marketing Digital',
            slug: 'marketing-digital',
            description: 'Attirer et convertir vos visiteurs',
            keywords: ['marketing digital', 'SEO', 'Google Ads', 'Facebook Ads', 'conversion']
          },
          {
            id: 'dropshipping',
            name: 'Dropshipping',
            slug: 'dropshipping',
            description: 'Vendre sans stock',
            keywords: ['dropshipping', 'fournisseur', 'AliExpress', 'marge', 'automatisation']
          }
        ],
        targetKeywords: ['expert e-commerce', 'consultant digital', 'formation e-commerce']
      },
      {
        id: 'streaming',
        name: 'Streaming & Création',
        slug: 'streaming-creation',
        description: 'Monétiser sa passion créative',
        icon: '🎥',
        color: 'red',
        seo: {
          title: 'Blog Streaming - Monétiser sa Créativité en Ligne',
          description: 'Conseils pour devenir créateur de contenu. Streaming, YouTube, TikTok, monétisation.',
          keywords: ['streaming', 'créateur contenu', 'monétisation', 'YouTube', 'TikTok']
        },
        subcategories: [
          {
            id: 'twitch',
            name: 'Twitch & Gaming',
            slug: 'twitch-gaming',
            description: 'Réussir sur Twitch et les plateformes gaming',
            keywords: ['Twitch', 'streaming gaming', 'OBS', 'donations', 'communauté']
          },
          {
            id: 'youtube',
            name: 'YouTube',
            slug: 'youtube',
            description: 'Développer sa chaîne YouTube',
            keywords: ['YouTube', 'monétisation YouTube', 'algorithme', 'miniatures', 'SEO YouTube']
          },
          {
            id: 'tiktok',
            name: 'TikTok & Réseaux',
            slug: 'tiktok-reseaux',
            description: 'Percer sur TikTok et les réseaux sociaux',
            keywords: ['TikTok', 'viral', 'réseaux sociaux', 'influence', 'brand deals']
          }
        ],
        targetKeywords: ['expert streaming', 'formation créateur', 'monétisation contenu']
      },
      {
        id: 'gaming',
        name: 'Gaming & Anime',
        slug: 'gaming-anime',
        description: 'Passion gaming et culture anime',
        icon: '🎮',
        color: 'indigo',
        seo: {
          title: 'Blog Gaming & Anime - Culture Geek Passionnée',
          description: 'Actualités gaming et anime. Reviews, guides, culture geek par un passionné.',
          keywords: ['gaming', 'anime', 'jeux vidéo', 'manga', 'culture geek']
        },
        subcategories: [
          {
            id: 'reviews',
            name: 'Tests & Reviews',
            slug: 'tests-reviews',
            description: 'Tests de jeux et animes',
            keywords: ['test jeu vidéo', 'review anime', 'critique', 'note', 'gameplay']
          },
          {
            id: 'guides',
            name: 'Guides & Astuces',
            slug: 'guides-astuces',
            description: 'Guides pour progresser dans vos jeux favoris',
            keywords: ['guide gaming', 'soluce', 'astuces', 'walkthrough', 'tips']
          },
          {
            id: 'culture',
            name: 'Culture Geek',
            slug: 'culture-geek',
            description: 'Actualités et culture gaming/anime',
            keywords: ['actualité gaming', 'news anime', 'culture geek', 'événements', 'conventions']
          }
        ],
        targetKeywords: ['blog gaming', 'passionné anime', 'culture geek']
      },
      {
        id: 'sport',
        name: 'Sport & Bien-être',
        slug: 'sport-bien-etre',
        description: 'Conseils sportifs et lifestyle',
        icon: '⚽',
        color: 'orange',
        seo: {
          title: 'Blog Sport & Bien-être - Conseils d\'un Passionné',
          description: 'Conseils sport et bien-être. Fitness, nutrition, motivation par un sportif passionné.',
          keywords: ['sport', 'fitness', 'nutrition', 'bien-être', 'motivation']
        },
        subcategories: [
          {
            id: 'fitness',
            name: 'Fitness & Musculation',
            slug: 'fitness-musculation',
            description: 'Programmes et conseils fitness',
            keywords: ['fitness', 'musculation', 'programme', 'exercices', 'salle de sport']
          },
          {
            id: 'nutrition',
            name: 'Nutrition Sportive',
            slug: 'nutrition-sportive',
            description: 'Alimentation pour sportifs',
            keywords: ['nutrition sportive', 'protéines', 'régime', 'compléments', 'performance']
          },
          {
            id: 'motivation',
            name: 'Motivation & Mental',
            slug: 'motivation-mental',
            description: 'Développement personnel et motivation',
            keywords: ['motivation sport', 'mental', 'objectifs', 'discipline', 'mindset']
          }
        ],
        targetKeywords: ['coach sportif', 'conseils fitness', 'motivation sport']
      }
    ];
  }

  // Articles par défaut avec contenu riche pour SEO
  private static getDefaultPosts(): BlogPost[] {
    return [
      {
        id: 'assurance-auto-2024',
        title: 'Assurance Auto 2024 : Le Guide Complet du Courtier pour Économiser',
        slug: 'assurance-auto-2024-guide-courtier-economiser',
        excerpt: 'Découvrez les secrets d\'un courtier pour choisir la meilleure assurance auto en 2024. Comparatifs, astuces et négociation pour particuliers et professionnels.',
        content: `# Assurance Auto 2024 : Le Guide Complet du Courtier

En tant que **courtier en assurance agréé ORIAS**, je vous révèle aujourd'hui tous les secrets pour choisir la meilleure assurance auto en 2024 et **économiser jusqu'à 40% sur vos cotisations**.

## 🎯 Pour qui est ce guide ?
- **Particuliers** : Conducteurs novices, expérimentés, malussés
- **Professionnels** : VTC, taxis, artisans, commerciaux
- **Entreprises** : Flottes automobiles, véhicules de fonction

## 💡 Les 5 Erreurs à Éviter Absolument

### 1. Choisir uniquement sur le prix
Beaucoup de mes clients arrivent avec des contrats "pas chers" mais découvrent les exclusions au moment du sinistre...

### 2. Négliger les garanties optionnelles
La **garantie du conducteur** peut vous sauver financièrement en cas d'accident responsable.

## 🔍 Ma Méthode de Courtier en 7 Étapes

### Étape 1 : Analyse de votre profil
- Âge et expérience de conduite
- Historique de sinistralité
- Usage du véhicule (personnel/professionnel)
- Zone géographique

### Étape 2 : Définition des besoins réels
Pas de sur-assurance, pas de sous-assurance !

## 💰 Mes Astuces d'Expert pour Économiser

### Pour les Particuliers :
- **Astuce #1** : Négocier le bonus-malus à la souscription
- **Astuce #2** : Grouper vos contrats (auto + habitation = -15%)
- **Astuce #3** : Choisir une franchise adaptée à votre budget

### Pour les Professionnels :
- **Spécial VTC/Taxi** : Les garanties indispensables
- **Flotte automobile** : Négociation sur les volumes
- **Véhicules de fonction** : Optimisation fiscale

## 📊 Comparatif 2024 : Top 5 Assureurs

| Assureur | Particuliers | Professionnels | Rapport Qualité/Prix |
|----------|--------------|----------------|---------------------|
| Assureur A | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Excellent |
| Assureur B | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Très bon |

## 🚨 Cas Pratiques Réels

### Cas #1 : Marie, 28 ans, conductrice novice
**Situation** : Premier véhicule, budget serré
**Solution courtier** : Assurance au tiers + garanties essentielles
**Économie réalisée** : 35% vs devis direct assureur

### Cas #2 : Jean, chauffeur VTC
**Situation** : Besoin couverture professionnelle complète
**Solution courtier** : Contrat spécialisé VTC avec garantie perte d'exploitation
**Avantage** : Couverture optimale + accompagnement sinistre

## 📞 Besoin d'un Devis Personnalisé ?

En tant que **courtier indépendant**, je négocie pour vous auprès de **15+ compagnies d'assurance**.

**Mes services inclus :**
- ✅ Analyse gratuite de vos besoins
- ✅ Comparaison de 5 devis minimum
- ✅ Négociation des tarifs et garanties
- ✅ Gestion des sinistres à vie
- ✅ Révision annuelle de vos contrats

### 🎁 Offre Spéciale Lecteurs Blog
**Consultation gratuite** + **audit de vos contrats actuels**

[**📞 Prendre RDV Gratuit**](#contact) | [**💬 Chat Direct**](#chat)

---

*Diddy, Courtier en Assurance agréé ORIAS n°XXXXXXX*
*15 ans d'expérience - Plus de 2000 clients accompagnés*`,
        
        seo: {
          metaTitle: 'Assurance Auto 2024 : Guide Courtier Expert - Économisez 40%',
          metaDescription: 'Guide complet d\'un courtier agréé ORIAS pour choisir votre assurance auto 2024. Conseils particuliers & professionnels. Économisez jusqu\'à 40%.',
          keywords: ['assurance auto 2024', 'courtier assurance', 'économiser assurance auto', 'guide assurance', 'comparatif assurance auto'],
          ogImage: '/blog/assurance-auto-2024.jpg'
        },
        
        category: 'assurance',
        subcategory: 'auto',
        tags: ['assurance auto', 'courtier', '2024', 'économies', 'comparatif', 'particuliers', 'professionnels'],
        
        author: {
          id: 'diddy',
          name: 'Diddy',
          title: 'Courtier en Assurance & Expert Multi-domaines',
          bio: 'Courtier agréé ORIAS avec 15 ans d\'expérience. Passionné par l\'innovation et la satisfaction client.',
          avatar: '👨‍💼',
          expertise: [
            { domain: 'Assurance', level: 'expert', experience: '15 ans', certifications: ['ORIAS', 'IAS'] },
            { domain: 'Immobilier', level: 'expert', experience: '10 ans' },
            { domain: 'Finance', level: 'expert', experience: '12 ans' },
            { domain: 'E-commerce', level: 'intermédiaire', experience: '5 ans' },
            { domain: 'Streaming', level: 'intermédiaire', experience: '3 ans' }
          ],
          social: {
            linkedin: 'https://linkedin.com/in/diddy-courtier',
            youtube: 'https://youtube.com/@diddyassurance'
          },
          credentials: {
            licenses: ['Courtier agréé ORIAS n°XXXXXXX', 'Négociateur immobilier'],
            certifications: ['Expert en assurance', 'Formation continue 2024']
          },
          stats: {
            articlesPublished: 150,
            totalViews: 250000,
            followers: 5200,
            rating: 4.9
          }
        },
        
        publishedAt: '2024-01-15T09:00:00Z',
        status: 'published',
        
        stats: {
          views: 15420,
          likes: 234,
          shares: 89,
          comments: 45,
          readTime: 8
        },
        
        featuredImage: '/blog/assurance-auto-2024-hero.jpg',
        
        leadMagnet: {
          type: 'pdf',
          title: 'Checklist Courtier : 20 Points pour Choisir son Assurance Auto',
          description: 'Téléchargez ma checklist exclusive utilisée avec mes clients pour ne rien oublier',
          downloadUrl: '/downloads/checklist-assurance-auto.pdf'
        },
        
        targetAudience: ['particuliers', 'professionnels'],
        difficulty: 'intermédiaire',
        isPremium: false
      },
      
      {
        id: 'investissement-immobilier-debutant',
        title: 'Investissement Immobilier Débutant : Ma Méthode de Négociateur en 2024',
        slug: 'investissement-immobilier-debutant-methode-negociateur-2024',
        excerpt: 'Les secrets d\'un négociateur immobilier pour réussir votre premier investissement locatif. Guide pratique avec exemples concrets et calculs de rentabilité.',
        content: `# Investissement Immobilier Débutant : Ma Méthode de Négociateur

Après **10 ans comme négociateur immobilier** et plus de **200 transactions**, je partage avec vous ma méthode éprouvée pour réussir votre premier investissement locatif.

## 🎯 Qui peut investir dans l'immobilier ?

**Bonne nouvelle** : Pas besoin d'être riche pour commencer !

### Profils adaptés :
- **Jeunes actifs** : Dès 25 ans avec CDI
- **Familles** : Optimisation fiscale + patrimoine
- **Seniors** : Préparation retraite
- **Entrepreneurs** : Diversification patrimoine

## 💡 Ma Règle d'Or : La Méthode 1% 

**Un bon investissement locatif doit rapporter minimum 1% du prix d'achat par mois en loyer.**

### Exemple concret :
- Appartement acheté : 100 000€
- Loyer minimum attendu : 1 000€/mois
- Rentabilité brute : 12%/an

## 🔍 Les 7 Étapes de ma Méthode de Négociateur

### Étape 1 : Définir son budget réel
Ne vous fiez pas aux simulateurs en ligne ! Voici ma grille :

**Revenus nets mensuels** × **33%** = Capacité d'endettement max
**Mais attention** : Gardez une marge de sécurité de 20%

### Étape 2 : Choisir la bonne zone géographique
Mes critères de négociateur :
- **Demande locative forte** (taux de vacance < 5%)
- **Transports en commun** (gare, métro, bus)
- **Commerces et services** (écoles, médecins, supermarchés)
- **Évolution démographique positive**

### Étape 3 : Sélectionner le bon type de bien
**Pour débuter, je recommande :**
- Studio ou T2 en centre-ville
- Proche transports et universités
- État correct (pas de gros travaux)

## 💰 Mes Astuces de Négociation Immobilière

### Astuce #1 : La visite stratégique
- Visitez en semaine, en fin de journée
- Repérez TOUS les défauts
- Prenez des photos discrètement
- Questionnez sur l'historique (pourquoi vendre ?)

### Astuce #2 : La négociation en 3 temps
1. **Première offre** : -15% du prix affiché
2. **Justification** : Liste des travaux/défauts
3. **Compromis** : -8 à -10% si bien situé

### Astuce #3 : Les clauses suspensives
**Toujours inclure :**
- Obtention du prêt
- Absence de servitudes cachées
- État des lieux détaillé

## 📊 Calcul de Rentabilité : Ma Feuille de Route

### Rentabilité Brute
```
(Loyer annuel / Prix d'achat) × 100
```

### Rentabilité Nette (plus réaliste)
```
((Loyer annuel - Charges - Impôts - Travaux) / Prix total) × 100
```

### Mon Tableau de Bord Excel
| Poste | Montant | % du loyer |
|-------|---------|------------|
| Loyer mensuel | 800€ | 100% |
| Charges copro | -50€ | -6% |
| Taxe foncière | -25€ | -3% |
| Assurance PNO | -15€ | -2% |
| Provision travaux | -40€ | -5% |
| **Net mensuel** | **670€** | **84%** |

## 🏠 Mes 3 Investissements Gagnants (Exemples Réels)

### Investissement #1 : Studio Étudiant Nancy
- **Achat** : 65 000€ (négocié de 75 000€)
- **Travaux** : 3 000€ (peinture + sol)
- **Loyer** : 450€/mois
- **Rentabilité nette** : 7,2%/an
- **Plus-value à la revente** : +15 000€ en 3 ans

### Investissement #2 : T2 Centre-ville Metz
- **Achat** : 85 000€
- **Loyer** : 650€/mois
- **Rentabilité** : 8,1%/an
- **Avantage** : Déficit foncier (travaux déductibles)

## 🚨 Les 5 Erreurs de Débutant à Éviter

### Erreur #1 : Acheter avec le cœur
L'immobilier locatif = investissement, pas coup de cœur !

### Erreur #2 : Négliger les charges
Copropriété, taxe foncière, travaux... Comptez 25-30% du loyer.

### Erreur #3 : Sous-estimer la vacance locative
Prévoir 1 mois de vacance par an minimum.

## 📞 Accompagnement Personnalisé

**Mes services de négociateur :**
- ✅ Recherche de biens rentables
- ✅ Négociation prix et conditions
- ✅ Accompagnement notaire
- ✅ Mise en location garantie
- ✅ Gestion locative (optionnel)

### 🎁 Offre Spéciale Débutants
**Audit gratuit** de votre capacité d'investissement + **sélection de 3 biens**

[**📞 RDV Gratuit Négociateur**](#contact) | [**📊 Calculateur Rentabilité**](#calculator)

---

*Diddy, Négociateur Immobilier & Courtier*
*200+ transactions réussies - Spécialiste investissement locatif*`,
        
        seo: {
          metaTitle: 'Investissement Immobilier Débutant 2024 : Méthode Négociateur Expert',
          metaDescription: 'Guide complet d\'un négociateur pour réussir votre 1er investissement locatif. Méthode éprouvée, calculs rentabilité, négociation. 200+ transactions.',
          keywords: ['investissement immobilier débutant', 'négociateur immobilier', 'rentabilité locative', 'premier investissement', 'méthode négociation'],
          ogImage: '/blog/investissement-immobilier-debutant.jpg'
        },
        
        category: 'immobilier',
        subcategory: 'investissement',
        tags: ['investissement', 'immobilier', 'débutant', 'négociation', 'rentabilité', 'locatif'],
        
        author: {
          id: 'diddy',
          name: 'Diddy',
          title: 'Négociateur Immobilier & Courtier Multi-spécialiste',
          bio: 'Expert immobilier avec 200+ transactions. Passionné par l\'accompagnement des investisseurs débutants.',
          avatar: '🏠',
          expertise: [
            { domain: 'Négociation Immobilière', level: 'expert', experience: '10 ans' },
            { domain: 'Investissement Locatif', level: 'expert', experience: '8 ans' },
            { domain: 'Assurance', level: 'expert', experience: '15 ans' }
          ],
          social: {
            linkedin: 'https://linkedin.com/in/diddy-immobilier',
            youtube: 'https://youtube.com/@diddyimmo'
          },
          credentials: {
            licenses: ['Négociateur immobilier', 'Courtier agréé'],
            certifications: ['Expert investissement locatif']
          },
          stats: {
            articlesPublished: 85,
            totalViews: 180000,
            followers: 3200,
            rating: 4.8
          }
        },
        
        publishedAt: '2024-01-10T08:00:00Z',
        status: 'published',
        
        stats: {
          views: 12800,
          likes: 189,
          shares: 67,
          comments: 34,
          readTime: 12
        },
        
        featuredImage: '/blog/investissement-immobilier-hero.jpg',
        
        leadMagnet: {
          type: 'calculator',
          title: 'Calculateur de Rentabilité Immobilière Pro',
          description: 'Mon outil Excel utilisé pour analyser tous mes investissements'
        },
        
        targetAudience: ['particuliers'],
        difficulty: 'débutant',
        isPremium: false
      }
    ];
  }

  // Obtenir les articles par catégorie
  static getPostsByCategory(category: string): BlogPost[] {
    const posts = this.loadPosts();
    return posts.filter(post => post.category === category && post.status === 'published');
  }

  // Rechercher des articles
  static searchPosts(query: string): BlogPost[] {
    const posts = this.loadPosts();
    const searchTerm = query.toLowerCase();
    
    return posts.filter(post => 
      post.status === 'published' && (
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        post.seo.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
      )
    );
  }

  // Obtenir les articles populaires
  static getPopularPosts(limit: number = 5): BlogPost[] {
    const posts = this.loadPosts();
    return posts
      .filter(post => post.status === 'published')
      .sort((a, b) => b.stats.views - a.stats.views)
      .slice(0, limit);
  }

  // Obtenir les articles récents
  static getRecentPosts(limit: number = 5): BlogPost[] {
    const posts = this.loadPosts();
    return posts
      .filter(post => post.status === 'published')
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  // Obtenir un article par slug
  static getPostBySlug(slug: string): BlogPost | null {
    const posts = this.loadPosts();
    return posts.find(post => post.slug === slug && post.status === 'published') || null;
  }

  // Obtenir les articles liés
  static getRelatedPosts(postId: string, limit: number = 3): BlogPost[] {
    const posts = this.loadPosts();
    const currentPost = posts.find(p => p.id === postId);
    
    if (!currentPost) return [];
    
    return posts
      .filter(post => 
        post.id !== postId && 
        post.status === 'published' && 
        (post.category === currentPost.category || 
         post.tags.some(tag => currentPost.tags.includes(tag)))
      )
      .sort((a, b) => b.stats.views - a.stats.views)
      .slice(0, limit);
  }
}
