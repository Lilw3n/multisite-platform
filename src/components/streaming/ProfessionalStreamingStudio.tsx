'use client';

import React, { useState, useEffect, useRef } from 'react';
import { StreamingConfig } from '@/types/streaming';
import { StreamingService } from '@/lib/streamingService';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Settings, 
  Monitor, 
  Smartphone, 
  Radio,
  Play,
  Square,
  Users,
  MessageCircle,
  Heart,
  Share2,
  Eye,
  Signal,
  Wifi,
  WifiOff,
  Camera,
  RotateCcw,
  Maximize,
  Volume2,
  VolumeX,
  Copy,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Key,
  Globe
} from 'lucide-react';

interface ProfessionalStreamingStudioProps {
  userId: string;
  onStreamStart?: (streamId: string) => void;
  onStreamEnd?: (streamId: string) => void;
}

export default function ProfessionalStreamingStudio({ 
  userId, 
  onStreamStart, 
  onStreamEnd 
}: ProfessionalStreamingStudioProps) {
  const [streamConfig, setStreamConfig] = useState<StreamingConfig | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMethod, setStreamingMethod] = useState<'obs' | 'mobile' | 'browser'>('browser');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [currentViewers, setCurrentViewers] = useState(0);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [webrtcSupport, setWebrtcSupport] = useState(StreamingService.checkWebRTCSupport());
  const [isMobile, setIsMobile] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    setIsMobile(StreamingService.isMobileDevice());
    
    // Générer une config par défaut
    const config = StreamingService.generateStreamConfig(
      userId, 
      streamTitle || 'Mon Stream Live',
      StreamingService.isMobileDevice()
    );
    setStreamConfig(config);
  }, [userId, streamTitle]);

  // Initialiser la caméra/micro
  const initializeMedia = async () => {
    try {
      setConnectionStatus('connecting');
      
      const constraints = StreamingService.getOptimalMediaConstraints(isMobile);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Erreur accès média:', error);
      setConnectionStatus('error');
    }
  };

  // Démarrer le streaming
  const startStreaming = async () => {
    if (!streamConfig) return;

    try {
      setConnectionStatus('connecting');
      
      if (streamingMethod === 'browser' || streamingMethod === 'mobile') {
        await initializeMedia();
        
        if (webrtcSupport.supported) {
          await initializeWebRTC();
        }
      }

      const success = await StreamingService.startStream(streamConfig.id);
      if (success) {
        setIsStreaming(true);
        setConnectionStatus('connected');
        onStreamStart?.(streamConfig.id);
        
        // Simuler des viewers
        simulateViewers();
      }
    } catch (error) {
      console.error('Erreur démarrage stream:', error);
      setConnectionStatus('error');
    }
  };

  // Arrêter le streaming
  const stopStreaming = async () => {
    if (!streamConfig) return;

    try {
      // Arrêter les médias
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // Fermer WebRTC
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      const success = await StreamingService.stopStream(streamConfig.id);
      if (success) {
        setIsStreaming(false);
        setConnectionStatus('disconnected');
        onStreamEnd?.(streamConfig.id);
      }
    } catch (error) {
      console.error('Erreur arrêt stream:', error);
    }
  };

  // Initialiser WebRTC
  const initializeWebRTC = async () => {
    if (!streamConfig?.webrtc || !streamRef.current) return;

    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: streamConfig.webrtc.iceServers
      });

      streamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, streamRef.current!);
      });

      peerConnectionRef.current = peerConnection;
    } catch (error) {
      console.error('Erreur WebRTC:', error);
    }
  };

  // Simuler des viewers (pour la démo)
  const simulateViewers = () => {
    const interval = setInterval(() => {
      if (!isStreaming) {
        clearInterval(interval);
        return;
      }
      
      setCurrentViewers(prev => {
        const change = Math.floor(Math.random() * 10) - 4; // -4 à +5
        return Math.max(0, prev + change);
      });
    }, 5000);
  };

  // Copier la clé de stream
  const copyStreamKey = async () => {
    if (!streamConfig?.rtmp.streamKey) return;
    
    try {
      await navigator.clipboard.writeText(streamConfig.rtmp.streamKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch (error) {
      console.error('Erreur copie clé:', error);
    }
  };

  // Toggle vidéo
  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="h-5 w-5 text-green-500" />;
      case 'connecting': return <Signal className="h-5 w-5 text-yellow-500 animate-pulse" />;
      case 'error': return <WifiOff className="h-5 w-5 text-red-500" />;
      default: return <WifiOff className="h-5 w-5 text-gray-400" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connecté';
      case 'connecting': return 'Connexion...';
      case 'error': return 'Erreur connexion';
      default: return 'Déconnecté';
    }
  };

  if (!streamConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec titre et statut */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Video className="h-6 w-6 text-blue-600" />
              <span>Studio de Streaming</span>
            </h2>
            <p className="text-gray-600">Diffusez en direct avec OBS, votre téléphone ou navigateur</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Statut connexion */}
            <div className="flex items-center space-x-2">
              {getConnectionIcon()}
              <span className="text-sm font-medium">{getConnectionText()}</span>
            </div>
            
            {/* Viewers */}
            {isStreaming && (
              <div className="flex items-center space-x-2 bg-red-100 text-red-700 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <Eye className="h-4 w-4" />
                <span className="font-medium">{currentViewers}</span>
              </div>
            )}
          </div>
        </div>

        {/* Configuration du stream */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du stream
            </label>
            <input
              type="text"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              placeholder="Donnez un titre à votre stream..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isStreaming}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnelle)
            </label>
            <input
              type="text"
              value={streamDescription}
              onChange={(e) => setStreamDescription(e.target.value)}
              placeholder="Décrivez votre stream..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isStreaming}
            />
          </div>
        </div>

        {/* Méthode de streaming */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Méthode de streaming
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setStreamingMethod('obs')}
              className={`p-4 border-2 rounded-lg transition-all ${
                streamingMethod === 'obs'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              disabled={isStreaming}
            >
              <div className="flex flex-col items-center space-y-2">
                <Monitor className="h-8 w-8 text-blue-600" />
                <span className="font-medium">OBS Studio</span>
                <span className="text-xs text-gray-500">Professionnel</span>
              </div>
            </button>
            
            <button
              onClick={() => setStreamingMethod('mobile')}
              className={`p-4 border-2 rounded-lg transition-all ${
                streamingMethod === 'mobile'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              disabled={isStreaming}
            >
              <div className="flex flex-col items-center space-y-2">
                <Smartphone className="h-8 w-8 text-green-600" />
                <span className="font-medium">Téléphone</span>
                <span className="text-xs text-gray-500">Simple & rapide</span>
              </div>
            </button>
            
            <button
              onClick={() => setStreamingMethod('browser')}
              className={`p-4 border-2 rounded-lg transition-all ${
                streamingMethod === 'browser'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              disabled={isStreaming}
            >
              <div className="flex flex-col items-center space-y-2">
                <Globe className="h-8 w-8 text-purple-600" />
                <span className="font-medium">Navigateur</span>
                <span className="text-xs text-gray-500">Webcam directe</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Aperçu vidéo et contrôles */}
      {(streamingMethod === 'browser' || streamingMethod === 'mobile') && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Aperçu en direct</span>
          </h3>
          
          <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <VideoOff className="h-16 w-16 text-gray-400" />
              </div>
            )}
            
            {/* Overlay de contrôles */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={toggleVideo}
                  className={`p-2 rounded-full ${
                    isVideoEnabled 
                      ? 'bg-gray-800 bg-opacity-50 text-white' 
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>
                
                <button
                  onClick={toggleAudio}
                  className={`p-2 rounded-full ${
                    isAudioEnabled 
                      ? 'bg-gray-800 bg-opacity-50 text-white' 
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </button>
              </div>
              
              {isStreaming && (
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>EN DIRECT</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Contrôles de streaming */}
          <div className="flex items-center justify-center space-x-4">
            {!isStreaming ? (
              <button
                onClick={startStreaming}
                disabled={connectionStatus === 'connecting'}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                <Play className="h-5 w-5" />
                <span>Démarrer le stream</span>
              </button>
            ) : (
              <button
                onClick={stopStreaming}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Square className="h-5 w-5" />
                <span>Arrêter le stream</span>
              </button>
            )}
            
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <Info className="h-5 w-5" />
              <span>Instructions</span>
            </button>
          </div>
        </div>
      )}

      {/* Configuration OBS */}
      {streamingMethod === 'obs' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Configuration OBS Studio</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Paramètres RTMP */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serveur RTMP
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={streamConfig.rtmp.serverUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(streamConfig.rtmp.serverUrl)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <Key className="h-4 w-4" />
                  <span>Clé de stream</span>
                  <Shield className="h-4 w-4 text-green-500" title="Sécurisé" />
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    value={streamConfig.rtmp.streamKey}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                  />
                  <button
                    onClick={copyStreamKey}
                    className={`p-2 transition-colors ${
                      copiedKey ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {copiedKey ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ Ne partagez jamais cette clé. Elle expire le {new Date(streamConfig.rtmp.authentication.expiresAt!).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            
            {/* Paramètres recommandés */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Paramètres recommandés</span>
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Résolution:</span>
                  <span className="font-medium">{streamConfig.rtmp.video.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">FPS:</span>
                  <span className="font-medium">{streamConfig.rtmp.video.fps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Débit vidéo:</span>
                  <span className="font-medium">{streamConfig.rtmp.video.bitrate} kbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Débit audio:</span>
                  <span className="font-medium">{streamConfig.rtmp.audio.bitrate} kbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Encodeur:</span>
                  <span className="font-medium">x264 / NVENC</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center space-x-4">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <Info className="h-5 w-5" />
              <span>Guide complet OBS</span>
            </button>
            
            <button
              onClick={startStreaming}
              disabled={isStreaming}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <Radio className="h-5 w-5" />
              <span>{isStreaming ? 'Stream actif' : 'Marquer comme live'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Instructions détaillées */}
      {showInstructions && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Instructions détaillées
            </h3>
            <button
              onClick={() => setShowInstructions(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {streamingMethod === 'obs' 
                ? StreamingService.generateOBSInstructions(streamConfig)
                : StreamingService.generateMobileInstructions(streamConfig)
              }
            </pre>
          </div>
        </div>
      )}

      {/* Alertes et notifications */}
      {!webrtcSupport.supported && streamingMethod !== 'obs' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">Compatibilité limitée</span>
          </div>
          <p className="text-yellow-700 mt-1">
            Votre navigateur ne supporte pas toutes les fonctionnalités WebRTC. 
            Utilisez OBS Studio pour une expérience optimale.
          </p>
        </div>
      )}
    </div>
  );
}
