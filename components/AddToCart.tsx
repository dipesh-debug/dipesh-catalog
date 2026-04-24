"use client";

import { useState } from "react";
import ColorQuantitySelector from "@/components/ColorQuantitySelector";
import { useCart } from "@/context/CartContext";

export default function AddToCart({ product }: { product: any }) {
  const { addToQuote } = useCart();
  const [selections, setSelections] = useState<{ color: string; quantity: number }[]>([]);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToQuote = () => {
    if (selections.length === 0) return;

    addToQuote({
      id: product.id,
      title: product.product_name,
      basePrice: product.base_price,
      selections,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <>
      {/* Color & Quantity Selector */}
      <div className="mt-2">
        <ColorQuantitySelector 
          availableColors={product.available_colors || []} 
          onSelectionChange={setSelections}
        />
      </div>

      {/* Add to Quote Button */}
      <button 
        onClick={handleAddToQuote}
        disabled={selections.length === 0}
        className={`w-full h-14 mt-4 font-bold rounded-xl transition-all active:scale-[0.98] text-xl text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          isAdded ? 'bg-green-500 hover:bg-green-600 shadow-lg' : 'bg-[#3b82f6] hover:bg-blue-600 shadow-lg shadow-blue-500/30'
        } ${selections.length > 0 && !isAdded ? 'animate-pulse' : ''}`}
      >
        {isAdded ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Added to Quote!
          </>
        ) : (
          'Add to Quote'
        )}
      </button>
    </>
  );
}