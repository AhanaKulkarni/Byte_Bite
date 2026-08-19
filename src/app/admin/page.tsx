'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { IndianRupee, ShoppingBag, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function StatCard({ title, value, icon: Icon, colorClass }: any) {
  return (
    <Card className="!p-4 bg-white shadow-sm border border-gray-100 flex flex-col justify-between h-28 rounded-2xl">
      <div className="flex justify-between items-start">
        <span className="text-sm font-semibold text-gray-500">{title}</span>
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-black text-[var(--color-navy)]">{value}</div>
    </Card>
  );
}

export default function AdminDashboard() {
  const [isStallOpen, setIsStallOpen] = useState(true);
  const [stats, setStats] = useState({ sales: 0, orders: 0, pending: 0, ready: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await supabase.from('orders').select('*');
        if (data) {
          let sales = 0;
          let orders = data.length;
          let pending = 0;
          let ready = 0;
          
          data.forEach((o: any) => {
            if (o.status !== 'cancelled' && o.status !== 'declined') {
              sales += o.total_amount || 0;
            }
            if (o.status === 'pending' || o.status === 'accepted') pending++;
            if (o.status === 'ready') ready++;
          });
          
          setStats({ sales, orders, pending, ready });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  
  return (
    <div className="p-4 pt-6 md:p-8 space-y-6 md:space-y-8 pb-24 md:pb-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-end mb-8 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-[var(--color-navy)] tracking-tight">Dashboard</h1>
          <p className="text-sm md:text-base font-medium text-gray-500 mt-1">Byte & Bite • {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
        </div>
        <button 
          onClick={() => setIsStallOpen(!isStallOpen)}
          className={`px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm md:text-base font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2 ${
            isStallOpen ? 'bg-green-100 text-[var(--color-fresh-green)] hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isStallOpen ? 'bg-[var(--color-fresh-green)] animate-pulse' : 'bg-red-600'}`} />
          {isStallOpen ? 'OPEN' : 'CLOSED'}
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        <StatCard 
          title="TODAY'S SALES" 
          value={`₹${stats.sales}`} 
          icon={IndianRupee} 
          colorClass="bg-orange-50 text-[var(--color-byte-orange)]"
        />
        <StatCard 
          title="TOTAL ORDERS" 
          value={stats.orders} 
          icon={ShoppingBag} 
          colorClass="bg-blue-50 text-blue-500"
        />
        <StatCard 
          title="PENDING" 
          value={stats.pending} 
          icon={Clock} 
          colorClass="bg-red-50 text-red-500"
        />
        <StatCard 
          title="READY" 
          value={stats.ready} 
          icon={CheckCircle} 
          colorClass="bg-green-50 text-[var(--color-fresh-green)]"
        />
      </div>

      <div className="pt-4 md:pt-8 max-w-sm">
        <button className="w-full py-4 bg-[var(--color-navy)] hover:bg-blue-950 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 transition-all active:scale-95">
          Generate EOD Report
        </button>
      </div>
    </div>
  );
}
