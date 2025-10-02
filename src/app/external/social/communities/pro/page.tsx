'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { logMockDataWarning } from '@/lib/mockDataManager';
import { 
  Truck, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Calendar,
  MapPin,
  Star,
  Share2,
  Bell,
  Settings,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Heart,
  MessageSquare,
  Bookmark
} from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    role: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Marc Dubois',
      avatar: '👨‍💼',
      verified: true,
      role: 'Chauffeur VTC Premium'
    },
    content: 'Excellente journée aujourd\'hui ! 15 courses avec une moyenne de 4.9⭐. Le secret ? Un véhicule impeccable et le sourire ! 😊 #VTC #Service #Excellence',
    image: '/api/placeholder/400/300',
    timestamp: 'Il y a 2h',
    likes: 47,
    comments: 12,
    shares: 8,
    tags: ['#VTC', '#Service', '#Excellence']
  },
  {
    id: '2',
    author: {
      name: 'Sophie Martin',
      avatar: '👩‍💼',
      verified: true,
      role: 'Gestionnaire de flotte'
    },
    content: 'Nouveau partenariat avec DiddyHome pour l\'assurance flotte ! Réduction de 15% sur les primes. Qui est intéressé ? 🚗💼',
    timestamp: 'Il y a 4h',
    likes: 89,
    comments: 23,
    shares: 15,
    tags: ['#Assurance', '#Partenariat', '#Économies']
  },
  {
    id: '3',
    author: {
      name: 'Ahmed Benali',
      avatar: '👨‍🔧',
      verified: false,
      role: 'Mécanicien spécialisé'
    },
    content: 'Astuce du jour : Vérifiez vos pneus toutes les 2 semaines ! Un pneu bien gonflé = économie de carburant + sécurité. Simple mais efficace ! 🔧⚡',
    timestamp: 'Il y a 6h',
    likes: 156,
    comments: 34,
    shares: 28,
    tags: ['#Maintenance', '#Astuce', '#Économie']
  }
];

export default function CommunauteProPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleJoinCommunity = () => {
    setIsJoined(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/external/social/communities"
                className="mr-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              
              <div className="flex items-center">
                <div className="bg-white/20 p-4 rounded-xl mr-4">
                  <Truck className="w-12 h-12" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Communauté Pro</h1>
                  <p className="text-blue-100 mt-1">La plus grande communauté de professionnels connectés</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-8 mt-6">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span className="font-semibold">12,847 membres</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">8,934 posts</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="font-semibold">Très actif</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['#Pro', '#Communauté', '#Professionnel', '#VTC', '#Taxi', '#Transport'].map((tag, index) => (
              <span key={index} className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {!isJoined ? (
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Rejoindre la communauté</h3>
                  <p className="text-gray-600 text-sm mb-4">Accédez à tous les contenus et participez aux discussions</p>
                  <button
                    onClick={handleJoinCommunity}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Rejoindre
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-green-600 text-4xl mb-2">✅</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Membre actif</h3>
                  <p className="text-gray-600 text-sm">Vous faites partie de cette communauté</p>
                </div>
              )}
            </div>

            {/* Community Rules */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Règles de la communauté</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Respectez les autres membres</li>
                <li>• Partagez des contenus professionnels</li>
                <li>• Pas de spam ou publicité</li>
                <li>• Aidez-vous mutuellement</li>
                <li>• Restez constructif</li>
              </ul>
            </div>

            {/* Top Members */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⭐ Membres actifs</h3>
              <div className="space-y-3">
                {[
                  { name: 'Marc Dubois', role: 'VTC Premium', avatar: '👨‍💼' },
                  { name: 'Sophie Martin', role: 'Gestionnaire', avatar: '👩‍💼' },
                  { name: 'Ahmed Benali', role: 'Mécanicien', avatar: '👨‍🔧' }
                ].map((member, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-2xl mr-3">{member.avatar}</span>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* New Post */}
            {isJoined && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-start space-x-4">
                  <span className="text-3xl">👤</span>
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Partagez quelque chose avec la communauté..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4 text-gray-500">
                        <button className="flex items-center hover:text-blue-600">
                          <Plus className="w-5 h-5 mr-1" />
                          Photo
                        </button>
                        <button className="flex items-center hover:text-blue-600">
                          <MapPin className="w-5 h-5 mr-1" />
                          Lieu
                        </button>
                      </div>
                      <button
                        disabled={!newPost.trim()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Publier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{post.author.avatar}</span>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
                          {post.author.verified && (
                            <Star className="w-4 h-4 text-blue-500 ml-1" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{post.author.role} • {post.timestamp}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-gray-800 mb-3">{post.content}</p>
                    {post.image && (
                      <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                        <span className="text-gray-500">📸 Image</span>
                      </div>
                    )}
                  </div>

                  {/* Post Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-5 h-5 mr-1" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageSquare className="w-5 h-5 mr-1" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-green-500 transition-colors">
                        <Share2 className="w-5 h-5 mr-1" />
                        <span>{post.shares}</span>
                      </button>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                Charger plus de posts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
