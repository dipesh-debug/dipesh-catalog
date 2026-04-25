export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-[#111111] pt-32 animate-pulse">
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Tabs Skeleton */}
        <div className="flex gap-4 mb-16 justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-24 bg-white/10 rounded-full border border-white/5"></div>
          ))}
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-[3/4] bg-[#1a1a1a] rounded border border-white/5"></div>
          ))}
        </div>
      </div>
    </div>
  );
}