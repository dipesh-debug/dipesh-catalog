"use client";

import { useState } from "react";
import Link from "next/link";
import AddToCart from "@/components/AddToCart";
import dynamic from "next/dynamic";

// Safe dynamic import for 3D component to prevent SSR WebGL errors
const RoundNeckConfigurator = dynamic(
  () => import("@/components/RoundNeckConfigurator"),
  { ssr: false }
);

export default function ProductClient({ product }: { product: any }) {
  // Normalize colors: Support legacy simple arrays and the new object arrays
  const rawColors = product.available_colors?.length 
    ? product.available_colors 
    : [
        { name: 'Charcoal', hex: '#111111' }, 
        { name: 'Crimson', hex: '#b91c1c' }, 
        { name: 'Royal Blue', hex: '#1d4ed8' }, 
        { name: 'Silver', hex: '#f3f4f6' }
      ];
      
  const availableColors = rawColors.map((c: any) => typeof c === 'string' ? { name: c, hex: c } : c);

  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedColor = availableColors[currentIndex];

  const handlePrev = () => setCurrentIndex(prev => prev === 0 ? availableColors.length - 1 : prev - 1);
  const handleNext = () => setCurrentIndex(prev => prev === availableColors.length - 1 ? 0 : prev + 1);

  // Re-map colors to string array so the ColorQuantitySelector component receives its expected format
  const cartProduct = { ...product, available_colors: availableColors.map((c: any) => c.name) };

  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0a] relative pt-20 md:pt-0">
      <Link href="/" className="absolute top-24 left-6 md:left-12 lg:left-24 text-sm font-bold tracking-widest uppercase text-gray-500 hover:text-white transition-colors z-50">← Back to Catalog</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
        
        {/* Left Column: Text & UI */}
        <div className="flex flex-col justify-center px-6 md:px-12 lg:px-24 relative z-20 h-full overflow-y-auto md:overflow-visible pb-10 md:pb-0 animate-fade-in-up">
          <div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white uppercase tracking-tighter leading-tight drop-shadow-lg">{product.product_name}</h1>
            <p className="text-gray-400 mt-2 tracking-widest uppercase text-sm">{product.category}</p>
            <div className="text-3xl font-bold text-white mt-6">₹{product.base_price}</div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-white mb-3 uppercase tracking-wider text-sm">Description</h3>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base max-w-lg">
              {product.description || "Premium B2B blank apparel designed for durability and comfort. Perfect for custom bulk printing or embroidery."}
            </p>
            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">🧶 100% Polyester</span>
              <span className="flex items-center gap-1.5">⚖️ 180 GSM</span>
              <span className="flex items-center gap-1.5">💧 Moisture Wicking</span>
            </div>
          </div>

          {/* Select Color Palette */}
          <div className="mt-8">
            <div className="flex gap-3 mt-4">
              {availableColors.map((color: any, idx: number) => (
                <button
                  key={color.hex}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    selectedColor.hex === color.hex ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 w-full max-w-md">
            <AddToCart product={cartProduct} />
          </div>
        </div>

        {/* Right Column: Interactive 3D Configurator */}
        <div className="relative h-full min-h-[600px] md:min-h-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          
          {/* Glassy Navigation Arrows */}
          <button onClick={handlePrev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-full p-5 transition-all shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={handleNext} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-full p-5 transition-all shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <RoundNeckConfigurator frontColor={selectedColor.hex} backColor={selectedColor.hex} />

          {/* Large Bold UI Label beneath the 3D model */}
          <div className="absolute bottom-12 md:bottom-24 left-0 w-full flex justify-center pointer-events-none z-20">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white uppercase tracking-tighter drop-shadow-2xl">{selectedColor.name}</h2>
          </div>
        </div>

      </div>
    </div>
  );
}