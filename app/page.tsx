import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function HomePage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const categoryParam = searchParams.category;
  const activeCategory = typeof categoryParam === 'string' ? categoryParam : "All";

  const { data: products, error } = await supabase.from('products').select('*');

  if (error || !products || products.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-500">NO DATA RETURNED: Please check Supabase Row Level Security (RLS) settings.</h1>
      </div>
    );
  }

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category as string)))];
  const filteredProducts = activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <main>
      {/* Hero Section */}
      <div className="w-full bg-[#0f172a] py-16 md:py-24 px-4 shadow-2xl relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            Premium Athletic Wear.<br />Manufactured for Performance.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Empowering brands with our 3 crore piece manufacturing scale. High-quality blank apparel designed for durability, style, and mass distribution.
          </p>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-[#0f172a]">Product Catalog</h1>
      
      {/* Category Tabs */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={cat === "All" ? "/" : `/?category=${encodeURIComponent(cat)}`}
            className={`px-5 py-2 rounded-full whitespace-nowrap transition-colors font-medium border ${
              activeCategory === cat ? "bg-[#3b82f6] border-[#3b82f6] text-white shadow-md" : "border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-200"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0f172a]">Featured Collections</h2>
      <hr className="mb-8 border-slate-200" />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            id={product.id}
            title={product.product_name}
            basePrice={product.base_price}
            imageUrl={product.image_url}
          />
        ))}
        </div>
      </div>
    </main>
  );
}
