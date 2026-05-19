import { Outlet, Navigate } from 'react-router';
import { AuthService } from '../../services/auth.service';
import { Background3D } from '../Background3D';
import { Sparkles } from 'lucide-react';

export function AuthLayout() {
  // If user is already logged in, redirect to dashboard
  if (AuthService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Background3D />
      
      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-2/10 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm bg-background/50">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <Sparkles className="w-8 h-8 text-primary relative" />
            </div>
            <div>
              <h1 className="text-xl tracking-tight">
                <span className="text-gradient">WealthNexus</span>
                <span className="text-foreground"> AI</span>
              </h1>
              <p className="text-xs text-muted-foreground">Intelligent Finance Platform</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto py-6 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 WealthNexus AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
