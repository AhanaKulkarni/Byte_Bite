'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, ShoppingBag } from 'lucide-react';
import { MenuCard } from '@/components/MenuCard';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/lib/CartContext';

export default function StallMenuPage({ params }: { params: Promise<{ stallId: string }> }) {
  const resolvedParams = use(params);
  const stallName = resolvedParams.stallId.replace(/-/g, ' ').toUpperCase();
  const [activeCategory, setActiveCategory] = useState('All');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { addItem, totalItems } = useCart();
  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await supabase
          .from('menu_items')
          .select('id, name, description, price, image_url, is_available, category, is_veg, variants')
          .eq('stall_id', resolvedParams.stallId);
        if (data) setMenuItems(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [resolvedParams.stallId]);
  
  const categories = ['All', ...Array.from(new Set(menuItems.map(i => i.category)))];
  
  const filteredMenu = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(i => i.category === activeCategory);

  const handleAdd = (item: any, quantity: number, variant?: any) => {
    addItem(item, quantity, variant);
  };

  return (
    <div className="bg-[var(--color-cream)] min-h-screen pb-24 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-navy)]" />
            </Link>
            <h1 className="font-bold text-lg md:text-xl text-[var(--color-navy)] truncate max-w-[200px] md:max-w-none">
              {stallName}
            </h1>
          </div>
          <Link href="/cart" className="p-2 -mr-2 rounded-full hover:bg-gray-100 relative transition-colors">
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-navy)]" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center bg-[var(--color-byte-orange)] text-white text-[9px] font-bold rounded-full border-2 border-white shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
        
        {/* Categories */}
        <div className="border-t border-gray-100 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto flex overflow-x-auto hide-scrollbar px-4 md:px-8 py-3 md:py-4 gap-3">
            {categories.map(cat => (
              <button
                key={cat as string}
                onClick={() => setActiveCategory(cat as string)}
                className={`whitespace-nowrap px-4 md:px-6 py-1.5 md:py-2 rounded-full text-sm md:text-base font-semibold transition-all shadow-sm active:scale-95 ${
                  activeCategory === cat 
                    ? 'bg-[var(--color-navy)] text-white shadow-blue-900/20' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[var(--color-navy)]'
                }`}
              >
                {cat as string}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {loading ? (
            <div className="text-center text-gray-500 py-10 col-span-full font-medium">Loading menu...</div>
          ) : (
            <>
              {filteredMenu.map(item => (
                <div key={item.id} className="h-full">
                  <MenuCard 
                    item={item} 
                    onAdd={(qty, variant) => handleAdd(item, qty, variant)} 
                  />
                </div>
              ))}
              {filteredMenu.length === 0 && (
                <div className="text-center text-gray-500 py-10 col-span-full font-medium bg-white rounded-2xl border border-gray-100">
                  No items found in this category.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
