import { supabase } from "@/lib/supabase";
import ProductClient from "./ProductClient";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) return <div className="w-full max-w-6xl mx-auto px-4 py-16 text-center text-lg font-medium text-slate-500">Product not found</div>;

  return <ProductClient product={product} />;
}
