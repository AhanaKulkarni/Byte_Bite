'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function StatusTimeline({ status }: { status: string }) {
  const steps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'payment_verified', label: 'Payment Verified' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
  ];

  let currentIdx = steps.findIndex(s => s.key === status);
  if (status === 'completed') currentIdx = steps.length;
  
  return (
    <div className="flex flex-col gap-3 py-2">
      {steps.map((step, idx) => {
        const isCompleted = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        
        return (
          <div key={step.key} className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              {isCompleted ? (
                <CheckCircle2 className={`w-5 h-5 ${isCurrent ? 'text-[var(--color-byte-orange)]' : 'text-[var(--color-fresh-green)]'}`} />
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
              {idx < steps.length - 1 && (
                <div className={`absolute top-5 w-0.5 h-3 ${isCompleted && !isCurrent ? 'bg-[var(--color-fresh-green)]' : 'bg-gray-200'}`} />
              )}
            </div>
            <span className={`text-sm ${isCurrent ? 'font-bold text-[var(--color-navy)]' : isCompleted ? 'font-medium text-gray-700' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session && !localStorage.getItem('demo_admin')) {
          setLoading(false);
          return;
        }

        const userId = session?.user?.id;
        let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
        
        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data } = await query;
        if (data) setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-[var(--color-cream)] min-h-screen p-4 md:p-8 pt-8 pb-24 md:pb-12 space-y-6 md:space-y-8 max-w-4xl mx-auto">
      <header className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-[var(--color-navy)]">My Orders</h1>
      </header>

      <div className="space-y-4 md:space-y-6">
        {loading ? (
          <div className="text-center p-12 text-gray-500 font-medium bg-white rounded-3xl shadow-sm border border-gray-100">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center p-12 text-gray-500 font-medium bg-white rounded-3xl border border-gray-100 shadow-sm">
            You haven't placed any orders yet.
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="bg-gray-50 border-b border-gray-100 px-5 md:px-6 py-4 flex justify-between items-center">
                <span className="font-bold text-[var(--color-navy)] md:text-lg">#{order.order_number}</span>
                <span className="text-xs md:text-sm text-gray-500 font-medium">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <CardContent className="p-5 md:p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-lg md:text-xl text-[var(--color-navy)]">Stall Order</h3>
                    <p className="text-sm md:text-base text-gray-500 mt-1">₹{order.total_amount}</p>
                  </div>
                </div>

                {order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'declined' && (
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-[var(--color-byte-orange)]" />
                      <span className="font-bold text-[var(--color-navy)] text-sm md:text-base">Pickup at {order.pickup_time}</span>
                    </div>
                    <StatusTimeline status={order.status} />
                  </div>
                )}

                {order.status === 'completed' && (
                  <div className="flex items-center gap-3 text-[var(--color-fresh-green)] bg-green-50 p-4 md:p-5 rounded-2xl border border-green-100">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-semibold md:text-lg">Completed at {order.pickup_time}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
