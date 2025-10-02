export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate: string;
  isVerified: boolean;
  isOnline: boolean;
  lastSeen?: string;
  
  // Stats
  stats: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
    deals: number;
    earnings: number;
  };
  
  // Badges et achievements
  badges: ProfileBadge[];
  level: UserLevel;
  
  // Social
  socialLinks: SocialLink[];
  
  // Préférences
  preferences: {
    showEmail: boolean;
    showLocation: boolean;
    showStats: boolean;
    allowMessages: boolean;
    allowFollows: boolean;
  };
  
  // Business (pour créateurs/vendeurs)
  business?: {
    isCreator: boolean;
    isVendor: boolean;
    category: string;
    rating: number;
    reviewsCount: number;
    totalSales: number;
    creatorLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  };
}

export interface ProfileBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserLevel {
  level: number;
  name: string;
  xp: number;
  xpToNext: number;
  color: string;
  perks: string[];
}

export interface SocialLink {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin' | 'facebook' | 'website';
  url: string;
  verified: boolean;
}

export interface ProfileActivity {
  id: string;
  type: 'post' | 'deal' | 'sale' | 'achievement' | 'follow' | 'like';
  title: string;
  description: string;
  timestamp: string;
  data?: any;
}
