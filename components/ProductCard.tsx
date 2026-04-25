import Link from "next/link";

export default function ProductCard({ imageUrl, title, basePrice, id }: { imageUrl: string, title: string, basePrice: number, id: string }) {
  return (
    <Link href={`/product/${id}`}>
      <div className="group cursor-pointer animate-fade-in-up block">
        <div className="relative">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-auto drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-4" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 font-medium tracking-widest uppercase text-sm">No Image</div>
          )}
        </div>
        
        <div className="text-center mt-6 pb-2">
          <h3 className="text-white font-bold text-xl uppercase tracking-wider truncate">{title}</h3>
          <div className="text-gray-400 mt-2">₹{basePrice}</div>
          {/* Sleek Animated Line Interaction */}
          <div className="h-[1px] w-0 bg-white mx-auto group-hover:w-full transition-all duration-500 ease-out mt-4"></div>
        </div>
      </div>
    </Link>
  );
}