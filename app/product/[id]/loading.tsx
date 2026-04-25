export default function ProductLoading() {
  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0a] relative pt-20 md:pt-0 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
        
        {/* Left Column Text Skeleton */}
        <div className="flex flex-col justify-center px-6 md:px-12 lg:px-24 h-full">
          <div className="h-16 md:h-24 w-3/4 bg-white/10 rounded mb-4"></div>
          <div className="h-4 w-1/4 bg-white/5 rounded mb-8"></div>
          <div className="h-10 w-1/3 bg-white/10 rounded mb-12"></div>
          
          <div className="h-5 w-1/4 bg-white/10 rounded mb-4 mt-8"></div>
          <div className="h-24 w-full max-w-lg bg-white/5 rounded mb-8"></div>
          
          <div className="h-14 w-full max-w-md bg-white/10 rounded-full mt-8"></div>
        </div>
        
        {/* Right Column Image Skeleton */}
        <div className="flex items-center justify-center h-full">
          <div className="w-[60%] aspect-[3/4] bg-white/5 rounded blur-2xl"></div>
        </div>
      </div>
    </div>
  );
}