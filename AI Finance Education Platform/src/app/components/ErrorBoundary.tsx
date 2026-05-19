import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Check if it's a dynamic import error
    if (error.message?.includes('Failed to fetch dynamically imported module')) {
      console.error('DYNAMIC IMPORT ERROR DETECTED');
      console.error('This may be caused by:');
      console.error('1. Build configuration issues');
      console.error('2. Cached files from previous build');
      console.error('3. Module path resolution problems');
      console.error('Solution: Clear browser cache and hard refresh (Ctrl+Shift+R)');
    }
  }

  handleReload = () => {
    // Clear cache and reload
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDynamicImportError = this.state.error?.message?.includes('Failed to fetch dynamically imported module');
      
      return (
        <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#0f1629] border border-white/10 rounded-2xl p-8 space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl text-white mb-2">
                {isDynamicImportError ? 'Loading Error' : 'Something went wrong'}
              </h1>
              <p className="text-gray-400">
                {isDynamicImportError 
                  ? 'The application failed to load some resources. This usually happens after an update.'
                  : this.state.error?.message || 'An unexpected error occurred'
                }
              </p>
            </div>

            {isDynamicImportError && (
              <div className="bg-[#0a0e27] border border-yellow-500/20 rounded-lg p-4">
                <h3 className="text-yellow-400 mb-2 flex items-center gap-2">
                  <span>💡</span> Quick Fix
                </h3>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Click the "Clear Cache & Reload" button below</li>
                  <li>Or manually: Press Ctrl+Shift+R (Cmd+Shift+R on Mac)</li>
                  <li>If that doesn't work, clear your browser cache completely</li>
                </ol>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 px-6 py-3 bg-[#00d4ff] text-[#0a0e27] rounded-lg hover:bg-[#00b8e6] transition-colors font-medium"
              >
                {isDynamicImportError ? 'Clear Cache & Reload' : 'Reload Page'}
              </button>
              <a
                href="/test"
                className="flex-1 px-6 py-3 bg-[#1a2035] text-white rounded-lg hover:bg-[#1e2844] transition-colors text-center font-medium"
              >
                Go to Test Page
              </a>
            </div>

            <details className="mt-6">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Technical Details
              </summary>
              <div className="mt-3 space-y-2">
                <div className="p-4 bg-black/50 rounded text-xs text-red-400 overflow-auto">
                  <strong>Error Message:</strong>
                  <pre className="mt-1">{this.state.error?.message}</pre>
                </div>
                <div className="p-4 bg-black/50 rounded text-xs text-red-400 overflow-auto max-h-48">
                  <strong>Stack Trace:</strong>
                  <pre className="mt-1">{this.state.error?.stack}</pre>
                </div>
                <div className="p-3 bg-[#0a0e27] rounded text-xs text-gray-400">
                  <strong>Troubleshooting Steps:</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Clear browser cache (Ctrl+Shift+Delete)</li>
                    <li>Hard refresh the page (Ctrl+Shift+R)</li>
                    <li>Try in incognito/private mode</li>
                    <li>Check browser console for more details (F12)</li>
                    <li>Try a different browser</li>
                  </ul>
                </div>
              </div>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}