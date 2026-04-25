"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { getTotalItems } = useCart();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Listen to scroll events to trigger the background blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, category: string) => {
    e.preventDefault();
    router.push(`/?category=${category}`, { scroll: false });
    
    const element = document.getElementById("catalog-grid");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md py-4" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white tracking-widest uppercase">
          Dipesh Catalog
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center justify-center gap-10 absolute left-1/2 -translate-x-1/2">
          {["Mens", "Ladies", "School", "Organization"].map((cat) => (
            <a
              key={cat}
              href={`/?category=${cat}`}
              onClick={(e) => handleCategoryClick(e, cat)}
              className="text-white font-semibold tracking-widest uppercase text-sm hover:text-gray-300 transition-colors cursor-pointer"
            >
              {cat}
            </a>
          ))}
        </div>

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
