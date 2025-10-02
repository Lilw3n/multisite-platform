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

export class NotificationService {
  private static readonly STORAGE_KEY = 'notifications';
  private static readonly PERMISSION_KEY = 'notification_permission';
  
  // Demander la permission pour les notifications
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Ce navigateur ne supporte pas les notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    localStorage.setItem(this.PERMISSION_KEY, permission);
    return permission === 'granted';
  }

  // Envoyer une notification push
  static async sendNotification(notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>): Promise<void> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    const notificationData: NotificationData = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Sauvegarder dans le storage local
    this.saveNotification(notificationData);

    // Afficher la notification native
    const nativeNotification = new Notification(notification.title, {
      body: notification.message,
      icon: this.getIconForType(notification.type),
      badge: '/icons/badge-96x96.png',
      tag: notification.type,
      requireInteraction: notification.type === 'deal' || notification.type === 'business',
      data: notification.data
    });

    // Gérer le clic sur la notification
    nativeNotification.onclick = () => {
      window.focus();
      if (notification.action?.url) {
        window.location.href = notification.action.url;
      }
      nativeNotification.close();
    };

    // Auto-fermeture après 5 secondes (sauf pour les deals et business)
    if (notification.type !== 'deal' && notification.type !== 'business') {
      setTimeout(() => {
        nativeNotification.close();
      }, 5000);
    }
  }

  // Obtenir l'icône selon le type
  private static getIconForType(type: string): string {
    const icons = {
      info: '/icons/info-notification.png',
      success: '/icons/success-notification.png',
      warning: '/icons/warning-notification.png',
      error: '/icons/error-notification.png',
      deal: '/icons/deal-notification.png',
      social: '/icons/social-notification.png',
      live: '/icons/live-notification.png',
      business: '/icons/business-notification.png'
    };
    return icons[type as keyof typeof icons] || '/icons/default-notification.png';
  }

  // Sauvegarder une notification
  private static saveNotification(notification: NotificationData): void {
    if (typeof window === 'undefined') return;

    try {
      const notifications = this.getNotifications();
      notifications.unshift(notification); // Ajouter au début
      
      // Garder seulement les 100 dernières notifications
      const limitedNotifications = notifications.slice(0, 100);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedNotifications));
      
      // Déclencher un événement personnalisé
      window.dispatchEvent(new CustomEvent('newNotification', { 
        detail: notification 
      }));
    } catch (error) {
      console.error('Erreur sauvegarde notification:', error);
    }
  }

  // Obtenir toutes les notifications
  static getNotifications(): NotificationData[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
      return [];
    }
  }

  // Obtenir les notifications non lues
  static getUnreadNotifications(): NotificationData[] {
    return this.getNotifications().filter(n => !n.read);
  }

  // Marquer une notification comme lue
  static markAsRead(notificationId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const notifications = this.getNotifications();
      const notification = notifications.find(n => n.id === notificationId);
      
      if (notification) {
        notification.read = true;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
        
        // Déclencher un événement
        window.dispatchEvent(new CustomEvent('notificationRead', { 
          detail: { notificationId } 
        }));
      }
    } catch (error) {
      console.error('Erreur marquage notification:', error);
    }
  }

  // Marquer toutes les notifications comme lues
  static markAllAsRead(): void {
    if (typeof window === 'undefined') return;

    try {
      const notifications = this.getNotifications();
      notifications.forEach(n => n.read = true);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
      
      window.dispatchEvent(new CustomEvent('allNotificationsRead'));
    } catch (error) {
      console.error('Erreur marquage toutes notifications:', error);
    }
  }

  // Supprimer une notification
  static deleteNotification(notificationId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const notifications = this.getNotifications();
      const filtered = notifications.filter(n => n.id !== notificationId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      
      window.dispatchEvent(new CustomEvent('notificationDeleted', { 
        detail: { notificationId } 
      }));
    } catch (error) {
      console.error('Erreur suppression notification:', error);
    }
  }

  // Notifications prédéfinies pour DiddyHome
  static async sendDealNotification(dealTitle: string, savings: number, dealUrl: string): Promise<void> {
    await this.sendNotification({
      title: '💰 Nouveau Bon Plan !',
      message: `${dealTitle} - Économisez ${savings}€`,
      type: 'deal',
      data: { dealUrl, savings },
      action: {
        label: 'Voir le deal',
        url: dealUrl
      }
    });
  }

  static async sendLiveNotification(streamerName: string, streamTitle: string, streamUrl: string): Promise<void> {
    await this.sendNotification({
      title: '🔴 Live en cours !',
      message: `${streamerName} : ${streamTitle}`,
      type: 'live',
      data: { streamerName, streamUrl },
      action: {
        label: 'Rejoindre le live',
        url: streamUrl
      }
    });
  }

  static async sendSocialNotification(type: 'follow' | 'like' | 'comment', userName: string, content?: string): Promise<void> {
    const messages = {
      follow: `${userName} a commencé à vous suivre`,
      like: `${userName} a aimé votre publication`,
      comment: `${userName} a commenté : "${content?.substring(0, 50)}..."`
    };

    await this.sendNotification({
      title: '👥 Activité sociale',
      message: messages[type],
      type: 'social',
      data: { type, userName, content },
      action: {
        label: 'Voir l\'activité',
        url: '/external/social/hub'
      }
    });
  }

  static async sendBusinessNotification(title: string, message: string, actionUrl?: string): Promise<void> {
    await this.sendNotification({
      title: `💼 ${title}`,
      message,
      type: 'business',
      data: { actionUrl },
      action: actionUrl ? {
        label: 'Voir détails',
        url: actionUrl
      } : undefined
    });
  }

  // Simuler des notifications pour la démo
  static startDemoNotifications(): void {
    if (typeof window === 'undefined') return;

    // Notification de bienvenue
    setTimeout(() => {
      this.sendNotification({
        title: '🎉 Bienvenue sur DiddyHome !',
        message: 'Découvrez toutes nos fonctionnalités',
        type: 'success',
        action: {
          label: 'Explorer',
          url: '/external/social/hub'
        }
      });
    }, 2000);

    // Deal notification
    setTimeout(() => {
      this.sendDealNotification(
        'Vol Paris-Tokyo',
        600,
        '/external/social/hub#deals'
      );
    }, 10000);

    // Live notification
    setTimeout(() => {
      this.sendLiveNotification(
        'Marie Expert VTC',
        'Conseils assurance en direct',
        '/external/social/hub#live'
      );
    }, 20000);

    // Social notification
    setTimeout(() => {
      this.sendSocialNotification(
        'follow',
        'Alex Deals Master'
      );
    }, 30000);

    // Business notification
    setTimeout(() => {
      this.sendBusinessNotification(
        'Nouveau contrat',
        'Contrat VTC Premium signé - 1,250€ de commission',
        '/dashboard/contracts'
      );
    }, 40000);

    // Notifications périodiques (toutes les 2 minutes)
    setInterval(() => {
      const randomNotifications = [
        () => this.sendDealNotification('iPhone 15 Pro', 200, '/external/social/hub#deals'),
        () => this.sendSocialNotification('like', 'Sophie Immobilier', 'Excellent article !'),
        () => this.sendBusinessNotification('Nouveau lead', 'Demande de devis reçue', '/dashboard/quotes'),
        () => this.sendLiveNotification('Gaming Master', 'Live FIFA 24', '/external/social/hub#live')
      ];

      const randomNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
      randomNotif();
    }, 120000); // 2 minutes
  }

  // Vérifier le support des notifications
  static isSupported(): boolean {
    return 'Notification' in window;
  }

  // Obtenir le statut de permission
  static getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }
}
