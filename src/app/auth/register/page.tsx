'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Lock, Phone, User, GraduationCap } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // DEMO LOCALHOST BYPASS
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        console.log("No real Supabase credentials found, bypassing registration for local demo.");
        localStorage.setItem('demo_student', JSON.stringify({ name, phone, college }));
        setTimeout(() => router.push('/'), 500);
        return;
      }

      // Use phone as a pseudo-email for Supabase Auth to avoid needing paid Twilio SMS
      const pseudoEmail = `user_${phone}@byteandbite.com`;

      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: pseudoEmail,
        password: password,
      });

      if (authError) {
        // Sanitize error message to hide the pseudo-email implementation
        let msg = authError.message;
        if (msg.includes('Email address') || msg.includes('email')) {
          msg = 'Invalid phone number format or account already exists.';
        }
        throw new Error(msg);
      }

      // 2. Add extra data to public.users table
      if (authData.user) {
        const { error: dbError } = await supabase.from('users').insert({
          id: authData.user.id,
          phone_number: `+91${phone}`,
          full_name: name,
          college: college,
          role: 'student'
        });

        if (dbError) throw dbError;
      }

      // Success, redirect to home
      router.push('/');
    } catch (err: any) {
      if (err.message.includes('User already registered')) {
        setError('This phone number is already registered.');
      } else {
        setError(err.message || 'Failed to complete registration');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-cream)]">
      <Card className="w-full max-w-md shadow-2xl shadow-orange-100/50 border-white">
        <CardHeader className="text-center mb-6 pt-8">
          <CardTitle className="text-3xl text-[var(--color-byte-orange)] font-black tracking-tight">
            Create Account
          </CardTitle>
          <p className="text-gray-500 font-medium mt-2">Join Byte & Bite</p>
        </CardHeader>
        
        <CardContent className="pb-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-4">
              
              <div>
                <label className="block text-sm font-bold text-[var(--color-navy)] mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    type="text" 
                    placeholder="Enter your full name" 
                    className="pl-12 h-14 bg-gray-50"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--color-navy)] mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    type="tel" 
                    placeholder="10-digit mobile number" 
                    className="pl-12 h-14 bg-gray-50"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--color-navy)] mb-2">College</label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <select 
                    className="flex h-14 w-full pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-base text-[var(--color-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-byte-orange)] focus:border-transparent transition-all appearance-none relative"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select your college</option>
                    <option value="TCET">TCET (Thakur College of Engineering)</option>
                    <option value="TCSC">TCSC (Thakur College of Science & Commerce)</option>
                    <option value="TIMSR">TIMSR (Thakur Institute of Management)</option>
                    <option value="TSAP">TSAP (Thakur School of Architecture)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--color-navy)] mb-2">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    type="password" 
                    placeholder="At least 6 characters" 
                    className="pl-12 h-14 bg-gray-50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-lg font-bold mt-4" disabled={loading || phone.length !== 10 || !password || !name || !college}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
            
            <div className="text-center mt-6">
              <p className="text-gray-500 text-sm font-medium">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-[var(--color-byte-orange)] font-bold hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
