'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const PICKUP_TIMES = [
  'ASAP',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
];

export default function CartPage() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<string>('ASAP');
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]); // Real client cart would load from context/store

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = cartItems.length > 0 ? 10 : 0;
  const total = subtotal - discount;

  const handleCheckout = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(`/payment?amount=${total}&orderId=025`);
    }, 1000);
  };

  return (
    <div className="bg-[var(--color-cream)] min-h-screen pb-24 md:pb-12">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 h-14 md:h-16 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-navy)]" />
          </Link>
          <h1 className="font-bold text-lg md:text-xl text-[var(--color-navy)]">Your Cart</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 md:pt-8 space-y-6 md:space-y-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm">
            Your cart is empty.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-6 md:gap-8 items-start">
            <div className="space-y-6 md:space-y-8">
              {/* Cart Items */}
              <section>
                <Card className="!p-0 overflow-hidden shadow-sm">
                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-4 md:p-6 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                        <div>
                          <h3 className="font-bold text-base md:text-lg text-[var(--color-navy)]">{item.name}</h3>
                          <p className="text-xs md:text-sm text-gray-500">{item.stall}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm md:text-base font-semibold text-gray-500">× {item.quantity}</span>
                          <span className="font-bold text-base md:text-lg text-[var(--color-navy)] w-16 text-right">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Bill Details */}
                  <div className="bg-gray-50 p-4 md:p-6 border-t border-gray-100 space-y-3">
                    <div className="flex justify-between text-sm md:text-base text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm md:text-base text-[var(--color-fresh-green)] font-medium">
                        <span>Discount</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-gray-200 flex justify-between font-black text-lg md:text-xl text-[var(--color-navy)]">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </Card>
              </section>

              {/* Pickup Time */}
              <section>
                <h2 className="text-lg md:text-xl font-bold text-[var(--color-navy)] mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 md:w-6 md:h-6" />
                  Select Pickup Time
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {PICKUP_TIMES.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-2 md:py-4 rounded-xl text-sm md:text-base font-bold transition-all active:scale-95 ${
                        selectedTime === time
                          ? 'bg-[var(--color-navy)] text-white shadow-md shadow-blue-900/20'
                          : 'bg-white text-[var(--color-navy)] hover:bg-gray-50 border border-gray-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 flex gap-3 text-xs md:text-sm text-gray-600 bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <Info className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-byte-orange)] shrink-0" />
                  <p>Your order will be prepared fresh for your selected pickup time. Please arrive exactly on time.</p>
                </div>
              </section>
            </div>

            {/* Desktop Checkout Sidebar (Mobile Bottom) */}
            <div className="sticky top-24 pt-4 md:pt-0">
              <Card className="bg-white shadow-xl shadow-gray-200/50 border-gray-100">
                <CardContent className="p-5 md:p-6 space-y-4">
                  <div className="hidden md:block">
                    <h3 className="font-bold text-lg text-[var(--color-navy)] border-b border-gray-100 pb-3 mb-4">Order Summary</h3>
                    <div className="flex justify-between font-black text-2xl text-[var(--color-navy)] mb-6">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full h-14 md:h-16 text-lg md:text-xl font-bold shadow-lg shadow-blue-900/20 transition-transform active:scale-95" 
                    onClick={handleCheckout}
                    disabled={isLoading || cartItems.length === 0}
                  >
                    {isLoading ? 'Processing...' : `Pay ₹${total} via UPI`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
