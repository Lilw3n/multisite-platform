'use client';

import React, { useState, useEffect, useRef } from 'react';
import { StreamingService } from '@/lib/streamingService';
import { StreamingConfig } from '@/types/streaming';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  RotateCcw, 
  Settings, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye,
  Smartphone,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Play,
  Square,
  Camera,
  FlipHorizontal,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function MobileStreamingPage() {
  const [streamConfig, setStreamConfig] = useState<StreamingConfig | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [streamTitle, setStreamTitle] = useState('');
  const [currentViewers, setCurrentViewers] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [networkStrength, setNetworkStrength] = useState(4);
  const [streamQuality, setStreamQuality] = useState<'auto' | 'high' | 'medium' | 'low'>('auto');
  const [showSettings, setShowSettings] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Générer une config pour mobile
    const config = StreamingService.generateStreamConfig('mobile-user', streamTitle || 'Live Mobile', true);
    setStreamConfig(config);

    // Simuler les stats système
    simulateSystemStats();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [streamTitle]);

  const simulateSystemStats = () => {
    const interval = setInterval(() => {
      // Simuler batterie qui se décharge
      setBatteryLevel(prev => Math.max(20, prev - Math.random() * 2));
      
      // Simuler force du signal
      setNetworkStrength(Math.floor(Math.random() * 5));
      
      // Simuler viewers
      if (isStreaming) {
        setCurrentViewers(prev => Math.max(0, prev + Math.floor(Math.random() * 10) - 4));
      }
    }, 5000);

    return () => clearInterval(interval);
  };

  const initializeCamera = async () => {
    try {
      setConnectionStatus('connecting');
      
      const constraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Erreur accès caméra:', error);
      setConnectionStatus('error');
    }
  };

  const startStreaming = async () => {
    if (!streamConfig) return;

    try {
      await initializeCamera();
      
      const success = await StreamingService.startStream(streamConfig.id);
      if (success) {
        setIsStreaming(true);
        simulateChat();
      }
    } catch (error) {
      console.error('Erreur démarrage stream:', error);
    }
  };

  const stopStreaming = async () => {
    if (!streamConfig) return;

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      await StreamingService.stopStream(streamConfig.id);
      setIsStreaming(false);
      setConnectionStatus('disconnected');
    } catch (error) {
      console.error('Erreur arrêt stream:', error);
    }
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleMicrophone = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const switchCamera = async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    
    if (isStreaming) {
      // Redémarrer avec la nouvelle caméra
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      await initializeCamera();
    }
  };

  const simulateChat = () => {
    const messages = [
      { user: 'Sophie_VTC', message: 'Salut ! Ça va bien ?', emoji: '👋' },
      { user: 'Jean_Pro', message: 'Super stream !', emoji: '🔥' },
      { user: 'Marie_Expert', message: 'Question: tu es où ?', emoji: '❓' },
      { user: 'Alex_Deals', message: 'Merci pour les conseils !', emoji: '🙏' }
    ];

    const interval = setInterval(() => {
      if (!isStreaming) {
        clearInterval(interval);
        return;
      }

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setChatMessages(prev => [...prev.slice(-10), {
        id: Date.now(),
        ...randomMessage,
        timestamp: new Date().toISOString()
      }]);
    }, 3000);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      user: 'Vous',
      message: newMessage,
      timestamp: new Date().toISOString()
    }]);
    setNewMessage('');
  };

  const getNetworkIcon = () => {
    if (networkStrength >= 4) return <Signal className="h-4 w-4 text-green-500" />;
    if (networkStrength >= 2) return <Signal className="h-4 w-4 text-yellow-500" />;
    return <WifiOff className="h-4 w-4 text-red-500" />;
  };

  const getBatteryColor = () => {
    if (batteryLevel > 50) return 'text-green-500';
    if (batteryLevel > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (!streamConfig) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black bg-opacity-50 px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <span>9:41</span>
            {isStreaming && (
              <div className="flex items-center space-x-1 bg-red-600 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">LIVE</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {getNetworkIcon()}
            <div className="flex items-center space-x-1">
              <Battery className={`h-4 w-4 ${getBatteryColor()}`} />
              <span className="text-xs">{Math.round(batteryLevel)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Preview */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
        />
        
        {!isVideoEnabled && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <VideoOff className="h-16 w-16 text-gray-400" />
          </div>
        )}

        {/* Stream Info Overlay */}
        {isStreaming && (
          <div className="absolute top-16 left-4 right-4">
            <div className="bg-black bg-opacity-50 rounded-lg p-3">
              <h2 className="font-bold text-lg mb-1">{streamTitle || 'Live Mobile'}</h2>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{currentViewers}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>{Math.floor(currentViewers * 1.5)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>{streamQuality}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {isStreaming && chatMessages.length > 0 && (
          <div className="absolute bottom-32 left-4 right-4">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {chatMessages.slice(-5).map((msg) => (
                <div key={msg.id} className="bg-black bg-opacity-50 rounded-lg p-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">{msg.user}:</span>
                    <span className="text-sm">{msg.message}</span>
                    {msg.emoji && <span>{msg.emoji}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          {/* Stream Title Input */}
          {!isStreaming && (
            <div className="mb-4">
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                placeholder="Titre de votre live..."
                className="w-full bg-black bg-opacity-50 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Chat Input */}
          {isStreaming && (
            <div className="mb-4 flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Tapez votre message..."
                className="flex-1 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-6">
            {/* Camera Toggle */}
            <button
              onClick={toggleCamera}
              className={`p-4 rounded-full ${
                isVideoEnabled 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-red-600 hover:bg-red-700'
              } transition-colors`}
            >
              {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </button>

            {/* Start/Stop Stream */}
            <button
              onClick={isStreaming ? stopStreaming : startStreaming}
              disabled={connectionStatus === 'connecting'}
              className={`p-6 rounded-full ${
                isStreaming 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors disabled:opacity-50`}
            >
              {isStreaming ? <Square className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </button>

            {/* Microphone Toggle */}
            <button
              onClick={toggleMicrophone}
              className={`p-4 rounded-full ${
                isAudioEnabled 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-red-600 hover:bg-red-700'
              } transition-colors`}
            >
              {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-center space-x-4 mt-4">
            <button
              onClick={switchCamera}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
            >
              <FlipHorizontal className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
            >
              <Settings className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2 text-sm">
              {connectionStatus === 'connected' && <CheckCircle className="h-4 w-4 text-green-500" />}
              {connectionStatus === 'connecting' && <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />}
              {connectionStatus === 'error' && <AlertTriangle className="h-4 w-4 text-red-500" />}
              <span className="capitalize">{connectionStatus}</span>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-6 w-80 max-w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Paramètres Stream</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Qualité</label>
                  <select
                    value={streamQuality}
                    onChange={(e) => setStreamQuality(e.target.value as any)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="auto">Automatique</option>
                    <option value="high">Haute (720p)</option>
                    <option value="medium">Moyenne (480p)</option>
                    <option value="low">Faible (360p)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Caméra</label>
                  <select
                    value={facingMode}
                    onChange={(e) => setFacingMode(e.target.value as any)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="user">Avant</option>
                    <option value="environment">Arrière</option>
                  </select>
                </div>

                <div className="text-sm text-gray-400">
                  <p>• Utilisez le WiFi pour une meilleure qualité</p>
                  <p>• Gardez votre téléphone branché</p>
                  <p>• Évitez les autres apps pendant le stream</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
