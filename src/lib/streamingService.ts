import { StreamingConfig, RTMPConfig, WebRTCConfig, StreamStats, ChatMessage, StreamAlert } from '@/types/streaming';

export class StreamingService {
  private static readonly STORAGE_KEY = 'streaming_configs';
  private static readonly ACTIVE_STREAMS_KEY = 'active_streams';

  // Générer une configuration de streaming
  static generateStreamConfig(userId: string, title: string, isMobile: boolean = false): StreamingConfig {
    const streamId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const streamKey = this.generateSecureStreamKey();
    
    return {
      id: streamId,
      userId,
      title,
      category: 'talk-show',
      isLive: false,
      isPrivate: false,
      
      rtmp: {
        enabled: !isMobile, // RTMP désactivé par défaut pour mobile
        serverUrl: `rtmp://stream.diddyhome.com/live`,
        streamKey,
        video: {
          resolution: isMobile ? '1280x720' : '1920x1080',
          fps: isMobile ? 30 : 60,
          bitrate: isMobile ? 2500 : 6000,
          codec: 'h264',
          profile: 'main'
        },
        audio: {
          bitrate: 128,
          sampleRate: 48000,
          channels: 2,
          codec: 'aac'
        },
        authentication: {
          method: 'key',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
      },
      
      webrtc: {
        enabled: true, // WebRTC activé par défaut (surtout pour mobile)
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { 
            urls: 'turn:turn.diddyhome.com:3478',
            username: 'diddyuser',
            credential: 'diddypass123'
          }
        ],
        p2p: {
          enabled: isMobile,
          maxPeers: isMobile ? 10 : 50,
          fallbackToRelay: true
        },
        sfu: {
          enabled: !isMobile,
          serverUrl: 'wss://sfu.diddyhome.com',
          roomId: streamId
        },
        adaptiveQuality: {
          enabled: true,
          minBitrate: isMobile ? 500 : 1000,
          maxBitrate: isMobile ? 3000 : 8000,
          targetLatency: isMobile ? 200 : 100
        }
      },
      
      recording: {
        enabled: true,
        autoRecord: false,
        format: 'mp4',
        quality: isMobile ? 'medium' : 'high',
        storage: {
          provider: 'local',
          retention: 30
        },
        postProcessing: {
          enabled: true,
          generateThumbnails: true,
          createHighlights: false,
          transcoding: isMobile ? [
            { resolution: '854x480', bitrate: 1500, format: 'mp4' }
          ] : [
            { resolution: '1280x720', bitrate: 2500, format: 'mp4' },
            { resolution: '854x480', bitrate: 1500, format: 'mp4' }
          ]
        }
      },
      
      security: {
        authentication: {
          required: false,
          method: 'token'
        },
        encryption: {
          enabled: true,
          method: 'aes-256',
          keyRotation: true,
          rotationInterval: 30
        },
        ddosProtection: {
          enabled: true,
          rateLimit: 100
        },
        moderation: {
          chatEnabled: true,
          moderators: [userId],
          autoModeration: true,
          bannedWords: ['spam', 'scam', 'fake']
        }
      },
      
      createdAt: new Date().toISOString(),
      
      stats: {
        currentViewers: 0,
        peakViewers: 0,
        totalViews: 0,
        technical: {
          bitrate: 0,
          fps: 0,
          droppedFrames: 0,
          latency: 0,
          health: 'excellent',
          uptime: 100
        },
        engagement: {
          chatMessages: 0,
          likes: 0,
          shares: 0
        },
        geography: {}
      },
      
      monetization: {
        enabled: true,
        donations: {
          enabled: true,
          minAmount: 1,
          currency: 'EUR',
          platforms: ['paypal', 'stripe']
        },
        subscriptions: {
          enabled: true,
          tiers: [
            {
              id: 'basic',
              name: 'Supporter',
              price: 4.99,
              currency: 'EUR',
              benefits: ['Chat prioritaire', 'Emotes exclusives'],
              color: 'blue'
            },
            {
              id: 'premium',
              name: 'VIP',
              price: 9.99,
              currency: 'EUR',
              benefits: ['Accès streams privés', 'Discord VIP', 'Replays exclusifs'],
              color: 'gold'
            }
          ]
        },
        ads: {
          enabled: false,
          preRoll: false,
          midRoll: false,
          postRoll: false,
          frequency: 15
        },
        merchandise: {
          enabled: false,
          products: []
        }
      }
    };
  }

