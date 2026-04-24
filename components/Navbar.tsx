"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { getTotalItems } = useCart();
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#0f172a]">
          Dipesh Catalog
        </Link>
        <Link href="/quote" className="relative flex items-center gap-2 bg-[#3b82f6] text-white px-5 py-2 rounded-full font-medium hover:bg-blue-600 transition-colors">
          <span>Quote Cart</span>
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold shadow-sm">{getTotalItems()}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}
