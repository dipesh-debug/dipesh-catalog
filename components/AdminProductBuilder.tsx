"use client";

import { useState } from "react";
import RoundNeckConfigurator from "./RoundNeckConfigurator";
import { supabase } from "@/lib/supabase";

export default function AdminProductBuilder() {
  const [designMode, setDesignMode] = useState<'color' | 'png'>('color');
  const [colorPalette, setColorPalette] = useState<{name: string, hex: string}[]>([]);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [colorLabel, setColorLabel] = useState('');
  const [frontImage, setFrontImage] = useState('');
  const [backImage, setBackImage] = useState('');

  const handleSave = async () => {
    const fields = {
      product_name: "New 3D Configured Product", // You can hook this up to a text input later!
      category: "Mens",
      base_price: 999,
      min_order_quantity: 50,
      design_mode: designMode,
      available_colors: designMode === 'color' ? colorPalette : [],
      image_url: designMode === 'png' ? frontImage : null
    };

    const { error } = await supabase.from('products').insert([fields]);

    if (error) {
      alert('Error saving product: ' + error.message);
    } else {
      alert('Product added successfully!');
      setColorPalette([]);
      setFrontImage('');
      setBackImage('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-[#111] text-white rounded-xl shadow-2xl border border-white/10">
      
      {/* Left Column: The Controls */}
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold uppercase tracking-wider text-white">Configure Product</h2>

        {/* The Picklist */}
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Design Mode</label>
          <select
            value={designMode}
            onChange={(e) => setDesignMode(e.target.value as 'color' | 'png')}
            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-white focus:ring-1 focus:ring-white outline-none transition-shadow appearance-none"
          >
            <option value="color">Solid Color Mode</option>
            <option value="png">Custom PNG Mode</option>
          </select>
        </div>

        {/* Conditional Inputs */}
        {designMode === 'color' ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Add Garment Color</label>
              <div className="flex items-center gap-4 p-2 bg-gray-800 rounded-lg border border-gray-700">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0 shrink-0"
                />
                <input
                  type="text"
                  value={colorLabel}
                  onChange={(e) => setColorLabel(e.target.value)}
                placeholder="Color Name (e.g. Royal Blue)"
                  className="flex-1 bg-transparent text-white outline-none placeholder-gray-500 font-medium"
                />
                <button 
                  onClick={() => {
                    if (colorLabel.trim() && !colorPalette.find(c => c.hex === currentColor)) {
                      setColorPalette([...colorPalette, { name: colorLabel.trim(), hex: currentColor }]);
                      setColorLabel('');
                    }
                  }}
                  disabled={!colorLabel.trim()}
                  className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-semibold text-sm transition-colors shrink-0"
                >
                + Add to Palette
                </button>
              </div>
              {colorPalette.length > 0 && (
                <div className="mt-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-widest">Color Palette</label>
                  <div className="flex flex-wrap gap-2">
                    {colorPalette.map(color => (
                  <div key={color.hex} className="flex items-center gap-2 bg-gray-900 rounded-full pr-2 border border-gray-700 shadow-sm overflow-hidden">
                        <div className="w-8 h-8 shrink-0" style={{ backgroundColor: color.hex }} />
                        <span className="text-xs font-medium text-gray-300">{color.name}</span>
                    <button
                      onClick={() => setColorPalette(colorPalette.filter(c => c.hex !== color.hex))}
                      className="text-gray-500 hover:text-red-400 ml-1 focus:outline-none"
                      title="Remove color"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Front Image URL</label>
              <input type="text" value={frontImage} onChange={(e) => setFrontImage(e.target.value)} placeholder="https://.../design-front.png"
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-white focus:ring-1 focus:ring-white outline-none transition-shadow" />
              <p className="text-xs text-gray-500 mt-2 tracking-wide">*Note: Direct file upload logic will be attached later.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Back Image URL</label>
              <input type="text" value={backImage} onChange={(e) => setBackImage(e.target.value)} placeholder="https://.../design-back.png"
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-white focus:ring-1 focus:ring-white outline-none transition-shadow" />
            </div>
          </div>
        )}

        <button onClick={handleSave} className="mt-8 w-full h-14 bg-white text-black font-bold rounded-full transition-all active:scale-[0.98] text-sm tracking-widest uppercase hover:bg-gray-200 shadow-lg shadow-white/10 hover:shadow-white/20">
          Add Product
        </button>
      </div>

      {/* Right Column: The Live Preview */}
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold uppercase tracking-wider text-white">Live 3D Preview</h2>
        <div className="w-full h-full min-h-[500px] bg-black rounded-xl overflow-hidden border border-gray-800 relative">
          <RoundNeckConfigurator 
            frontColor={designMode === 'color' ? currentColor : '#ffffff'} 
            backColor={designMode === 'color' ? currentColor : '#ffffff'} 
            frontImage={designMode === 'png' ? frontImage : null} 
            backImage={designMode === 'png' ? backImage : null} />
        </div>
      </div>
    </div>
  );
}