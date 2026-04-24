import Link from "next/link";

export default function ProductCard({ imageUrl, title, basePrice, id }: { imageUrl: string, title: string, basePrice: number, id: string }) {
  return (
    <Link href={`/product/${id}`}>
      <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 hover:border-white/20 transition-all duration-500 cursor-pointer group bg-white animate-fade-in-up">
        <div className="aspect-[3/4] bg-[#2d2d2d] relative overflow-hidden rounded-2xl m-2">
          <div className="absolute top-3 right-3 bg-blue-100 text-[#3b82f6] text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">B2B Wholesale</div>
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 font-medium">No Image</div>
          )}
        </div>
        <div className="p-4">
          <div className="h-24">
            <h3 className="font-bold text-lg text-slate-900 truncate">{title}</h3>
            <div className="mt-1 text-sm font-medium text-slate-500">₹{basePrice}</div>
          </div>
          <div className="mt-3 text-[#3b82f6] font-medium text-sm flex items-center gap-1 group-hover:text-blue-700 transition-colors">
            View Options <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}