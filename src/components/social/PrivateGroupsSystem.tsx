'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Users, 
  MessageCircle, 
  Plus, 
  Search, 
  Settings, 
  Crown, 
  Shield, 
  Eye, 
  EyeOff,
  UserPlus,
  UserMinus,
  MoreHorizontal,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info,
  Bell,
  BellOff,
  Star,
  Pin,
  Archive,
  Trash2,
  Copy,
  Share2,
  Download,
  Image,
  File,
  Mic,
  Camera,
  MapPin,
  Calendar,
  Clock,
  Check,
  CheckCheck,
  X
} from 'lucide-react';

interface PrivateGroup {
  id: string;
  name: string;
  description: string;
  avatar: string;
  type: 'private' | 'secret' | 'public';
  memberCount: number;
  maxMembers: number;
  createdBy: string;
  createdAt: string;
  lastActivity: string;
  isAdmin: boolean;
  isMember: boolean;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  settings: {
    allowInvites: boolean;
    allowMediaSharing: boolean;
    allowVoiceMessages: boolean;
    allowVideoCall: boolean;
    messageHistory: 'all' | 'recent' | 'none';
    autoDelete: number; // heures, 0 = jamais
  };
}

interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'video' | 'location' | 'system';
  timestamp: string;
  isRead: boolean;
  isDelivered: boolean;
  replyTo?: string;
  reactions: { emoji: string; users: string[] }[];
  isEdited: boolean;
  isDeleted: boolean;
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  lastSeen: string;
  isOnline: boolean;
  permissions: string[];
}

