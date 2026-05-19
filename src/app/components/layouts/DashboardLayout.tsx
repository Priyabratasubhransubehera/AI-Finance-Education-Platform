import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  GraduationCap,
  TrendingUp,
  Newspaper,
  Briefcase,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Bell,
  Trophy,
  Flame,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { AuthService } from '../../services/auth.service';
import { Background3D } from '../Background3D';
import { Progress } from '../ui/progress';
import { NotificationPanel } from '../NotificationPanel';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Learning', href: '/learning', icon: GraduationCap },
  { name: 'Playground', href: '/playground', icon: TrendingUp },
  { name: 'News Intelligence', href: '/news', icon: Newspaper },
  { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
  { name: 'AI Advisor', href: '/advisor', icon: MessageSquare },
  { name: 'Profile', href: '/profile', icon: User },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(AuthService.getCurrentUser());

  // Check authentication
  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }

  useEffect(() => {
    // Update user state when it changes
    const interval = setInterval(() => {
      setUser(AuthService.getCurrentUser());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/auth/login');
  };

  const progressToNextLevel = user ? ((user.xp % 500) / 500) * 100 : 0;

  return (
    <div className="min-h-screen bg-background relative">
      <Background3D />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col z-20">
        <div className="flex flex-col flex-grow border-r border-border/50 glass overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <Sparkles className="w-8 h-8 text-primary relative" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg tracking-tight">
                <span className="text-gradient">WealthNexus</span>
                <span className="text-foreground"> AI</span>
              </h1>
              <p className="text-xs text-muted-foreground">Intelligent Finance</p>
            </div>
            <NotificationPanel />
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-12 h-12 border-2 border-primary/50">
                <AvatarFallback className="bg-primary/20 text-primary">
                  {user?.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{user?.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Level {user?.level}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Flame className="w-3 h-3 text-destructive" />
                    {user?.streak}d
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">XP</span>
                <span className="text-primary">{user?.xp}</span>
              </div>
              <Progress value={progressToNextLevel} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {500 - (user?.xp || 0) % 500} XP to Level {(user?.level || 0) + 1}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                      ${isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary/5 rounded-lg -z-10"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-3 border-t border-border/50">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-30 border-b border-border/50 glass backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-gradient">WealthNexus AI</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationPanel />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 z-50 glass border-r border-border/50"
            >
              <div className="flex flex-col h-full">
                {/* Same content as desktop sidebar */}
                <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
                  <Sparkles className="w-8 h-8 text-primary" />
                  <div>
                    <h1 className="text-lg">
                      <span className="text-gradient">WealthNexus</span> AI
                    </h1>
                  </div>
                </div>

                <div className="px-6 py-4 border-b border-border/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-12 h-12 border-2 border-primary/50">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user?.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{user?.name}</p>
                      <Badge variant="outline" className="text-xs">
                        Level {user?.level}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={progressToNextLevel} className="h-2" />
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                          ${isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-3 border-t border-border/50">
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="relative z-10 min-h-screen">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border/50 glass backdrop-blur-lg">
        <div className="flex justify-around items-center px-2 py-2">
          {navigation.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors
                  ${isActive ? 'text-primary' : 'text-muted-foreground'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.name.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}