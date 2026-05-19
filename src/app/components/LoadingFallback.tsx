export function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-16 h-16 border-4 border-[#00d4ff]/20 border-t-[#00d4ff] rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-gray-400">Loading WealthNexus AI...</p>
      </div>
    </div>
  );
}
