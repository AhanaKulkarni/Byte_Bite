'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';

export default function AdminStock() {
  const [stock, setStock] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const { data } = await supabase.from('menu_items').select('*').order('category');
        if (data) setStock(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  const toggleStock = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const { error } = await supabase.from('menu_items').update({ is_available: newStatus }).eq('id', id);
    if (!error) {
      setStock(stock.map(item => 
        item.id === id ? { ...item, is_available: newStatus } : item
      ));
    }
  };

  const filteredStock = stock.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(new Set(stock.map(i => i.category)));

  return (
    <div className="p-4 pt-6 md:p-8 space-y-6 md:space-y-8 pb-24 md:pb-12 max-w-4xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-black text-[var(--color-navy)] tracking-tight">Stock Control</h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search items..." 
            className="pl-12 bg-white h-12 md:h-14 rounded-xl border-gray-200 shadow-sm text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="space-y-6 md:space-y-8">
        {loading ? (
          <div className="text-center p-12 text-gray-500 font-medium bg-white rounded-3xl border border-gray-100 shadow-sm">Loading stock...</div>
        ) : filteredStock.length === 0 ? (
          <div className="text-center p-12 text-gray-500 font-medium bg-white rounded-3xl border border-gray-100 shadow-sm">
            No items found.
          </div>
        ) : (
          categories.map(category => {
            const categoryItems = filteredStock.filter(item => item.category === category);
            if (categoryItems.length === 0) return null;
            
            return (
              <div key={category as string} className="space-y-3 md:space-y-4">
                <h2 className="text-sm md:text-base font-bold text-gray-500 uppercase tracking-wider pl-1 md:pl-2">{category as string}</h2>
                <Card className="!p-0 overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="divide-y divide-gray-100">
                    {categoryItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-4 md:p-5 bg-white hover:bg-gray-50 transition-colors">
                        <span className={`font-semibold md:text-lg ${!item.is_available ? 'text-gray-400' : 'text-[var(--color-navy)]'}`}>
                          {item.name}
                        </span>
                        
                        <button 
                          onClick={() => toggleStock(item.id, item.is_available)}
                          className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold shadow-sm transition-all active:scale-95 ${
                            item.is_available 
                              ? 'bg-green-100 text-[var(--color-fresh-green)] border border-green-200 hover:bg-green-200' 
                              : 'bg-red-100 text-red-600 border border-red-200 hover:bg-red-200'
                          }`}
                        >
                          {item.is_available ? 'AVAILABLE' : 'OUT OF STOCK'}
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
