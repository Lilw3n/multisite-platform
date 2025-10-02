import { 
  SocialNetwork, 
  SocialContent, 
  SocialProfile, 
  ContentFilter, 
  SocialAnalytics, 
  LiveStreamInfo,
  SocialNotification,
  SocialPlatform,
  ContentType
} from '@/types/socialNetworks';

class SocialNetworksService {
  private static readonly STORAGE_KEY = 'social_profiles_data';

  // Charger les profils depuis localStorage
  static loadProfiles(): SocialProfile[] {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Erreur lors du chargement des profils sociaux');
        }
      }
    }
    return this.getDefaultProfiles();
  }

  // Sauvegarder les profils dans localStorage
  static saveProfiles(profiles: SocialProfile[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
    }
  }

  // Profils par défaut
  static getDefaultProfiles(): SocialProfile[] {
    return [
      {
        id: 'profile-lilwen',
        interlocutorId: 'admin-diddy',
        pseudonym: 'Lilwen',
        avatar: '/avatars/lilwen.jpg',
        bio: 'Streamer passionné • Gaming • Tech • Communauté',
        isAnonymous: true,
        isPublic: true,
        socialNetworks: [
          {
            id: 'tw-lilwen',
            platform: 'twitch',
            username: 'lilwen',
            url: 'https://twitch.tv/lilwen',
            displayName: 'Lilwen',
            isActive: true,
            isPublic: true,
            followerCount: 1250,
            verifiedAccount: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'yt-lilwen',
            platform: 'youtube',
            username: 'lilwen',
            url: 'https://youtube.com/@lilwen',
            displayName: 'Lilwen Gaming',
            isActive: true,
            isPublic: true,
            followerCount: 850,
            verifiedAccount: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'tt-lilwen',
            platform: 'tiktok',
            username: 'lilwen_gaming',
            url: 'https://tiktok.com/@lilwen_gaming',
            displayName: 'Lilwen Gaming',
            isActive: true,
            isPublic: true,
            followerCount: 2340,
            verifiedAccount: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        contentAggregation: {
          autoSync: true,
          syncInterval: 30,
          enabledContentTypes: ['video', 'livestream', 'replay', 'short', 'clip'],
          enabledPlatforms: ['twitch', 'youtube', 'tiktok'],
          maxContentAge: 30,
          filterKeywords: ['gaming', 'stream', 'live'],
          excludeKeywords: ['spam', 'fake'],
          sortBy: 'date',
          sortOrder: 'desc'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // Créer un nouveau profil social
  static async createProfile(profileData: Omit<SocialProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialProfile> {
    const profiles = this.loadProfiles();
    
    const newProfile: SocialProfile = {
      ...profileData,
      id: `profile-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    profiles.push(newProfile);
    this.saveProfiles(profiles);
    
    return newProfile;
  }

  // Obtenir un profil par ID
  static getProfile(profileId: string): SocialProfile | null {
    const profiles = this.loadProfiles();
    return profiles.find(p => p.id === profileId) || null;
  }

  // Obtenir un profil par interlocuteur
  static getProfileByInterlocutor(interlocutorId: string): SocialProfile | null {
    const profiles = this.loadProfiles();
    return profiles.find(p => p.interlocutorId === interlocutorId) || null;
  }

  // Mettre à jour un profil
  static async updateProfile(profileId: string, updates: Partial<SocialProfile>): Promise<SocialProfile | null> {
    const profiles = this.loadProfiles();
    const profileIndex = profiles.findIndex(p => p.id === profileId);
    
    if (profileIndex === -1) return null;
    
    profiles[profileIndex] = {
      ...profiles[profileIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveProfiles(profiles);
    return profiles[profileIndex];
  }

  // Ajouter un réseau social à un profil
  static async addSocialNetwork(profileId: string, networkData: Omit<SocialNetwork, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialNetwork | null> {
    const profiles = this.loadProfiles();
    const profile = profiles.find(p => p.id === profileId);
    
    if (!profile) return null;
    
    const newNetwork: SocialNetwork = {
      ...networkData,
      id: `network-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    profile.socialNetworks.push(newNetwork);
    profile.updatedAt = new Date().toISOString();
    
    this.saveProfiles(profiles);
    return newNetwork;
  }

  // Supprimer un réseau social
  static async removeSocialNetwork(profileId: string, networkId: string): Promise<boolean> {
    const profiles = this.loadProfiles();
    const profile = profiles.find(p => p.id === profileId);
    
    if (!profile) return false;
    
    const networkIndex = profile.socialNetworks.findIndex(n => n.id === networkId);
    if (networkIndex === -1) return false;
    
    profile.socialNetworks.splice(networkIndex, 1);
    profile.updatedAt = new Date().toISOString();
    
    this.saveProfiles(profiles);
    return true;
  }

  // Générer du contenu de démonstration
  static generateMockContent(profileId: string): SocialContent[] {
    const profile = this.getProfile(profileId);
    if (!profile) return [];

    const mockContent: SocialContent[] = [];
    const now = new Date();

    // Contenu Twitch
    const twitchNetwork = profile.socialNetworks.find(n => n.platform === 'twitch');
    if (twitchNetwork) {
      mockContent.push(
        {
          id: 'tw-live-1',
          socialNetworkId: twitchNetwork.id,
          platform: 'twitch',
          type: 'livestream',
          title: '🔴 LIVE - Nouvelle aventure Minecraft !',
          description: 'Construction d\'une base secrète dans les profondeurs !',
          url: 'https://twitch.tv/lilwen',
          thumbnailUrl: '/thumbnails/minecraft-live.jpg',
          duration: 7200,
          viewCount: 245,
          likeCount: 89,
          commentCount: 156,
          publishedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          isLive: true,
          liveViewers: 245,
          tags: ['minecraft', 'gaming', 'live', 'construction'],
          category: 'Gaming',
          language: 'fr',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'tw-replay-1',
          socialNetworkId: twitchNetwork.id,
          platform: 'twitch',
          type: 'replay',
          title: 'Rediffusion - Epic Boss Fight Elden Ring',
          description: 'Combat épique contre Malenia !',
          url: 'https://twitch.tv/videos/123456789',
          thumbnailUrl: '/thumbnails/elden-ring-boss.jpg',
          duration: 5400,
          viewCount: 1250,
          likeCount: 234,
          commentCount: 89,
          publishedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
          isLive: false,
          tags: ['eldenring', 'boss', 'gaming', 'epic'],
          category: 'Gaming',
          language: 'fr',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
    }

    // Contenu YouTube
    const youtubeNetwork = profile.socialNetworks.find(n => n.platform === 'youtube');
    if (youtubeNetwork) {
      mockContent.push(
        {
          id: 'yt-video-1',
          socialNetworkId: youtubeNetwork.id,
          platform: 'youtube',
          type: 'video',
          title: 'TOP 10 des meilleurs jeux de 2024 !',
          description: 'Ma sélection personnelle des jeux qui ont marqué cette année',
          url: 'https://youtube.com/watch?v=abc123',
          thumbnailUrl: '/thumbnails/top-games-2024.jpg',
          duration: 900,
          viewCount: 15420,
          likeCount: 1250,
          commentCount: 234,
          publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          isLive: false,
          tags: ['gaming', 'top10', '2024', 'review'],
          category: 'Gaming',
          language: 'fr',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'yt-short-1',
          socialNetworkId: youtubeNetwork.id,
          platform: 'youtube',
          type: 'short',
          title: 'Trick shot impossible ! 🎯',
          description: '#gaming #trickshot #epic',
          url: 'https://youtube.com/shorts/xyz789',
          thumbnailUrl: '/thumbnails/trickshot.jpg',
          duration: 45,
          viewCount: 45600,
          likeCount: 3200,
          commentCount: 567,
          publishedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
          isLive: false,
          tags: ['trickshot', 'gaming', 'epic', 'short'],
          category: 'Gaming',
          language: 'fr',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
    }

    // Contenu TikTok
    const tiktokNetwork = profile.socialNetworks.find(n => n.platform === 'tiktok');
    if (tiktokNetwork) {
      mockContent.push(
        {
          id: 'tt-video-1',
          socialNetworkId: tiktokNetwork.id,
          platform: 'tiktok',
          type: 'short',
          title: 'Quand tu découvres un bug de fou 😱',
          description: 'Ce bug va changer votre façon de jouer ! #gaming #bug #astuce',
          url: 'https://tiktok.com/@lilwen_gaming/video/123456789',
          thumbnailUrl: '/thumbnails/bug-discovery.jpg',
          duration: 30,
          viewCount: 125000,
          likeCount: 8900,
          commentCount: 1200,
          publishedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
          isLive: false,
          tags: ['gaming', 'bug', 'astuce', 'viral'],
          category: 'Gaming',
          language: 'fr',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
    }

    return mockContent;
  }

  // Filtrer le contenu
  static filterContent(content: SocialContent[], filter: ContentFilter): SocialContent[] {
    let filtered = [...content];

    if (filter.platforms?.length) {
      filtered = filtered.filter(c => filter.platforms!.includes(c.platform));
    }

    if (filter.contentTypes?.length) {
      filtered = filtered.filter(c => filter.contentTypes!.includes(c.type));
    }

    if (filter.dateRange) {
      const start = new Date(filter.dateRange.start);
      const end = new Date(filter.dateRange.end);
      filtered = filtered.filter(c => {
        const date = new Date(c.publishedAt);
        return date >= start && date <= end;
      });
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query) ||
        c.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filter.tags?.length) {
      filtered = filtered.filter(c => 
        c.tags?.some(tag => filter.tags!.includes(tag))
      );
    }

    if (filter.minViews) {
      filtered = filtered.filter(c => (c.viewCount || 0) >= filter.minViews!);
    }

    if (filter.maxDuration) {
      filtered = filtered.filter(c => (c.duration || 0) <= filter.maxDuration!);
    }

    if (filter.isLive !== undefined) {
      filtered = filtered.filter(c => c.isLive === filter.isLive);
    }

    // Tri
    const sortBy = filter.sortBy || 'date';
    const sortOrder = filter.sortOrder || 'desc';

    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'views':
          aValue = a.viewCount || 0;
          bValue = b.viewCount || 0;
          break;
        case 'likes':
          aValue = a.likeCount || 0;
          bValue = b.likeCount || 0;
          break;
        case 'relevance':
          // Score basé sur vues + likes + commentaires
          aValue = (a.viewCount || 0) + (a.likeCount || 0) * 10 + (a.commentCount || 0) * 5;
          bValue = (b.viewCount || 0) + (b.likeCount || 0) * 10 + (b.commentCount || 0) * 5;
          break;
        default: // date
          aValue = new Date(a.publishedAt).getTime();
          bValue = new Date(b.publishedAt).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }

  // Obtenir les analytics d'un profil
  static getAnalytics(profileId: string): SocialAnalytics {
    const profile = this.getProfile(profileId);
    if (!profile) {
      return {
        totalFollowers: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        averageEngagement: 0,
        topPlatforms: [],
        contentStats: [],
        recentGrowth: []
      };
    }

    const content = this.generateMockContent(profileId);
    
    return {
      totalFollowers: profile.socialNetworks.reduce((sum, n) => sum + (n.followerCount || 0), 0),
      totalViews: content.reduce((sum, c) => sum + (c.viewCount || 0), 0),
      totalLikes: content.reduce((sum, c) => sum + (c.likeCount || 0), 0),
      totalComments: content.reduce((sum, c) => sum + (c.commentCount || 0), 0),
      averageEngagement: 8.5,
      topPlatforms: profile.socialNetworks
        .sort((a, b) => (b.followerCount || 0) - (a.followerCount || 0))
        .slice(0, 3)
        .map(n => ({
          platform: n.platform,
          followers: n.followerCount || 0,
          engagement: Math.random() * 10 + 5
        })),
      contentStats: [
        { type: 'video', count: 15, totalViews: 125000 },
        { type: 'livestream', count: 8, totalViews: 45000 },
        { type: 'short', count: 25, totalViews: 280000 },
        { type: 'replay', count: 12, totalViews: 67000 }
      ],
      recentGrowth: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        followers: Math.floor(Math.random() * 50) + 1200,
        views: Math.floor(Math.random() * 5000) + 15000
      })).reverse()
    };
  }

  // Obtenir les plateformes disponibles
  static getAvailablePlatforms(): Array<{ id: SocialPlatform; name: string; icon: string; color: string }> {
    return [
      { id: 'twitch', name: 'Twitch', icon: '🟣', color: 'bg-purple-500' },
      { id: 'youtube', name: 'YouTube', icon: '🔴', color: 'bg-red-500' },
      { id: 'tiktok', name: 'TikTok', icon: '⚫', color: 'bg-black' },
      { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-pink-500' },
      { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: 'bg-blue-500' },
      { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-600' },
      { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-700' },
      { id: 'discord', name: 'Discord', icon: '💬', color: 'bg-indigo-500' },
      { id: 'snapchat', name: 'Snapchat', icon: '👻', color: 'bg-yellow-400' },
      { id: 'pinterest', name: 'Pinterest', icon: '📌', color: 'bg-red-600' },
      { id: 'reddit', name: 'Reddit', icon: '🤖', color: 'bg-orange-500' },
      { id: 'github', name: 'GitHub', icon: '🐙', color: 'bg-gray-800' },
      { id: 'steam', name: 'Steam', icon: '🎮', color: 'bg-blue-800' },
      { id: 'kick', name: 'Kick', icon: '⚡', color: 'bg-green-500' },
      { id: 'rumble', name: 'Rumble', icon: '📺', color: 'bg-green-600' },
      { id: 'dailymotion', name: 'Dailymotion', icon: '🎬', color: 'bg-blue-400' },
      { id: 'vimeo', name: 'Vimeo', icon: '🎥', color: 'bg-cyan-500' },
      { id: 'other', name: 'Autre', icon: '🌐', color: 'bg-gray-500' }
    ];
  }

  // Obtenir les lives en cours
  static getLiveStreams(profileId: string): LiveStreamInfo[] {
    const content = this.generateMockContent(profileId);
    return content
      .filter(c => c.isLive)
      .map(c => ({
        id: c.id,
        platform: c.platform,
        title: c.title,
        description: c.description,
        url: c.url,
        thumbnailUrl: c.thumbnailUrl,
        isLive: true,
        startedAt: c.publishedAt,
        viewerCount: c.liveViewers,
        category: c.category,
        tags: c.tags,
        language: c.language
      }));
  }
}

export default SocialNetworksService;
