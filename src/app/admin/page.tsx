'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Check Auth and Admin Role
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        alert('Access Denied. You are not an admin.');
        router.push('/');
        return;
      }

      fetchOrders();
    };

    checkAdmin();

    // 2. Real-time Subscription for new orders!
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        console.log('Order change received!', payload);
        fetchOrders(); // Just re-fetch to get all nested relations
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users(full_name, phone_number, college),
          order_items(
            quantity,
            price_at_time,
            variant_name,
            menu_items(name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, payment_status?: string) => {
    try {
      const updates: any = { status };
      if (payment_status) updates.payment_status = payment_status;

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Failed to update order');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex justify-center items-center font-bold">Loading Admin...</div>;
  }

  // Filter out completely finished orders for the "Live" view, but let's show all for now
  const liveOrders = orders.filter(o => o.status !== 'completed');

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-navy)]">Kitchen Dashboard</h1>
            <p className="text-gray-500 font-medium mt-1">Live incoming orders</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
            </span>
            <span className="font-bold text-green-600">Receiving</span>
          </div>
        </header>

        {liveOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-500 font-medium">
            No live orders right now. Kitchen is quiet!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveOrders.map(order => (
              <Card key={order.id} className="border-t-4 border-t-[var(--color-byte-orange)] shadow-lg hover:shadow-xl transition-all">
                <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Order #{order.id.slice(0, 6)}
                    </span>
                    <h3 className="font-black text-[var(--color-navy)] text-lg leading-tight">
                      {order.users?.full_name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">{order.users?.college} • {order.users?.phone_number}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-lg text-emerald-600 block">₹{order.total_amount}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-gray-200 rounded-md mt-1 inline-block">
                      {order.pickup_time}
                    </span>
                  </div>
                </div>

                <CardContent className="p-0">
                  <div className="p-5 bg-white">
                    <ul className="space-y-3">
                      {order.order_items?.map((item: any, i: number) => (
                        <li key={i} className="flex gap-3 items-start border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                          <div className="bg-[var(--color-navy)] text-white w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                            {item.quantity}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 leading-tight">{item.menu_items?.name}</p>
                            {item.variant_name && (
                              <p className="text-xs text-[var(--color-byte-orange)] font-bold mt-0.5">{item.variant_name}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
                    
                    {/* Payment Status Bar */}
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Payment</span>
                      {order.payment_status === 'pending' && <Badge className="bg-gray-200 text-gray-700">Not Paid</Badge>}
                      {order.payment_status === 'verifying' && <Badge className="bg-yellow-100 text-yellow-800">Verifying</Badge>}
                      {order.payment_status === 'paid' && <Badge className="bg-green-100 text-green-800 border border-green-200">Paid ✓</Badge>}
                    </div>

                    {/* Action Buttons based on state */}
                    {order.payment_status === 'verifying' && order.status === 'pending' && (
                      <Button 
                        onClick={() => updateOrderStatus(order.id, 'preparing', 'paid')}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 shadow-lg shadow-emerald-500/20"
                      >
                        Verify Payment & Start Cooking
                      </Button>
                    )}

                    {order.payment_status === 'paid' && order.status === 'preparing' && (
                      <Button 
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="w-full bg-[var(--color-byte-orange)] hover:bg-orange-600 text-white font-bold h-12 shadow-lg shadow-orange-500/20"
                      >
                        Mark as Ready for Pickup
                      </Button>
                    )}

                    {order.status === 'ready' && (
                      <Button 
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="w-full bg-[var(--color-navy)] hover:bg-blue-900 text-white font-bold h-12"
                      >
                        Handed Over (Complete)
                      </Button>
                    )}

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
