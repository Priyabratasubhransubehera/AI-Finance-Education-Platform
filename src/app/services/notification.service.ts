// Notification Service - Manages system notifications for users

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    link: string;
  };
}

export class NotificationService {
  private static readonly STORAGE_KEY = 'wealthnexus_notifications';

  // Generate mock notifications based on user activity
  static getNotifications(): Notification[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp),
      }));
    }

    // Generate initial notifications
    const notifications = this.generateInitialNotifications();
    this.saveNotifications(notifications);
    return notifications;
  }

  private static generateInitialNotifications(): Notification[] {
    const now = new Date();
    
    return [
      {
        id: 'notif_1',
        type: 'success',
        title: 'Welcome to WealthNexus AI!',
        message: 'Your account has been created successfully. Start learning and trading!',
        timestamp: new Date(now.getTime() - 1000 * 60 * 5), // 5 mins ago
        read: false,
        action: {
          label: 'Start Learning',
          link: '/learning',
        },
      },
      {
        id: 'notif_2',
        type: 'info',
        title: 'New Course Available',
        message: 'Advanced Portfolio Management course is now available. Earn 150 XP!',
        timestamp: new Date(now.getTime() - 1000 * 60 * 30), // 30 mins ago
        read: false,
        action: {
          label: 'View Course',
          link: '/learning',
        },
      },
      {
        id: 'notif_3',
        type: 'warning',
        title: 'Market Alert: High Volatility',
        message: 'Tech sector showing increased volatility. Review your portfolio allocation.',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60), // 1 hour ago
        read: false,
        action: {
          label: 'Analyze Portfolio',
          link: '/portfolio',
        },
      },
      {
        id: 'notif_4',
        type: 'success',
        title: 'Prediction Matched!',
        message: 'Your AAPL stock prediction was accurate! +25 XP earned.',
        timestamp: new Date(now.getTime() - 1000 * 60 * 120), // 2 hours ago
        read: true,
      },
      {
        id: 'notif_5',
        type: 'info',
        title: 'Breaking News',
        message: 'Federal Reserve announces interest rate decision. Check news impact.',
        timestamp: new Date(now.getTime() - 1000 * 60 * 180), // 3 hours ago
        read: true,
        action: {
          label: 'Read News',
          link: '/news',
        },
      },
    ];
  }

  static markAsRead(notificationId: string): void {
    const notifications = this.getNotifications();
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.saveNotifications(updated);
  }

  static markAllAsRead(): void {
    const notifications = this.getNotifications();
    const updated = notifications.map(n => ({ ...n, read: true }));
    this.saveNotifications(updated);
  }

  static deleteNotification(notificationId: string): void {
    const notifications = this.getNotifications();
    const updated = notifications.filter(n => n.id !== notificationId);
    this.saveNotifications(updated);
  }

  static addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const notifications = this.getNotifications();
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date(),
    };
    this.saveNotifications([newNotification, ...notifications]);
  }

  static getUnreadCount(): number {
    return this.getNotifications().filter(n => !n.read).length;
  }

  private static saveNotifications(notifications: Notification[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
  }

  // Generate contextual notifications based on user activity
  static generateContextualNotifications() {
    const user = require('./auth.service').AuthService.getCurrentUser();
    if (!user) return;

    // XP milestone notification
    if (user.xp % 500 === 0 && user.xp > 0) {
      this.addNotification({
        type: 'success',
        title: `Level ${user.level} Achieved!`,
        message: `Congratulations! You've reached ${user.xp} XP. Keep learning!`,
        read: false,
      });
    }

    // Streak milestone
    if (user.streak > 0 && user.streak % 7 === 0) {
      this.addNotification({
        type: 'success',
        title: `🔥 ${user.streak}-Day Streak!`,
        message: `Amazing! You've maintained a ${user.streak}-day login streak.`,
        read: false,
      });
    }
  }

  // Simulate real-time notifications
  static simulateMarketNotification() {
    const events = [
      {
        type: 'warning' as const,
        title: 'Market Update',
        message: 'S&P 500 dropped 2.3% - Review your portfolio',
        action: { label: 'View Portfolio', link: '/portfolio' },
      },
      {
        type: 'info' as const,
        title: 'Stock Alert',
        message: 'TSLA reached your target price of $250',
        action: { label: 'View Stock', link: '/playground' },
      },
      {
        type: 'success' as const,
        title: 'Achievement Unlocked',
        message: 'Completed 5 courses! Earned "Scholar" badge',
        action: { label: 'View Profile', link: '/profile' },
      },
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    this.addNotification({
      ...randomEvent,
      read: false,
    });
  }
}
