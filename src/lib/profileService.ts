import { UserProfile, ProfileBadge, UserLevel, ProfileActivity } from '@/types/profile';

// Service pour gérer les profils utilisateurs
export class ProfileService {
  private static readonly STORAGE_KEY = 'user_profiles';
  private static readonly CURRENT_USER_KEY = 'current_user_profile';

  // Charger tous les profils
  static loadProfiles(): UserProfile[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultProfiles();
    } catch (error) {
      console.error('Erreur lors du chargement des profils:', error);
      return this.getDefaultProfiles();
    }
  }

  // Sauvegarder les profils
  static saveProfiles(profiles: UserProfile[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des profils:', error);
    }
  }

  // Obtenir un profil par ID
  static getProfile(id: string): UserProfile | null {
    const profiles = this.loadProfiles();
    return profiles.find(profile => profile.id === id) || null;
  }

  // Obtenir le profil actuel
  static getCurrentUserProfile(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(this.CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Erreur lors du chargement du profil actuel:', error);
      return null;
    }
  }

  // Définir le profil actuel
  static setCurrentUserProfile(profile: UserProfile): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil actuel:', error);
    }
  }

  // Mettre à jour un profil
  static updateProfile(updatedProfile: UserProfile): void {
    const profiles = this.loadProfiles();
    const index = profiles.findIndex(p => p.id === updatedProfile.id);
    
    if (index !== -1) {
      profiles[index] = updatedProfile;
      this.saveProfiles(profiles);
    }
  }

  // Suivre/Ne plus suivre un utilisateur
  static toggleFollow(currentUserId: string, targetUserId: string): boolean {
    const profiles = this.loadProfiles();
    const currentUser = profiles.find(p => p.id === currentUserId);
    const targetUser = profiles.find(p => p.id === targetUserId);
    
    if (!currentUser || !targetUser) return false;

    // Logique de suivi (simplifié pour la démo)
    const isFollowing = Math.random() > 0.5; // Simulation
    
    if (isFollowing) {
      targetUser.stats.followers++;
      currentUser.stats.following++;
    } else {
      targetUser.stats.followers = Math.max(0, targetUser.stats.followers - 1);
      currentUser.stats.following = Math.max(0, currentUser.stats.following - 1);
    }
    
    this.saveProfiles(profiles);
    return !isFollowing;
  }

  // Obtenir les profils par défaut
  private static getDefaultProfiles(): UserProfile[] {
    return [
      {
        id: 'user-1',
        username: 'marie_pro',
        displayName: 'Marie Dubois',
        email: 'marie@example.com',
        avatar: '👩‍💼',
        bio: 'Experte en transport VTC • Formatrice • Passionnée de tech',
        location: 'Paris, France',
        website: 'https://marie-vtc.fr',
        joinDate: '2023-01-15',
        isVerified: true,
        isOnline: true,
        stats: {
          posts: 342,
          followers: 1247,
          following: 189,
          likes: 8934,
          deals: 23,
          earnings: 2850
        },
        badges: [
          {
            id: 'verified',
            name: 'Vérifié',
            description: 'Compte vérifié par DiddyHome',
            icon: '✅',
            color: 'blue',
            earnedAt: '2023-02-01',
            rarity: 'rare'
          },
          {
            id: 'top-creator',
            name: 'Top Créateur',
            description: 'Dans le top 1% des créateurs',
            icon: '🏆',
            color: 'gold',
            earnedAt: '2023-06-15',
            rarity: 'legendary'
          }
        ],
        level: {
          level: 28,
          name: 'Expert Pro',
          xp: 15420,
          xpToNext: 2580,
          color: 'purple',
          perks: ['Commission réduite', 'Support prioritaire', 'Badge exclusif']
        },
        socialLinks: [
          { platform: 'instagram', url: 'https://instagram.com/marie_pro', verified: true },
          { platform: 'linkedin', url: 'https://linkedin.com/in/marie-dubois', verified: true }
        ],
        preferences: {
          showEmail: false,
          showLocation: true,
          showStats: true,
          allowMessages: true,
          allowFollows: true
        },
        business: {
          isCreator: true,
          isVendor: true,
          category: 'Transport & Formation',
          rating: 4.9,
          reviewsCount: 156,
          totalSales: 45000,
          creatorLevel: 'Gold'
        }
      },
      {
        id: 'user-2',
        username: 'alex_deals',
        displayName: 'Alexandre Martin',
        email: 'alex@example.com',
        avatar: '🧑‍💻',
        bio: 'Roi des bons plans ✨ | Économies garanties | +500 deals réussis',
        location: 'Lyon, France',
        joinDate: '2023-03-20',
        isVerified: true,
        isOnline: false,
        lastSeen: '2024-10-02T10:30:00Z',
        stats: {
          posts: 189,
          followers: 892,
          following: 234,
          likes: 5621,
          deals: 67,
          earnings: 1890
        },
        badges: [
          {
            id: 'deal-master',
            name: 'Maître des Deals',
            description: 'Plus de 50 bons plans validés',
            icon: '💰',
            color: 'green',
            earnedAt: '2023-08-10',
            rarity: 'epic'
          }
        ],
        level: {
          level: 22,
          name: 'Deal Hunter',
          xp: 11200,
          xpToNext: 1800,
          color: 'green',
          perks: ['Commission deals réduite', 'Accès deals premium']
        },
        socialLinks: [
          { platform: 'twitter', url: 'https://twitter.com/alex_deals', verified: false }
        ],
        preferences: {
          showEmail: false,
          showLocation: true,
          showStats: true,
          allowMessages: true,
          allowFollows: true
        },
        business: {
          isCreator: false,
          isVendor: false,
          category: 'Bons Plans',
          rating: 4.7,
          reviewsCount: 89,
          totalSales: 0,
          creatorLevel: 'Silver'
        }
      },
      {
        id: 'user-3',
        username: 'sophie_market',
        displayName: 'Sophie Laurent',
        email: 'sophie@example.com',
        avatar: '👩‍🎨',
        bio: 'Créatrice de contenu • Marketplace Pro • Design & Lifestyle',
        location: 'Nice, France',
        joinDate: '2023-05-10',
        isVerified: false,
        isOnline: true,
        stats: {
          posts: 156,
          followers: 634,
          following: 145,
          likes: 3421,
          deals: 12,
          earnings: 890
        },
        badges: [
          {
            id: 'creative',
            name: 'Créatif',
            description: 'Contenu original et engageant',
            icon: '🎨',
            color: 'pink',
            earnedAt: '2023-07-01',
            rarity: 'common'
          }
        ],
        level: {
          level: 15,
          name: 'Créateur',
          xp: 7800,
          xpToNext: 2200,
          color: 'pink',
          perks: ['Outils créateur', 'Analytics avancés']
        },
        socialLinks: [
          { platform: 'instagram', url: 'https://instagram.com/sophie_creates', verified: false },
          { platform: 'tiktok', url: 'https://tiktok.com/@sophie_market', verified: true }
        ],
        preferences: {
          showEmail: false,
          showLocation: true,
          showStats: true,
          allowMessages: true,
          allowFollows: true
        },
        business: {
          isCreator: true,
          isVendor: true,
          category: 'Design & Lifestyle',
          rating: 4.5,
          reviewsCount: 34,
          totalSales: 12000,
          creatorLevel: 'Bronze'
        }
      }
    ];
  }

  // Rechercher des profils
  static searchProfiles(query: string): UserProfile[] {
    const profiles = this.loadProfiles();
    const searchTerm = query.toLowerCase();
    
    return profiles.filter(profile => 
      profile.username.toLowerCase().includes(searchTerm) ||
      profile.displayName.toLowerCase().includes(searchTerm) ||
      profile.bio?.toLowerCase().includes(searchTerm) ||
      profile.business?.category.toLowerCase().includes(searchTerm)
    );
  }

  // Obtenir les profils tendance
  static getTrendingProfiles(limit: number = 10): UserProfile[] {
    const profiles = this.loadProfiles();
    
    return profiles
      .sort((a, b) => {
        // Score basé sur l'activité récente, followers, etc.
        const scoreA = a.stats.followers * 0.3 + a.stats.posts * 0.2 + a.stats.likes * 0.1;
        const scoreB = b.stats.followers * 0.3 + b.stats.posts * 0.2 + b.stats.likes * 0.1;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }
}
