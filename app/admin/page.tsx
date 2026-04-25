"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import RoundNeckConfigurator from "@/components/RoundNeckConfigurator";

export default function AdminDashboard() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Mens");
  const [price, setPrice] = useState("");
  const [minOrder, setMinOrder] = useState<number>(50);
  const [imageUrl, setImageUrl] = useState("");
  const [designMode, setDesignMode] = useState<'color' | 'png'>('color');
  const [colorPalette, setColorPalette] = useState<{name: string, hex: string}[]>([]);
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [colorLabel, setColorLabel] = useState('');
  const [frontImage, setFrontImage] = useState('');
  const [backImage, setBackImage] = useState('');
  
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [secretKey, setSecretKey] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

  // Check localStorage for auth on mount
  useEffect(() => {
    if (localStorage.getItem("dipesh_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  // Fetch products when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchLeads();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
  };

  const fetchLeads = async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (data) setLeads(data);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const diffInHours = Math.abs(new Date().getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      if (hours === 0) return `${Math.floor(diffInHours * 60)} mins ago`;
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    const { error } = await supabase.from("products").insert([
      {
        product_name: name,
        category: category,
        base_price: Number(price),
        min_order_quantity: minOrder,
        image_url: imageUrl || (designMode === 'png' ? frontImage : ''),
        available_colors: designMode === 'color' ? colorPalette : [],
      },
    ]);

    if (error) {
      setStatus({ type: "error", message: error.message });
    } else {
      setStatus({ type: "success", message: "Product added successfully!" });
      // Clear form
      setName("");
      setCategory("Mens");
      setPrice("");
      setMinOrder(50);
      setImageUrl("");
      setDesignMode("color");
      setColorPalette([]);
      setCurrentColor("#ffffff");
      setColorLabel("");
      setFrontImage("");
      setBackImage("");
      // Refresh table
      fetchProducts();
    }
    
    setIsLoading(false);
  };

  if (isCheckingAuth) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-pulse text-slate-500 font-medium">Verifying Access...</div></div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Command Center Login</h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (secretKey.trim() === "dipesh-admin") {
            setIsAuthenticated(true);
            localStorage.setItem("dipesh_admin_auth", "true");
          } else {
            alert("Invalid Secret Key! Make sure you typed 'dipesh-admin' exactly.");
          }
        }} className="bg-white rounded-xl shadow-xl p-8 space-y-6 w-full max-w-md border border-slate-100">
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Enter Secret Key"
            className="w-full p-3 border border-slate-200 rounded-xl focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-shadow bg-slate-50 focus:bg-white"
          />
          <button type="submit" className="w-full h-12 bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]">
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Command Center: Inventory</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Form Container */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-xl p-6 md:p-8 border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 border-b pb-4">Add New Product</h2>
            
            {status.message && (
              <div className={`p-4 mb-6 rounded-xl font-medium ${status.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
                  <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Premium Baggy Fit Tee"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-shadow bg-slate-50 focus:bg-white" />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-shadow bg-slate-50 focus:bg-white">
                    <option value="Mens">Mens</option>
                    <option value="Ladies">Ladies</option>
                    <option value="School">School</option>
                    <option value="Organization">Organization</option>
                  </select>
                </div>

                {/* Base Price */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Base Price (₹)</label>
                  <input required type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 299"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-shadow bg-slate-50 focus:bg-white" />
                </div>

                {/* Min Order Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Min Order Quantity</label>
                  <input required type="number" min="1" value={minOrder} onChange={(e) => setMinOrder(parseInt(e.target.value))}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-shadow bg-slate-50 focus:bg-white" />
                </div>

                {/* Catalog Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Catalog Image URL (Home Page)</label>
                  <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://.../thumbnail.png"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-shadow bg-slate-50 focus:bg-white" />
                </div>

                {/* 3D Configuration Settings */}
                <div className="md:col-span-2 border-t border-slate-200 pt-6 mt-2">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">3D Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Design Mode</label>
                      <select value={designMode} onChange={(e) => setDesignMode(e.target.value as 'color' | 'png')}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-shadow bg-slate-50 focus:bg-white">
                        <option value="color">Solid Color Mode</option>
                        <option value="png">Custom PNG Mode</option>
                      </select>
                    </div>

                    {designMode === 'color' ? (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Add Garment Color</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-2 border border-slate-200 rounded-xl bg-slate-50 focus-within:bg-white transition-colors w-full">
                          <input
                            type="color"
                            value={currentColor}
                            onChange={(e) => setCurrentColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0 shrink-0"
                          />
                          <input
                            type="text"
                            value={colorLabel}
                            onChange={(e) => setColorLabel(e.target.value)}
                            placeholder="Color Name (e.g. Royal Blue)"
                            className="flex-1 w-full bg-transparent text-slate-700 outline-none placeholder-slate-400 font-medium"
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              if (colorLabel.trim() && !colorPalette.find(c => c.hex === currentColor)) {
                                setColorPalette([...colorPalette, { name: colorLabel.trim(), hex: currentColor }]);
                                setColorLabel('');
                              }
                            }}
                            disabled={!colorLabel.trim()}
                            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shrink-0"
                          >
                            + Add to Palette
                          </button>
                        </div>
                        {colorPalette.length > 0 && (
                          <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <label className="block text-xs font-semibold text-slate-500 mb-3 uppercase tracking-widest">Color Palette</label>
                            <div className="flex flex-wrap gap-2">
                              {colorPalette.map(color => (
                                <div key={color.hex} className="flex items-center gap-2 bg-white rounded-full pr-2 border border-slate-200 shadow-sm overflow-hidden">
                                  <div className="w-8 h-8 shrink-0" style={{ backgroundColor: color.hex }} />
                                  <span className="text-xs font-medium text-slate-700">{color.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => setColorPalette(colorPalette.filter(c => c.hex !== color.hex))}
                                    className="text-slate-400 hover:text-red-500 ml-1 focus:outline-none"
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
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Front Image URL</label>
                          <input type="text" value={frontImage} onChange={(e) => setFrontImage(e.target.value)} placeholder="https://.../front.png"
                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-shadow bg-slate-50 focus:bg-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Back Image URL</label>
                          <input type="text" value={backImage} onChange={(e) => setBackImage(e.target.value)} placeholder="https://.../back.png"
                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-shadow bg-slate-50 focus:bg-white" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button disabled={isLoading} type="submit"
                className="w-full h-14 bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50 mt-4">
                {isLoading ? "Adding Product..." : "Add Product"}
              </button>
            </form>
          </div>

          {/* Right: Live Preview */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-slate-100 flex flex-col h-full">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 border-b pb-4">Live Preview</h2>
            <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative min-h-[500px] mb-4">
              <RoundNeckConfigurator 
                frontColor={designMode === 'color' ? currentColor : '#ffffff'} 
                backColor={designMode === 'color' ? currentColor : '#ffffff'} 
                frontImage={designMode === 'png' ? frontImage : null} 
                backImage={designMode === 'png' ? backImage : null} 
              />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-slate-900 truncate">{name || "Product Name"}</h3>
              <p className="text-slate-500 text-sm font-medium mt-1">{category} • ₹{price || "0"}</p>
            </div>
          </div>

        </div>

        {/* Bottom: Inventory Table */}
        <div className="mt-12 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-white">
            <h2 className="text-xl font-semibold text-slate-800">Current Inventory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Min Order</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {products.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">No products found. Add one above!</td></tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-200 overflow-hidden shrink-0">
                          {p.image_url && <img src={p.image_url} alt={p.product_name} className="w-full h-full object-cover" />}
                        </div>
                        <span className="font-medium text-slate-900 truncate max-w-[200px]">{p.product_name}</span>
                      </td>
                      <td className="p-4 text-slate-600">{p.category}</td>
                      <td className="p-4 text-slate-600">{p.min_order_quantity} pcs</td>
                      <td className="p-4 text-slate-900 font-medium">₹{p.base_price}</td>
                      <td className="p-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom: Leads Inbox Table */}
        <div className="mt-12 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-white">
            <h2 className="text-xl font-semibold text-slate-800">Incoming Inquiries</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Customer Name</th>
                  <th className="p-4 font-semibold">Business</th>
                  <th className="p-4 font-semibold text-right">Quote Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {leads.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-500">No leads yet. They will appear here!</td></tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-500 whitespace-nowrap">{formatTime(lead.created_at)}</td>
                      <td className="p-4 font-medium text-slate-900">{lead.customer_name}</td>
                      <td className="p-4 text-slate-600">{lead.business_name}</td>
                      <td className="p-4 text-slate-900 font-bold text-right">₹{lead.quote_total}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}