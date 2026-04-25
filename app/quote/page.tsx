"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function QuotePage() {
  const { cart, removeFromQuote, getTotalPrice } = useCart();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  // Load saved details on mount
  useEffect(() => {
    const storedName = localStorage.getItem("dipesh_customer_name");
    const storedCompany = localStorage.getItem("dipesh_customer_company");
    if (storedName) setName(storedName);
    if (storedCompany) setCompany(storedCompany);
  }, []);

  // Save details whenever they change
  useEffect(() => {
    localStorage.setItem("dipesh_customer_name", name);
    localStorage.setItem("dipesh_customer_company", company);
  }, [name, company]);

  const isValid = name.trim().length >= 3 && company.trim().length >= 3;

  const handleWhatsApp = async () => {
    const phoneNumber = "+9779746851286"; // Update with your actual WhatsApp number! e.g., 919876543210
    
    let totalQty = 0;
    let message = "*📦 NEW QUOTE REQUEST - Dipesh Catalog*\n";
    message += `*Customer:* ${name.trim()}\n`;
    message += `*Company:* ${company.trim()}\n\n`;
    message += "*Order Details:*\n\n";
    
    cart.forEach(item => {
      message += `*${item.title}* (₹${item.basePrice})\n`;
      item.selections.forEach(sel => {
        totalQty += sel.quantity;
        message += `- ${sel.color}: ${sel.quantity} pcs\n`;
      });
      message += `\n`;
    });
    
    message += `*ESTIMATED TOTAL: ₹${getTotalPrice()}*\n`;
    message += `*MOQ STATUS:* ${totalQty >= 50 ? '✅ Met' : '⚠️ Below Minimum Order Quantity'}\n`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");

    // Save the lead to Supabase
    await supabase.from('leads').insert([
      {
        customer_name: name.trim(),
        business_name: company.trim(),
        quote_total: getTotalPrice(),
        items_json: cart
      }
    ]);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Your Quote Cart is Empty</h1>
        <p className="text-slate-500 mb-8">Browse our catalog and add items to request a quote.</p>
        <Link href="/" className="bg-[#3b82f6] text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-colors">
          View Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Quote Summary</h1>
      
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden mb-8">
        {cart.map((item) => (
          <div key={item.id} className="p-6 border-b last:border-b-0">
            <div className="mb-4">
              <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
              <p className="text-slate-500">₹{item.basePrice} / piece</p>
            </div>
            
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {item.selections.map(sel => (
                <div key={sel.color} className="flex justify-between items-center">
                  <span className="font-medium text-slate-700">{sel.color}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-600 bg-white px-2 py-1 rounded border shadow-sm">{sel.quantity} pcs</span>
                    <span className="font-semibold text-slate-900 w-20 text-right">₹{item.basePrice * sel.quantity}</span>
                    <button onClick={() => removeFromQuote(item.id, sel.color)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="p-6 bg-slate-50 flex justify-between items-center border-t">
          <span className="font-bold text-xl text-slate-900">Estimated Total</span>
          <span className="font-bold text-2xl text-[#3b82f6]">₹{getTotalPrice()}</span>
        </div>
      </div>

      {/* Contact Details Form */}
      <div className="bg-white border rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Contact Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe"
              className="w-full p-3 border border-slate-200 rounded-xl focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-shadow bg-slate-50 focus:bg-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Business/Organization Name</label>
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Doe Athletics"
              className="w-full p-3 border border-slate-200 rounded-xl focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-shadow bg-slate-50 focus:bg-white" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <Link href="/" className="px-6 py-3 rounded-xl font-medium text-center text-slate-600 hover:bg-slate-100 transition-colors">
          Add More Items
        </Link>
        <button onClick={handleWhatsApp} disabled={!isValid} className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:-translate-y-1 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none">
          Send on WhatsApp
        </button>
      </div>
    </div>
  );
}