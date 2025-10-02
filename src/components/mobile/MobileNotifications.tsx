'use client';

import React, { useState, useEffect } from 'react';
import { NotificationService } from '@/lib/notificationService';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  ExternalLink,
  Gift,
  Users,
  Video,
  Briefcase,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal
} from 'lucide-react';

interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'deal' | 'social' | 'live' | 'business';
  data?: any;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

interface MobileNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNotifications({ isOpen, onClose }: MobileNotificationsProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
    
    // Écouter les nouvelles notifications
    const handleNewNotification = () => {
      loadNotifications();
    };

    const handleNotificationRead = () => {
      loadNotifications();
    };

    window.addEventListener('newNotification', handleNewNotification);
    window.addEventListener('notificationRead', handleNotificationRead);
    window.addEventListener('allNotificationsRead', handleNotificationRead);

    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
      window.removeEventListener('notificationRead', handleNotificationRead);
      window.removeEventListener('allNotificationsRead', handleNotificationRead);
    };
  }, []);

  const loadNotifications = () => {
    const allNotifications = NotificationService.getNotifications();
    setNotifications(allNotifications);
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deal': return <Gift className="h-5 w-5 text-green-500" />;
      case 'social': return <Users className="h-5 w-5 text-blue-500" />;
      case 'live': return <Video className="h-5 w-5 text-red-500" />;
      case 'business': return <Briefcase className="h-5 w-5 text-purple-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deal': return 'bg-green-50 border-green-200';
      case 'social': return 'bg-blue-50 border-blue-200';
      case 'live': return 'bg-red-50 border-red-200';
      case 'business': return 'bg-purple-50 border-purple-200';
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now.getTime() - notifTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;
    
    return notifTime.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const handleNotificationClick = (notification: NotificationData) => {
    // Marquer comme lue
    if (!notification.read) {
      NotificationService.markAsRead(notification.id);
    }

    // Rediriger si action
    if (notification.action?.url) {
      window.location.href = notification.action.url;
      onClose();
    }
  };

  const handleMarkAsRead = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    NotificationService.markAsRead(notificationId);
  };

  const handleDelete = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    NotificationService.deleteNotification(notificationId);
  };

  const handleMarkAllAsRead = () => {
    NotificationService.markAllAsRead();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="bg-white h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Filtres et actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Toutes ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Non lues ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
              >
                Tout marquer lu
              </button>
            )}
          </div>
        </div>

        {/* Liste des notifications */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <Bell className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
              </h3>
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? 'Toutes vos notifications ont été lues'
                  : 'Vous recevrez ici vos notifications importantes'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icône de type */}
                    <div className={`p-2 rounded-full ${getTypeColor(notification.type)} border flex-shrink-0`}>
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          {/* Action button */}
                          {notification.action && (
                            <div className="mt-2">
                              <span className="inline-flex items-center space-x-1 text-blue-600 text-sm font-medium">
                                <span>{notification.action.label}</span>
                                <ExternalLink className="h-3 w-3" />
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                              title="Marquer comme lu"
                            >
                              <Check className="h-4 w-4 text-gray-500" />
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => handleDelete(notification.id, e)}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="flex items-center space-x-2 mt-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer avec actions rapides */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {notifications.length} notification{notifications.length > 1 ? 's' : ''} au total
            </span>
            
            <button
              onClick={() => {
                // Demander la permission pour les notifications push
                NotificationService.requestPermission().then((granted) => {
                  if (granted) {
                    // Démarrer les notifications de démo
                    NotificationService.startDemoNotifications();
                  }
                });
              }}
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Activer les notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
