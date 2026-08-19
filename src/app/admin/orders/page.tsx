'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Clock, Check, X, ChefHat, PackageCheck, CheckCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminOrders() {
  const [filter, setFilter] = useState('active');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await supabase
          .from('orders')
          .select('*, users(full_name, college)')
          .order('created_at', { ascending: false });
        if (data) setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    // Setup realtime subscription
    const subscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    }
  };

  const filteredOrders = orders.filter(o => 
    filter === 'active' 
      ? ['pending', 'accepted', 'preparing', 'ready'].includes(o.status)
      : o.status === 'completed'
  );

  return (
    <div className="p-4 pt-6 md:p-8 space-y-6 md:space-y-8 pb-24 md:pb-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h1 className="text-2xl md:text-4xl font-black text-[var(--color-navy)] tracking-tight">Live Orders</h1>
        
        {/* Filters */}
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('active')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm md:text-base font-bold shadow-sm transition-all active:scale-95 ${filter === 'active' ? 'bg-[var(--color-navy)] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm md:text-base font-bold shadow-sm transition-all active:scale-95 ${filter === 'completed' ? 'bg-[var(--color-navy)] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
          >
            Completed
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {loading ? (
          <div className="text-center p-12 text-gray-500 font-medium col-span-full bg-white rounded-3xl border border-gray-100 shadow-sm">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center p-12 text-gray-500 font-medium col-span-full bg-white rounded-3xl border border-gray-100 shadow-sm">
            No {filter} orders found.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="bg-white border-transparent shadow-md hover:shadow-xl hover:border-orange-100 transition-all duration-300">
              <div className="bg-gray-50 border-b border-gray-100 p-4 md:p-5 flex justify-between items-center rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-xl md:text-2xl font-black text-[var(--color-navy)]">#{order.order_number}</span>
                  <span className="text-xs font-bold px-2 py-1 bg-green-100 text-[var(--color-fresh-green)] rounded-md">
                    PAID
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-byte-orange)] bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                  <Clock className="w-4 h-4 md:w-5 md:h-5" />
                  {order.pickup_time}
                </div>
              </div>
              
              <CardContent className="p-5 md:p-6 flex flex-col h-[calc(100%-73px)]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-[var(--color-navy)]">{order.users?.full_name || 'Student'}</h3>
                    <p className="text-sm text-gray-500 font-medium">{order.users?.college || 'N/A'}</p>
                  </div>
                  <div className="text-right font-black text-xl text-[var(--color-navy)]">
                    ₹{order.total_amount}
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  {/* Action Buttons based on status */}
                  {order.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => updateOrderStatus(order.id, 'accepted')} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-bold shadow-md hover:bg-green-600 active:scale-95 transition-all">
                        <Check className="w-5 h-5" /> ACCEPT
                      </button>
                      <button onClick={() => updateOrderStatus(order.id, 'declined')} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 active:scale-95 transition-all">
                        <X className="w-5 h-5" /> DECLINE
                      </button>
                    </div>
                  )}

                  {order.status === 'accepted' && (
                    <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-white font-bold shadow-md hover:bg-orange-600 active:scale-95 transition-all">
                      <ChefHat className="w-5 h-5" /> MARK PREPARING
                    </button>
                  )}

                  {order.status === 'preparing' && (
                    <button onClick={() => updateOrderStatus(order.id, 'ready')} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 text-white font-bold shadow-md hover:bg-blue-600 active:scale-95 transition-all">
                      <PackageCheck className="w-5 h-5" /> MARK READY
                    </button>
                  )}
                  
                  {order.status === 'ready' && (
                    <button onClick={() => updateOrderStatus(order.id, 'completed')} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-fresh-green)] text-white font-bold shadow-md hover:bg-green-600 active:scale-95 transition-all">
                      <CheckCheck className="w-5 h-5" /> COMPLETE ORDER
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
