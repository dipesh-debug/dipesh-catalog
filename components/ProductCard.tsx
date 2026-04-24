import Link from "next/link";

export default function ProductCard({ imageUrl, title, basePrice, id }: { imageUrl: string, title: string, basePrice: number, id: string }) {
  return (
    <Link href={`/product/${id}`}>
      <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white">
        <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-slate-900 truncate">{title}</h3>
          <div className="mt-2 font-bold text-[#0f172a]">₹{basePrice}</div>
          <div className="mt-3 text-[#3b82f6] font-medium text-sm hover:underline">View Options</div>
        </div>
      </div>
    </Link>
  );
}