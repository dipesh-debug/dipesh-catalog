"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function QuotePage() {
  const { cart, removeFromQuote, getTotalPrice } = useCart();

  const handleWhatsApp = () => {
    const phoneNumber = "+9779746851286"; // Update with your actual WhatsApp number! e.g., 919876543210
    let message = "Hello, I would like to request a quote for the following items:%0A%0A";
    
    cart.forEach(item => {
      message += `*${item.title}* (₹${item.basePrice})%0A`;
      item.selections.forEach(sel => {
        message += `- ${sel.color}: ${sel.quantity} pcs%0A`;
      });
      message += `%0A`;
    });
    
    message += `*Estimated Total: ₹${getTotalPrice()}*%0A`;
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
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

      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <Link href="/" className="px-6 py-3 rounded-xl font-medium text-center text-slate-600 hover:bg-slate-100 transition-colors">
          Add More Items
        </Link>
        <button onClick={handleWhatsApp} className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-green-600 shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
          Send on WhatsApp
        </button>
      </div>
    </div>
  );
}