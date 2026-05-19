import { Link } from 'react-router';
import { CheckCircle2, ArrowRight, Sparkles, TrendingUp, GraduationCap, Newspaper, Briefcase, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

export function TestPage() {
  const features = [
    { icon: GraduationCap, label: 'Finance Learning', color: 'text-chart-2' },
    { icon: TrendingUp, label: 'Stock Predictions', color: 'text-primary' },
    { icon: Briefcase, label: 'Portfolio Analysis', color: 'text-chart-3' },
    { icon: Newspaper, label: 'News Intelligence', color: 'text-chart-4' },
    { icon: MessageSquare, label: 'AI Advisor', color: 'text-chart-2' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-chart-2/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-chart-2/30 border-2 border-primary/50 mb-4"
        >
          <CheckCircle2 className="w-14 h-14 text-primary" />
        </motion.div>
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-5xl">
              <span className="text-gradient bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent">
                WealthNexus AI
              </span>
            </h1>
          </div>
          <h2 className="text-3xl mb-3">All Systems Operational!</h2>
          <p className="text-gray-400 text-lg">
            Your AI-powered fintech platform is ready to launch
          </p>
        </motion.div>
        
        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-8 bg-[#0f1629] rounded-2xl border border-white/10 backdrop-blur-xl space-y-4"
        >
          <h3 className="text-xl mb-6 text-primary">System Status</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'React & Routing', status: 'Active' },
              { label: 'UI Components', status: 'Loaded' },
              { label: 'Animations', status: 'Ready' },
              { label: '3D Background', status: 'Enabled' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-[#0a0e27] rounded-lg"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <div className="text-left flex-1">
                  <p className="text-sm text-gray-400">{item.label}</p>
                  <p className="text-xs text-primary">{item.status}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 bg-gradient-to-br from-primary/5 to-chart-2/5 rounded-2xl border border-primary/20"
        >
          <p className="text-sm text-gray-400 mb-4">Available Features</p>
          <div className="flex flex-wrap justify-center gap-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0f1629] rounded-lg border border-white/10"
                >
                  <Icon className={`w-4 h-4 ${feature.color}`} />
                  <span className="text-sm text-gray-300">{feature.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="pt-4 space-y-4"
        >
          <Link to="/auth/login">
            <Button className="w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90 text-white border-0 shadow-lg shadow-primary/50">
              <span className="flex items-center justify-center gap-3">
                Launch Platform
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </Link>
          
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link to="/diagnostic" className="text-gray-400 hover:text-primary transition-colors">
              System Diagnostic
            </Link>
            <span className="text-gray-600">•</span>
            <span className="text-gray-500">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </motion.div>

        {/* Demo Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-xs text-gray-500 border-t border-white/10 pt-4"
        >
          💡 Demo Mode: Use any email and password to explore the platform
        </motion.div>
      </div>
    </div>
  );
}