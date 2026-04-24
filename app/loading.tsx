export default function Loading() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-pulse">
      {/* Page Title Skeleton */}
      <div className="h-10 w-64 bg-slate-200 rounded mb-8"></div>
      
      {/* Tabs Skeleton */}
      <div className="flex gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-24 bg-slate-200 rounded-full"></div>
        ))}
      </div>

      {/* Featured Collections Heading Skeleton */}
      <div className="h-8 w-48 bg-slate-200 rounded mt-8 mb-4"></div>
      <div className="h-px w-full bg-slate-200 mb-8"></div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="border rounded-xl aspect-[4/5] bg-slate-100 shadow-sm"></div>
        ))}
      </div>
    </div>
  );
}