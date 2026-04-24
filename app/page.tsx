import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function HomePage() {
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
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#0f172a]">Product Catalog</h1>
      
      {/* Category Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={cat === "All" ? "/" : `/?category=${encodeURIComponent(cat)}`}
            className={`px-5 py-2 rounded-full whitespace-nowrap transition-colors font-medium ${
              activeCategory === cat ? "bg-[#3b82f6] text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
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
  );
}
