'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // DEMO LOCALHOST BYPASS
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        console.log("No real Supabase credentials found, bypassing login for local demo.");
        if (email === 'admin@byteandbite.com' && password === 'admin@123') {
          localStorage.setItem('demo_admin', 'true');
          setTimeout(() => router.push('/admin'), 500);
        } else {
          localStorage.setItem('demo_student', JSON.stringify({ name: 'Demo Student', email, college: 'TCET' }));
          setTimeout(() => router.push('/'), 500);
        }
        return;
      }

      // Native Supabase Email Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Check if user exists in the public.users table
      if (data.user) {
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        if (userData?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-cream)]">
      <Card className="w-full max-w-md shadow-2xl shadow-orange-100/50 border-white">
        <CardHeader className="text-center mb-6 pt-8">
          <CardTitle className="text-3xl text-[var(--color-byte-orange)] font-black tracking-tight">
            Welcome Back
          </CardTitle>
          <p className="text-gray-500 font-medium mt-2">Login to Byte & Bite</p>
        </CardHeader>
        
        <CardContent className="pb-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--color-navy)] mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    type="email" 
                    placeholder="student@college.edu" 
                    className="pl-12 h-14 bg-gray-50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--color-navy)] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    type="password" 
                    placeholder="Enter your password" 
                    className="pl-12 h-14 bg-gray-50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-lg font-bold mt-4" disabled={loading || !email || !password}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            
            <div className="text-center mt-6">
              <p className="text-gray-500 text-sm font-medium">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-[var(--color-byte-orange)] font-bold hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
