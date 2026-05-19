import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useEffect, Suspense } from "react";
import { LoadingFallback } from "./components/LoadingFallback";

export default function App() {
  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <div className="dark">
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}