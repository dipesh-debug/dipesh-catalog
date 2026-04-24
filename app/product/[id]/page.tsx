import { supabase } from "@/lib/supabase";
import AddToCart from "@/components/AddToCart";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) return <div className="w-full max-w-6xl mx-auto px-4 py-16 text-center text-lg font-medium text-slate-500">Product not found</div>;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 md:py-10">
      {/* Responsive Grid: 1 col on mobile, 2 cols on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        
        {/* Left Column: Product Image */}
        <div className="w-full">
          <div className="w-full aspect-[4/5] bg-slate-200 rounded-2xl flex items-center justify-center shadow-inner border border-slate-300 relative overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.product_name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <span className="text-slate-400 font-medium text-lg">Image Placeholder</span>
            )}
          </div>
        </div>

        {/* Right Column: Product Details & Actions */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a]">{product.product_name}</h1>
            <p className="text-base text-slate-500 mt-1">{product.category}</p>
            <div className="text-2xl font-bold text-[#0f172a] mt-4">₹{product.base_price}</div>
          </div>

          <div>
            <h3 className="font-semibold text-[#0f172a] mb-2">Description</h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {product.description || "Premium B2B blank apparel designed for durability and comfort. Perfect for custom bulk printing or embroidery."}
            </p>
          </div>

          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
