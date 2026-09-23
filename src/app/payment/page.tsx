'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, CheckCircle2, Copy } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import Link from 'next/link';

// Use a wrapper to safely use useSearchParams
function PaymentContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const router = useRouter();
  const { clearCart } = useCart();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [utrNumber, setUtrNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // The cafe owner's UPI Details (from the uploaded screenshot)
  const upiId = "paytmqr6njeyk@ptys";
  const payeeName = "Star momos corner";
  
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
        
      if (data) {
        setOrder(data);
      }
      setLoading(false);
    };
    
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)]">Loading order...</div>;
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)]">Order not found.</div>;
  }

  // Generate dynamic UPI intent link
  // upi://pay?pa=UPI_ID&pn=PAYEE_NAME&am=AMOUNT&cu=INR&tn=ORDER_ID
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${order.total_amount}&cu=INR&tn=Order_${order.id.slice(0, 8)}`;
  
  // Use a free API to generate the QR code image for this specific link
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}&color=051f3e`; // Using navy color

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'verifying',
          utr_number: utrNumber
        })
        .eq('id', order.id);

      if (error) throw error;
      
      // Clear the cart now that order is placed and payment submitted
      clearCart();
      
      // Redirect to a success/tracking page (we'll create this later, routing to home for now)
      alert("Payment submitted! The cafe will verify it and prepare your order.");
      router.push('/profile'); // Go to profile to see orders
      
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--color-cream)] min-h-screen p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 bg-white shadow-sm transition-colors">
            <ArrowLeft className="w-5 h-5 text-[var(--color-navy)]" />
          </button>
          <h1 className="font-black text-2xl text-[var(--color-navy)]">Payment</h1>
        </div>

        <Card className="shadow-xl shadow-blue-900/10 border-white overflow-hidden">
          <div className="bg-[var(--color-navy)] p-6 text-center text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <p className="text-white/80 font-medium mb-1 relative z-10">Total Amount to Pay</p>
            <h2 className="text-4xl font-black relative z-10 tracking-tight">₹{order.total_amount}</h2>
            <p className="text-white/60 text-xs mt-2 relative z-10">Order #{order.id.slice(0, 8).toUpperCase()}</p>
          </div>

          <CardContent className="p-6 md:p-8 space-y-8">
            
            {/* Desktop / Manual Scan approach */}
            <div className="flex flex-col items-center">
              <p className="font-bold text-[var(--color-navy)] mb-4 text-center">Scan with any UPI App</p>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                <img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48 rounded-xl" />
              </div>
              <div className="flex items-center gap-2 mt-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 text-sm font-medium text-gray-600">
                {upiId}
                <button onClick={copyUpiId} className="text-[var(--color-byte-orange)] hover:text-orange-600 ml-2">
                  {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-400 font-bold bg-[var(--color-cream)] px-2">OR</span>
              </div>
            </div>

            {/* Mobile Auto-Open Button */}
            <a href={upiLink} className="block">
              <Button className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg shadow-lg shadow-green-500/20 active:scale-95 transition-transform rounded-xl">
                Pay Using GPay / PhonePe
              </Button>
            </a>

            {/* Verification Form */}
            <form onSubmit={handleVerify} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 mt-6">
              <h3 className="font-bold text-[var(--color-navy)] mb-1">Verify Payment</h3>
              <p className="text-xs text-gray-500 mb-4">After paying, enter the 12-digit UTR / UPI Reference Number below.</p>
              
              <Input 
                placeholder="e.g. 320145890123" 
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 12))}
                className="h-12 bg-white mb-3 tracking-widest font-mono text-center"
                required
                minLength={12}
                maxLength={12}
              />
              
              <Button type="submit" disabled={submitting || utrNumber.length < 12} className="w-full h-12 bg-[var(--color-navy)] hover:bg-blue-900 rounded-xl font-bold">
                {submitting ? 'Submitting...' : 'Submit to Kitchen'}
              </Button>
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
