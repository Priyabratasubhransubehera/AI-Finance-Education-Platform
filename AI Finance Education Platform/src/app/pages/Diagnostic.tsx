import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';

export function Diagnostic() {
  const [checks, setChecks] = useState({
    react: false,
    router: false,
    motion: false,
    three: false,
    recharts: false,
    localStorage: false,
  });

  useEffect(() => {
    // Run diagnostic checks
    const runChecks = async () => {
      setChecks({
        react: typeof React !== 'undefined',
        router: true, // If we're here, router is working
        motion: await checkModule('motion/react'),
        three: await checkModule('three'),
        recharts: await checkModule('recharts'),
        localStorage: checkLocalStorage(),
      });
    };

    runChecks();
  }, []);

  const checkModule = async (moduleName: string): Promise<boolean> => {
    try {
      await import(moduleName);
      return true;
    } catch {
      return false;
    }
  };

  const checkLocalStorage = (): boolean => {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  };

  const allPassed = Object.values(checks).every(check => check);

  return (
    <div className="min-h-screen bg-[#0a0e27] p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl text-white">System Diagnostic</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Link to="/test">
              <Button variant="outline" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                Test Page
              </Button>
            </Link>
          </div>
        </div>

        {/* Overall Status */}
        <div className={`bg-[#0f1629] border rounded-xl p-6 ${
          allPassed ? 'border-green-500/50' : 'border-yellow-500/50'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            {allPassed ? (
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            ) : (
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            )}
            <h2 className="text-2xl text-white">
              {allPassed ? 'All Systems Operational' : 'Some Issues Detected'}
            </h2>
          </div>
          <p className="text-gray-400">
            {allPassed
              ? 'WealthNexus AI is ready to use. Navigate to /auth/login to get started.'
              : 'Some modules failed to load. See details below.'}
          </p>
        </div>

        {/* Module Checks */}
        <div className="bg-[#0f1629] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl text-white mb-4">Core Modules</h2>
          <div className="space-y-3">
            {Object.entries(checks).map(([name, status]) => (
              <div key={name} className="flex items-center justify-between p-3 bg-[#0a0e27] rounded-lg">
                <span className="text-gray-300 capitalize">{name.replace(/([A-Z])/g, ' $1')}</span>
                <div className="flex items-center gap-2">
                  {status ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 text-sm">Loaded</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 text-sm">Failed</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browser Info */}
        <div className="bg-[#0f1629] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl text-white mb-4">Browser Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">User Agent:</span>
              <span className="text-gray-300 text-right max-w-md truncate">
                {navigator.userAgent}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Viewport:</span>
              <span className="text-gray-300">
                {window.innerWidth} x {window.innerHeight}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Online Status:</span>
              <span className="text-gray-300">
                {navigator.onLine ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-[#0f1629] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl text-white mb-4">Troubleshooting Steps</h2>
          <ol className="space-y-3 text-sm text-gray-400">
            <li className="flex gap-3">
              <span className="text-primary">1.</span>
              <span>Clear your browser cache completely (Ctrl+Shift+Delete / Cmd+Shift+Delete)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">2.</span>
              <span>Perform a hard refresh (Ctrl+Shift+R / Cmd+Shift+R)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">3.</span>
              <span>Try opening in an incognito/private browsing window</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">4.</span>
              <span>Check the browser console (F12) for detailed error messages</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">5.</span>
              <span>Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)</span>
            </li>
          </ol>
        </div>

        {/* Navigation */}
        {allPassed && (
          <div className="text-center">
            <Link to="/auth/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Continue to Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}