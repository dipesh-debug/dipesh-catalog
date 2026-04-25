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
    <main className="bg-[#111111] min-h-screen">
      {/* Cinematic Hero Section */}
      <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?q=80&w=2070&auto=format&fit=crop"
            alt="Premium Athletic Wear"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 flex flex-col items-center mt-20">
          <h1 className="text-7xl md:text-9xl font-extrabold text-white tracking-tighter mb-8 drop-shadow-2xl">
            ELEVATE YOUR GAME
          </h1>
          <Link href="#catalog" className="bg-white text-black px-10 py-4 rounded-full font-bold tracking-widest uppercase text-sm hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl">
            EXPLORE CATALOG
          </Link>
        </div>
      </div>

      <div id="catalog" className="w-full max-w-7xl mx-auto px-4 py-24">
        {/* Category Tabs */}
        <div className="flex gap-4 mb-16 justify-center overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat}
              scroll={false}
              href={cat === "All" ? "/" : `/?category=${encodeURIComponent(cat)}`}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors tracking-widest uppercase text-xs font-semibold ${
                activeCategory === cat ? "bg-white text-black shadow-md" : "border border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        <div id="catalog-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 scroll-mt-24">
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
