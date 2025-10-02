export interface StreamingConfig {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: StreamCategory;
  isLive: boolean;
  isPrivate: boolean;
  maxViewers?: number;
  
  // Configuration technique
  rtmp: RTMPConfig;
  webrtc?: WebRTCConfig;
  recording: RecordingConfig;
  
  // Sécurité
  security: StreamSecurity;
  
  // Métadonnées
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  duration?: number;
  
  // Stats
  stats: StreamStats;
  
  // Monétisation
  monetization?: StreamMonetization;
}

export interface RTMPConfig {
  enabled: boolean;
  serverUrl: string;
  streamKey: string;
  backupKey?: string;
  
  // Paramètres vidéo
  video: {
    resolution: '1920x1080' | '1280x720' | '854x480' | '640x360';
    fps: 30 | 60;
    bitrate: number; // kbps
    codec: 'h264' | 'h265' | 'av1';
    profile: 'baseline' | 'main' | 'high';
  };
  
  // Paramètres audio
  audio: {
    bitrate: number; // kbps
    sampleRate: 44100 | 48000;
    channels: 1 | 2;
    codec: 'aac' | 'opus';
  };
  
  // Sécurité RTMP
  authentication: {
    method: 'key' | 'token' | 'oauth';
    expiresAt?: string;
    ipWhitelist?: string[];
  };
}

export interface WebRTCConfig {
  enabled: boolean;
  iceServers: RTCIceServer[];
  
  // Configuration peer-to-peer
  p2p: {
    enabled: boolean;
    maxPeers: number;
    fallbackToRelay: boolean;
  };
  
  // SFU (Selective Forwarding Unit)
  sfu: {
    enabled: boolean;
    serverUrl: string;
    roomId: string;
  };
  
  // Qualité adaptative
  adaptiveQuality: {
    enabled: boolean;
    minBitrate: number;
    maxBitrate: number;
    targetLatency: number; // ms
  };
}

export interface RecordingConfig {
  enabled: boolean;
  autoRecord: boolean;
  format: 'mp4' | 'webm' | 'mkv';
  quality: 'source' | 'high' | 'medium' | 'low';
  
  // Stockage
  storage: {
    provider: 'local' | 'aws-s3' | 'gcp' | 'azure';
    bucket?: string;
    path?: string;
    retention: number; // jours
  };
  
  // Post-traitement
  postProcessing: {
    enabled: boolean;
    generateThumbnails: boolean;
    createHighlights: boolean;
    transcoding: TranscodingConfig[];
  };
}

export interface TranscodingConfig {
  resolution: string;
  bitrate: number;
  format: string;
}

export interface StreamSecurity {
  // Authentification
  authentication: {
    required: boolean;
    method: 'password' | 'token' | 'oauth' | 'invite';
    password?: string;
    allowedUsers?: string[];
  };
  
  // Chiffrement
  encryption: {
    enabled: boolean;
    method: 'aes-256' | 'chacha20';
    keyRotation: boolean;
    rotationInterval?: number; // minutes
  };
  
  // Protection DDoS
  ddosProtection: {
    enabled: boolean;
    rateLimit: number; // requêtes par minute
    geoBlocking?: string[]; // codes pays bloqués
  };
  
  // Modération
  moderation: {
    chatEnabled: boolean;
    moderators: string[];
    autoModeration: boolean;
    bannedWords: string[];
  };
}

export interface StreamStats {
  currentViewers: number;
  peakViewers: number;
  totalViews: number;
  
  // Qualité technique
  technical: {
    bitrate: number;
    fps: number;
    droppedFrames: number;
    latency: number; // ms
    
    // Santé du stream
    health: 'excellent' | 'good' | 'fair' | 'poor';
    uptime: number; // pourcentage
  };
  
  // Engagement
  engagement: {
    chatMessages: number;
    likes: number;
    shares: number;
    donations?: number;
  };
  
  // Géographie
  geography: {
    [countryCode: string]: number;
  };
}

export interface StreamMonetization {
  enabled: boolean;
  
  // Donations
  donations: {
    enabled: boolean;
    minAmount: number;
    currency: string;
    platforms: ('paypal' | 'stripe' | 'crypto')[];
  };
  
  // Abonnements
  subscriptions: {
    enabled: boolean;
    tiers: SubscriptionTier[];
  };
  
  // Publicités
  ads: {
    enabled: boolean;
    preRoll: boolean;
    midRoll: boolean;
    postRoll: boolean;
    frequency: number; // minutes entre les pubs
  };
  
  // Produits
  merchandise: {
    enabled: boolean;
    products: string[];
  };
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  benefits: string[];
  color: string;
}

export type StreamCategory = 
  | 'gaming'
  | 'music'
  | 'talk-show'
  | 'education'
  | 'business'
  | 'fitness'
  | 'cooking'
  | 'art'
  | 'technology'
  | 'news'
  | 'entertainment'
  | 'other';

export interface StreamViewer {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  joinedAt: string;
  isModerator: boolean;
  isSubscriber: boolean;
  
  // Statistiques de visionnage
  watchTime: number; // secondes
  messagesCount: number;
  donationsTotal: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  message: string;
  timestamp: string;
  
  // Métadonnées
  isHighlighted: boolean;
  isDonation: boolean;
  donationAmount?: number;
  
  // Modération
  isDeleted: boolean;
  deletedBy?: string;
  deletedReason?: string;
}

export interface StreamAlert {
  id: string;
  type: 'follow' | 'subscription' | 'donation' | 'raid' | 'host';
  userId: string;
  username: string;
  displayName: string;
  message?: string;
  amount?: number;
  timestamp: string;
  
  // Configuration d'affichage
  display: {
    duration: number; // ms
    sound?: string;
    animation?: string;
  };
}
