'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QrCode, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const amount = searchParams?.get('amount') || '0';
  const orderId = searchParams?.get('orderId') || 'UNKNOWN';
  
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    // Mock upload to Supabase storage
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
      
      // Redirect to orders tracking after showing success
      setTimeout(() => {
        router.push('/orders');
      }, 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in">
        <CheckCircle2 className="w-24 h-24 text-[var(--color-fresh-green)] mb-6" />
        <h2 className="text-2xl font-bold text-[var(--color-navy)] mb-2">Payment Submitted</h2>
        <p className="text-gray-500">Your screenshot has been received for verification.</p>
        <p className="text-sm text-gray-400 mt-8">Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-2">Pay Exactly</h2>
        <div className="text-5xl font-black text-[var(--color-navy)]">₹{amount}</div>
      </div>

      <Card className="bg-white !p-8 flex flex-col items-center justify-center">
        {/* Placeholder for real QR Code */}
        <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
          <QrCode className="w-24 h-24 text-gray-300" />
        </div>
        
        <div className="text-center space-y-1">
          <p className="font-bold text-[var(--color-navy)] text-lg">Byte & Bite</p>
          <p className="text-gray-500 font-mono text-sm">byteandbite@upi</p>
        </div>
        
        <div className="w-full h-px bg-gray-100 my-6" />
        
        <div className="flex items-start gap-3 text-sm text-left text-gray-600 bg-orange-50 p-4 rounded-xl w-full">
          <AlertCircle className="w-5 h-5 text-[var(--color-byte-orange)] shrink-0 mt-0.5" />
          <p>Scan using any UPI app (GPay, PhonePe, Paytm). <strong className="text-[var(--color-navy)]">Do not change the amount.</strong></p>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="font-bold text-[var(--color-navy)] px-1">Upload Payment Screenshot</h3>
        
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-white hover:bg-gray-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 font-medium">
              {file ? file.name : 'Tap to select screenshot'}
            </p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>

        <Button 
          className="w-full h-14 text-lg"
          disabled={!file || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? 'Uploading...' : 'Submit Payment'}
        </Button>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="bg-[var(--color-cream)] min-h-screen p-4 pt-8 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Complete Payment</h1>
        <p className="text-gray-500 text-sm">Order #024</p>
      </header>
      
      <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading...</div>}>
        <PaymentContent />
      </Suspense>
    </div>
  );
}
