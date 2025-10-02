export interface SocialNetwork {
  id: string;
  platform: SocialPlatform;
  username: string;
  url?: string;
  displayName?: string;
  isActive: boolean;
  isPublic: boolean;
  lastSync?: string;
  followerCount?: number;
  verifiedAccount?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SocialPlatform = 
  | 'twitch'
  | 'youtube'
  | 'tiktok'
  | 'instagram'
  | 'twitter'
  | 'facebook'
  | 'linkedin'
  | 'discord'
  | 'snapchat'
  | 'pinterest'
  | 'reddit'
  | 'github'
  | 'steam'
  | 'kick'
  | 'rumble'
  | 'dailymotion'
  | 'vimeo'
  | 'other';

export interface SocialContent {
  id: string;
  socialNetworkId: string;
  platform: SocialPlatform;
  type: ContentType;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number; // en secondes pour les vidéos
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  publishedAt: string;
  isLive?: boolean;
  liveViewers?: number;
  tags?: string[];
  category?: string;
  language?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContentType = 
  | 'video'
  | 'livestream'
  | 'replay'
  | 'post'
  | 'story'
  | 'short'
  | 'clip'
  | 'photo'
  | 'article'
  | 'podcast'
  | 'other';

export interface SocialProfile {
  id: string;
  interlocutorId: string;
  pseudonym: string;
  avatar?: string;
  bio?: string;
  isAnonymous: boolean;
  isPublic: boolean;
  socialNetworks: SocialNetwork[];
  contentAggregation: ContentAggregationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface ContentAggregationSettings {
  autoSync: boolean;
  syncInterval: number; // en minutes
  enabledContentTypes: ContentType[];
  enabledPlatforms: SocialPlatform[];
  maxContentAge: number; // en jours
  filterKeywords?: string[];
  excludeKeywords?: string[];
  sortBy: 'date' | 'views' | 'likes' | 'relevance';
  sortOrder: 'asc' | 'desc';
}

export interface ContentFilter {
  platforms?: SocialPlatform[];
  contentTypes?: ContentType[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
  tags?: string[];
  minViews?: number;
  maxDuration?: number;
  isLive?: boolean;
  sortBy?: 'date' | 'views' | 'likes' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export interface SocialAnalytics {
  totalFollowers: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageEngagement: number;
  topPlatforms: Array<{
    platform: SocialPlatform;
    followers: number;
    engagement: number;
  }>;
  contentStats: Array<{
    type: ContentType;
    count: number;
    totalViews: number;
  }>;
  recentGrowth: Array<{
    date: string;
    followers: number;
    views: number;
  }>;
}

export interface LiveStreamInfo {
  id: string;
  platform: SocialPlatform;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  isLive: boolean;
  startedAt?: string;
  scheduledAt?: string;
  viewerCount?: number;
  category?: string;
  tags?: string[];
  language?: string;
}

export interface SocialNotification {
  id: string;
  type: 'new_content' | 'live_started' | 'milestone' | 'mention' | 'comment';
  platform: SocialPlatform;
  title: string;
  message: string;
  url?: string;
  isRead: boolean;
  createdAt: string;
}
