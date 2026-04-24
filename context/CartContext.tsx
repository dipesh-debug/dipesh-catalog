"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Selection = { color: string; quantity: number };
type CartItem = { id: string; title: string; basePrice: number; selections: Selection[] };

interface CartContextType {
  cart: CartItem[];
  addToQuote: (item: CartItem) => void;
  updateQuantity: (id: string, color: string, quantity: number) => void;
  removeFromQuote: (id: string, color: string) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToQuote = (newItem: CartItem) => {
    setCart(prev => {
      const existingItemIndex = prev.findIndex(item => item.id === newItem.id);
      if (existingItemIndex >= 0) {
        const updatedCart = [...prev];
        const existingItem = updatedCart[existingItemIndex];
        
        newItem.selections.forEach(newSel => {
          const selIndex = existingItem.selections.findIndex(s => s.color === newSel.color);
          if (selIndex >= 0) {
            existingItem.selections[selIndex].quantity += newSel.quantity;
          } else {
            existingItem.selections.push(newSel);
          }
        });
        return updatedCart;
      }
      return [...prev, newItem];
    });
  };

  const updateQuantity = (id: string, color: string, quantity: number) => {
    setCart(prev => prev.map(item => item.id === id 
      ? { ...item, selections: item.selections.map(s => s.color === color ? { ...s, quantity } : s) } 
      : item
    ));
  };

  const removeFromQuote = (id: string, color: string) => {
    setCart(prev => prev.map(item => item.id === id 
      ? { ...item, selections: item.selections.filter(s => s.color !== color) } 
      : item
    ).filter(item => item.selections.length > 0));
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.selections.reduce((s, sel) => s + sel.quantity, 0), 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + (item.basePrice * item.selections.reduce((s, sel) => s + sel.quantity, 0)), 0);

  return <CartContext.Provider value={{ cart, addToQuote, updateQuantity, removeFromQuote, getTotalItems, getTotalPrice }}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};