export default function PrivateGroupsSystem() {
  const [activeView, setActiveView] = useState<'groups' | 'chat' | 'create'>('groups');
  const [selectedGroup, setSelectedGroup] = useState<PrivateGroup | null>(null);
  const [groups, setGroups] = useState<PrivateGroup[]>([]);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  useEffect(() => {
    // Charger les groupes mockés
    setGroups([
      {
        id: '1',
        name: 'Équipe VIP Assurance',
        description: 'Groupe privé pour les conseillers premium',
        avatar: '🛡️',
        type: 'private',
        memberCount: 12,
        maxMembers: 50,
        createdBy: 'Admin DiddyHome',
        createdAt: '2024-12-15',
        lastActivity: '2025-01-02 14:30',
        isAdmin: true,
        isMember: true,
        unreadCount: 3,
        isPinned: true,
        isArchived: false,
        settings: {
          allowInvites: true,
          allowMediaSharing: true,
          allowVoiceMessages: true,
          allowVideoCall: true,
          messageHistory: 'all',
          autoDelete: 0
        }
      },
      {
        id: '2',
        name: 'Pros Transport 🚗',
        description: 'Entraide entre professionnels du transport',
        avatar: '🚗',
        type: 'private',
        memberCount: 47,
        maxMembers: 100,
        createdBy: 'Marie Expert',
        createdAt: '2024-11-20',
        lastActivity: '2025-01-02 16:45',
        isAdmin: false,
        isMember: true,
        unreadCount: 0,
        isPinned: false,
        isArchived: false,
        settings: {
          allowInvites: false,
          allowMediaSharing: true,
          allowVoiceMessages: true,
          allowVideoCall: false,
          messageHistory: 'recent',
          autoDelete: 168 // 7 jours
        }
      },
      {
        id: '3',
        name: 'Cercle Entrepreneurs Elite',
        description: 'Réseau exclusif des top entrepreneurs',
        avatar: '👑',
        type: 'secret',
        memberCount: 8,
        maxMembers: 20,
        createdBy: 'Thomas CEO',
        createdAt: '2024-10-05',
        lastActivity: '2025-01-02 12:15',
        isAdmin: false,
        isMember: true,
        unreadCount: 7,
        isPinned: true,
        isArchived: false,
        settings: {
          allowInvites: false,
          allowMediaSharing: false,
          allowVoiceMessages: false,
          allowVideoCall: true,
          messageHistory: 'none',
          autoDelete: 24 // 1 jour
        }
      },
      {
        id: '4',
        name: 'Support Client Premium',
        description: 'Support dédié clients premium',
        avatar: '💎',
        type: 'private',
        memberCount: 156,
        maxMembers: 500,
        createdBy: 'DiddyHome Support',
        createdAt: '2024-09-01',
        lastActivity: '2025-01-02 17:22',
        isAdmin: false,
        isMember: true,
        unreadCount: 12,
        isPinned: false,
        isArchived: false,
        settings: {
          allowInvites: false,
          allowMediaSharing: true,
          allowVoiceMessages: false,
          allowVideoCall: false,
          messageHistory: 'recent',
          autoDelete: 72 // 3 jours
        }
      }
    ]);

    // Messages mockés
    setMessages([
      {
        id: '1',
        groupId: '1',
        senderId: 'user1',
        senderName: 'Sophie Manager',
        senderAvatar: '👩‍💼',
        content: 'Bonjour l\'équipe ! Nouvelle campagne assurance jeunes conducteurs lancée 🚀',
        type: 'text',
        timestamp: '2025-01-02 14:30',
        isRead: true,
        isDelivered: true,
        reactions: [{ emoji: '🚀', users: ['user2', 'user3'] }],
        isEdited: false,
        isDeleted: false
      },
      {
        id: '2',
        groupId: '1',
        senderId: 'user2',
        senderName: 'Marc Conseiller',
        senderAvatar: '👨‍💻',
        content: 'Super ! J\'ai déjà 3 leads intéressés. Les tarifs sont très compétitifs 💪',
        type: 'text',
        timestamp: '2025-01-02 14:32',
        isRead: true,
        isDelivered: true,
        reactions: [{ emoji: '💪', users: ['user1'] }],
        isEdited: false,
        isDeleted: false
      },
      {
        id: '3',
        groupId: '1',
        senderId: 'user3',
        senderName: 'Lisa Pro',
        senderAvatar: '👩‍🚗',
        content: 'Parfait timing ! Mon client de ce matin cherchait exactement ça',
        type: 'text',
        timestamp: '2025-01-02 14:35',
        isRead: false,
        isDelivered: true,
        reactions: [],
        isEdited: false,
        isDeleted: false
      }
    ]);

    // Membres mockés
    setMembers([
      {
        id: 'user1',
        name: 'Sophie Manager',
        avatar: '👩‍💼',
        role: 'admin',
        joinedAt: '2024-12-15',
        lastSeen: '2025-01-02 14:30',
        isOnline: true,
        permissions: ['manage_group', 'manage_members', 'delete_messages']
      },
      {
        id: 'user2',
        name: 'Marc Conseiller',
        avatar: '👨‍💻',
        role: 'member',
        joinedAt: '2024-12-16',
        lastSeen: '2025-01-02 14:32',
        isOnline: true,
        permissions: ['send_messages']
      },
      {
        id: 'user3',
        name: 'Lisa Pro',
        avatar: '👩‍🚗',
        role: 'member',
        joinedAt: '2024-12-18',
        lastSeen: '2025-01-02 14:35',
        isOnline: false,
        permissions: ['send_messages']
      }
    ]);
  }, []);

  const handleGroupSelect = (group: PrivateGroup) => {
    setSelectedGroup(group);
    setActiveView('chat');
    // Marquer les messages comme lus
    const updatedGroups = groups.map(g => 
      g.id === group.id ? { ...g, unreadCount: 0 } : g
    );
    setGroups(updatedGroups);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;

    const message: GroupMessage = {
      id: Date.now().toString(),
      groupId: selectedGroup.id,
      senderId: 'current_user',
      senderName: 'Vous',
      senderAvatar: '👤',
      content: newMessage,
      type: 'text',
      timestamp: new Date().toLocaleString('fr-FR'),
      isRead: false,
      isDelivered: true,
      reactions: [],
      isEdited: false,
      isDeleted: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const getGroupTypeIcon = (type: string) => {
    switch (type) {
      case 'private': return <Lock className="w-4 h-4 text-yellow-600" />;
      case 'secret': return <EyeOff className="w-4 h-4 text-red-600" />;
      case 'public': return <Eye className="w-4 h-4 text-green-600" />;
      default: return <Lock className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-100';
      case 'moderator': return 'text-purple-600 bg-purple-100';
      case 'member': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (activeView === 'create') {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Créer un Groupe Privé</h2>
          <button
            onClick={() => setActiveView('groups')}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du groupe
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Équipe Marketing Pro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Décrivez l'objectif de votre groupe..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de groupe
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="radio" name="groupType" value="private" defaultChecked />
                <Lock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Privé</p>
                  <p className="text-sm text-gray-500">Visible dans les recherches, invitation requise</p>
                </div>
              </label>
              <label className="flex items-center space-x-3">
                <input type="radio" name="groupType" value="secret" />
                <EyeOff className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium">Secret</p>
                  <p className="text-sm text-gray-500">Invisible, accès sur invitation uniquement</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limite de membres
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="20">20 membres</option>
              <option value="50">50 membres</option>
              <option value="100">100 membres</option>
              <option value="250">250 membres</option>
              <option value="500">500 membres</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={() => setActiveView('groups')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Créer le groupe
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (activeView === 'chat' && selectedGroup) {
    return (
      <div className="flex h-screen bg-white">
        
        {/* Chat Header */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveView('groups')}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl">
                {selectedGroup.avatar}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">{selectedGroup.name}</h3>
                  {getGroupTypeIcon(selectedGroup.type)}
                </div>
                <p className="text-sm text-gray-500">{selectedGroup.memberCount} membres</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Video className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowGroupInfo(!showGroupInfo)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages
              .filter(msg => msg.groupId === selectedGroup.id)
              .map((message) => (
                <div key={message.id} className={`flex ${message.senderId === 'current_user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md ${message.senderId === 'current_user' ? 'order-2' : 'order-1'}`}>
                    {message.senderId !== 'current_user' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm">
                          {message.senderAvatar}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{message.senderName}</span>
                      </div>
                    )}
                    <div className={`rounded-lg p-3 ${
                      message.senderId === 'current_user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p>{message.content}</p>
                      {message.reactions.length > 0 && (
                        <div className="flex items-center space-x-1 mt-2">
                          {message.reactions.map((reaction, index) => (
                            <span key={index} className="text-sm bg-white bg-opacity-20 rounded-full px-2 py-1">
                              {reaction.emoji} {reaction.users.length}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                      {message.senderId === 'current_user' && (
                        <div className="flex items-center">
                          {message.isDelivered && <Check className="w-3 h-3 text-gray-400" />}
                          {message.isRead && <CheckCheck className="w-3 h-3 text-blue-500" />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Image className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Mic className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tapez votre message..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Group Info Sidebar */}
        {showGroupInfo && (
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              
              {/* Group Details */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl mx-auto mb-4">
                  {selectedGroup.avatar}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedGroup.name}</h3>
                <p className="text-gray-600 mb-4">{selectedGroup.description}</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  {getGroupTypeIcon(selectedGroup.type)}
                  <span>{selectedGroup.memberCount} membres</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <span>Notifications</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors">
                  <Search className="w-5 h-5 text-gray-500" />
                  <span>Rechercher dans le groupe</span>
                </button>
                {selectedGroup.isAdmin && (
                  <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span>Paramètres du groupe</span>
                  </button>
                )}
              </div>

              {/* Members */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Membres ({members.length})</h4>
                  {selectedGroup.isAdmin && (
                    <button className="text-blue-600 hover:text-blue-700">
                      <UserPlus className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
                          {member.avatar}
                        </div>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                            {member.role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {member.isOnline ? 'En ligne' : `Vu ${member.lastSeen}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Groupes Privés</h1>
          <p className="text-gray-600">Communiquez en toute sécurité avec vos équipes et partenaires</p>
        </div>
        <button
          onClick={() => setActiveView('create')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Créer un groupe</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un groupe..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            onClick={() => handleGroupSelect(group)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl">
                  {group.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    {getGroupTypeIcon(group.type)}
                  </div>
                  <p className="text-sm text-gray-500">{group.memberCount} membres</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {group.isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
                {group.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {group.unreadCount}
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Créé par {group.createdBy}</span>
              <span>{group.lastActivity}</span>
            </div>

            {group.isAdmin && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <Crown className="w-4 h-4" />
                  <span>Administrateur</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun groupe trouvé</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Aucun groupe ne correspond à votre recherche.' : 'Vous n\'avez pas encore rejoint de groupes privés.'}
          </p>
          <button
            onClick={() => setActiveView('create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Créer votre premier groupe
          </button>
        </div>
      )}
    </div>
  );
}
