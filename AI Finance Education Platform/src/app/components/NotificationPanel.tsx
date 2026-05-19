import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Check,
  Trash2,
  X,
  Info,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { NotificationService, Notification } from '../services/notification.service';
import { Link } from 'react-router';

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    
    // Simulate real-time notifications every 2 minutes
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance
        NotificationService.simulateMarketNotification();
        loadNotifications();
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    const notifs = NotificationService.getNotifications();
    setNotifications(notifs);
    setUnreadCount(NotificationService.getUnreadCount());
  };

  const handleMarkAsRead = (id: string) => {
    NotificationService.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    NotificationService.markAllAsRead();
    loadNotifications();
  };

  const handleDelete = (id: string) => {
    NotificationService.deleteNotification(id);
    loadNotifications();
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-chart-3" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-chart-4" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <Button
        size="icon"
        variant="ghost"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </Button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] z-50 glass rounded-xl border border-border/50 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg">Notifications</h3>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleMarkAllAsRead}
                      className="text-xs"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-[500px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No notifications yet</p>
                    <p className="text-sm mt-1">
                      We'll notify you about important updates
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/30">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 hover:bg-accent/30 transition-colors ${
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {getIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={`text-sm ${!notification.read ? '' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                              )}
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-2">
                              {notification.message}
                            </p>

                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs text-muted-foreground">
                                {getTimeAgo(notification.timestamp)}
                              </span>

                              <div className="flex items-center gap-1">
                                {notification.action && (
                                  <Link
                                    to={notification.action.link}
                                    onClick={() => {
                                      handleMarkAsRead(notification.id);
                                      setIsOpen(false);
                                    }}
                                  >
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-xs h-7"
                                    >
                                      {notification.action.label}
                                      <ExternalLink className="w-3 h-3 ml-1" />
                                    </Button>
                                  </Link>
                                )}

                                {!notification.read && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    title="Mark as read"
                                  >
                                    <Check className="w-3 h-3" />
                                  </Button>
                                )}

                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDelete(notification.id)}
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-border/50 bg-accent/20">
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-muted-foreground hover:text-foreground"
                    >
                      View all notifications
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
