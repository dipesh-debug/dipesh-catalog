"use client";
import { useState } from "react";

export default function ColorQuantitySelector({ availableColors, onSelectionChange }: { availableColors: string[], onSelectionChange: (s: any) => void }) {
  const [selections, setSelections] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (color: string, qty: number) => {
    const newSelections = { ...selections, [color]: qty };
    if (qty <= 0 || isNaN(qty)) delete newSelections[color];
    setSelections(newSelections);
    
    const formattedSelections = Object.entries(newSelections).map(([c, q]) => ({ color: c, quantity: q }));
    onSelectionChange(formattedSelections);
  };

  return (
    <div className="space-y-4">
      {availableColors.map(color => (
        <div key={color} className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-black/40 backdrop-blur-md">
          <span className="font-medium text-white">{color}</span>
          <input 
            type="number" min="0" placeholder="Qty"
            className="w-24 p-2 border border-white/20 rounded-md text-center bg-transparent text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition-shadow placeholder-gray-600"
            value={selections[color] || ""}
            onChange={(e) => handleQuantityChange(color, parseInt(e.target.value))}
          />
        </div>
      ))}
    </div>
  );
}