'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // We'll use a composite ID (itemId + variantName) to keep sizes separate
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  variantName?: string;
  stallId: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: any, quantity: number, variant?: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('bytebite_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('bytebite_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (item: any, quantity: number, variant?: any) => {
    setItems(currentItems => {
      // Create a unique ID for this cart item based on its variant
      const cartItemId = variant ? `${item.id}-${variant.name}` : item.id;
      
      const existingItemIndex = currentItems.findIndex(i => i.id === cartItemId);
      
      if (existingItemIndex > -1) {
        // Update quantity if already in cart
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Add new item to cart
        return [...currentItems, {
          id: cartItemId,
          menuItemId: item.id,
          name: item.name,
          price: variant ? variant.price : item.price,
          quantity: quantity,
          variantName: variant ? variant.name : undefined,
          stallId: item.stall_id
        }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(currentItems => 
      currentItems.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