  // Générer une clé de stream sécurisée
  static generateSecureStreamKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Sauvegarder une configuration
  static saveStreamConfig(config: StreamingConfig): void {
    if (typeof window === 'undefined') return;
    
    try {
      const configs = this.loadStreamConfigs();
      const existingIndex = configs.findIndex(c => c.id === config.id);
      
      if (existingIndex !== -1) {
        configs[existingIndex] = config;
      } else {
        configs.push(config);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configs));
    } catch (error) {
      console.error('Erreur sauvegarde config streaming:', error);
    }
  }

  // Charger les configurations
  static loadStreamConfigs(): StreamingConfig[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur chargement configs streaming:', error);
      return [];
    }
  }

  // Obtenir une configuration par ID
  static getStreamConfig(streamId: string): StreamingConfig | null {
    const configs = this.loadStreamConfigs();
    return configs.find(c => c.id === streamId) || null;
  }

  // Démarrer un stream
  static async startStream(streamId: string): Promise<boolean> {
    try {
      const config = this.getStreamConfig(streamId);
      if (!config) return false;

      config.isLive = true;
      config.startedAt = new Date().toISOString();
      
      this.saveStreamConfig(config);
      this.addToActiveStreams(streamId);
      
      return true;
    } catch (error) {
      console.error('Erreur démarrage stream:', error);
      return false;
    }
  }

  // Arrêter un stream
  static async stopStream(streamId: string): Promise<boolean> {
    try {
      const config = this.getStreamConfig(streamId);
      if (!config) return false;

      config.isLive = false;
      config.endedAt = new Date().toISOString();
      
      if (config.startedAt) {
        const duration = new Date().getTime() - new Date(config.startedAt).getTime();
        config.duration = Math.floor(duration / 1000); // en secondes
      }
      
      this.saveStreamConfig(config);
      this.removeFromActiveStreams(streamId);
      
      return true;
    } catch (error) {
      console.error('Erreur arrêt stream:', error);
      return false;
    }
  }

  // Gestion des streams actifs
  private static addToActiveStreams(streamId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const active = this.getActiveStreams();
      if (!active.includes(streamId)) {
        active.push(streamId);
        localStorage.setItem(this.ACTIVE_STREAMS_KEY, JSON.stringify(active));
      }
    } catch (error) {
      console.error('Erreur ajout stream actif:', error);
    }
  }

  private static removeFromActiveStreams(streamId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const active = this.getActiveStreams();
      const filtered = active.filter(id => id !== streamId);
      localStorage.setItem(this.ACTIVE_STREAMS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Erreur suppression stream actif:', error);
    }
  }

  static getActiveStreams(): string[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.ACTIVE_STREAMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur chargement streams actifs:', error);
      return [];
    }
  }

  // Obtenir les streams live
  static getLiveStreams(): StreamingConfig[] {
    const configs = this.loadStreamConfigs();
    return configs.filter(c => c.isLive);
  }

  // Mettre à jour les stats d'un stream
  static updateStreamStats(streamId: string, stats: Partial<StreamStats>): void {
    const config = this.getStreamConfig(streamId);
    if (!config) return;

    config.stats = { ...config.stats, ...stats };
    this.saveStreamConfig(config);
  }

  // Générer des instructions OBS
  static generateOBSInstructions(config: StreamingConfig): string {
    return `
=== CONFIGURATION OBS STUDIO ===

1. Ouvrir OBS Studio
2. Aller dans Paramètres > Stream
3. Service: Personnalisé
4. Serveur: ${config.rtmp.serverUrl}
5. Clé de stream: ${config.rtmp.streamKey}

=== PARAMÈTRES VIDÉO RECOMMANDÉS ===
• Résolution: ${config.rtmp.video.resolution}
• FPS: ${config.rtmp.video.fps}
• Débit vidéo: ${config.rtmp.video.bitrate} kbps
• Encodeur: x264 ou NVENC (si GPU NVIDIA)
• Profil: ${config.rtmp.video.profile}

=== PARAMÈTRES AUDIO ===
• Débit audio: ${config.rtmp.audio.bitrate} kbps
• Fréquence: ${config.rtmp.audio.sampleRate} Hz
• Canaux: ${config.rtmp.audio.channels === 2 ? 'Stéréo' : 'Mono'}

⚠️ SÉCURITÉ ⚠️
• Ne partagez JAMAIS votre clé de stream
• La clé expire le: ${config.rtmp.authentication.expiresAt ? new Date(config.rtmp.authentication.expiresAt).toLocaleString('fr-FR') : 'Non défini'}
• Générez une nouvelle clé si compromise

🎯 CONSEILS PERFORMANCE
• Connexion internet stable (upload min: ${Math.ceil(config.rtmp.video.bitrate * 1.2 / 1000)} Mbps)
• Fermer les applications gourmandes
• Tester avant le stream en direct
    `.trim();
  }

  // Générer des instructions mobile
  static generateMobileInstructions(config: StreamingConfig): string {
    return `
=== STREAMING MOBILE DIDDYHOME ===

📱 OPTION 1: Application DiddyHome (Recommandé)
1. Ouvrir l'app DiddyHome
2. Aller dans "Live Streaming"
3. Appuyer sur "Démarrer le stream"
4. Autoriser caméra et micro
5. Configurer titre et description
6. Appuyer sur "Go Live!"

📱 OPTION 2: Navigateur Mobile
1. Ouvrir ${window.location.origin}/external/social/hub
2. Cliquer sur "Live Streaming"
3. Sélectionner "Stream depuis mobile"
4. Autoriser caméra et micro
5. Configurer et démarrer

🔧 PARAMÈTRES AUTOMATIQUES
• Qualité: ${config.webrtc?.adaptiveQuality.enabled ? 'Adaptative' : 'Fixe'}
• Résolution max: ${config.rtmp.video.resolution}
• Débit adaptatif: ${config.webrtc?.adaptiveQuality.minBitrate}-${config.webrtc?.adaptiveQuality.maxBitrate} kbps

📶 CONSEILS MOBILE
• Utiliser WiFi ou 4G/5G stable
• Garder le téléphone branché
• Fermer les autres apps
• Mode "Ne pas déranger" activé
• Position paysage recommandée

🔒 SÉCURITÉ MOBILE
• Connexion chiffrée automatique
• Pas de clé RTMP nécessaire
• Stream ID: ${config.id}
    `.trim();
  }

  // Vérifier la compatibilité WebRTC
  static checkWebRTCSupport(): {
    supported: boolean;
    features: {
      getUserMedia: boolean;
      RTCPeerConnection: boolean;
      mediaRecorder: boolean;
      screenShare: boolean;
    };
  } {
    if (typeof window === 'undefined') {
      return {
        supported: false,
        features: {
          getUserMedia: false,
          RTCPeerConnection: false,
          mediaRecorder: false,
          screenShare: false
        }
      };
    }

    const features = {
      getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      RTCPeerConnection: !!(window.RTCPeerConnection || window.webkitRTCPeerConnection),
      mediaRecorder: !!(window.MediaRecorder),
      screenShare: !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)
    };

    return {
      supported: Object.values(features).every(f => f),
      features
    };
  }

  // Détecter si on est sur mobile
  static isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Obtenir les contraintes média optimales
  static getOptimalMediaConstraints(isMobile: boolean = false): MediaStreamConstraints {
    return {
      video: {
        width: { ideal: isMobile ? 1280 : 1920 },
        height: { ideal: isMobile ? 720 : 1080 },
        frameRate: { ideal: isMobile ? 30 : 60 },
        facingMode: isMobile ? 'user' : undefined
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
        channelCount: 2
      }
    };
  }
}
