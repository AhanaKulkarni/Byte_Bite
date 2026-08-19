'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Flame, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [stalls, setStalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStalls = async () => {
      try {
        const { data } = await supabase.from('stalls').select('*');
        if (data) setStalls(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStalls();
  }, []);

  return (
    <div className="p-4 pt-8 pb-24 md:p-8 lg:p-12 space-y-8 bg-[var(--color-cream)] min-h-screen max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-[var(--color-navy)] mb-2 tracking-tight">
          Byte & Bite
        </h1>
        <p className="text-[var(--color-byte-orange)] font-bold md:text-lg">Good food. Good mood.</p>
      </header>

      {/* Today's Offer Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-byte-orange)]" />
          <h2 className="text-lg md:text-2xl font-bold text-[var(--color-navy)]">Today's Special</h2>
        </div>
        <Card className="bg-gradient-to-r from-[var(--color-byte-orange)] to-[var(--color-warm-orange)] !border-none !rounded-2xl !p-6 md:!p-10 relative overflow-hidden shadow-xl shadow-orange-200/50 max-w-3xl">
          <div className="relative z-10">
            <h3 className="text-white font-black text-2xl md:text-4xl mb-2">Waffle Wednesday</h3>
            <p className="text-white/90 font-medium md:text-lg">Save on all mini rectangular waffles today.</p>
          </div>
          <div className="absolute right-[-20px] top-[-20px] w-32 h-32 md:w-64 md:h-64 bg-white/10 rounded-full blur-2xl md:blur-3xl" />
        </Card>
      </section>

      {/* Stalls Section */}
      <section>
        <h2 className="text-lg md:text-2xl font-bold text-[var(--color-navy)] mb-4">Order From</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          
          {loading ? (
            <div className="text-center p-8 text-gray-500 col-span-full">Loading stalls...</div>
          ) : stalls.length === 0 ? (
            <div className="text-center p-8 text-gray-500 bg-white rounded-2xl border border-gray-100 col-span-full">
              No stalls available right now.
            </div>
          ) : (
            stalls.map(stall => (
              <Link key={stall.id} href={`/stalls/${stall.id}`} className="block h-full">
                <Card className="hover:-translate-y-2 transition-all duration-300 h-full border-transparent hover:border-orange-100 hover:shadow-xl hover:shadow-orange-100/50">
                  <CardContent className="p-5 md:p-6 flex gap-5 items-center h-full">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden relative shadow-inner">
                      <span className="text-2xl md:text-3xl font-black text-[var(--color-navy)] uppercase tracking-tighter">
                        {stall.name.substring(0, 3)}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-lg md:text-xl text-[var(--color-navy)] mb-1">{stall.name}</h3>
                      <p className="text-sm md:text-base text-gray-500 mb-3">{stall.description || 'Campus Café'}</p>
                      
                      <div className="flex items-center gap-2 text-xs md:text-sm font-bold">
                        {stall.is_active ? (
                          <span className="flex items-center gap-1.5 text-[var(--color-fresh-green)] bg-green-50 px-2.5 py-1 rounded-md">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-fresh-green)] animate-pulse" />
                            Open
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-red-500 bg-red-50 px-2.5 py-1 rounded-md">
                            Closed
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md">
                          <Clock className="w-3.5 h-3.5" />
                          20–25 min
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
          
        </div>
      </section>
    </div>
  );
}
