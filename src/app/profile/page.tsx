'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // Mock admin check for demo purposes
      const demoAdmin = localStorage.getItem('demo_admin');
      if (demoAdmin) {
        setUser({ full_name: 'Admin Demo', phone_number: '+91 89283 52406', college: 'Byte & Bite' });
        setLoading(false);
        return;
      }

      // Mock student check for demo purposes
      const demoStudentStr = localStorage.getItem('demo_student');
      if (demoStudentStr) {
        try {
          const student = JSON.parse(demoStudentStr);
          setUser({ 
            full_name: student.name, 
            phone_number: `+91 ${student.phone.slice(0,5)} ${student.phone.slice(5)}`, 
            college: student.college 
          });
          setLoading(false);
          return;
        } catch (e) {
          console.error(e);
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (data) setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    localStorage.removeItem('demo_admin');
    localStorage.removeItem('demo_student');
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  if (loading) return <div className="p-12 text-center text-gray-500 font-medium">Loading profile...</div>;

  return (
    <div className="bg-[var(--color-cream)] min-h-screen p-4 pt-8 pb-24 md:p-8 md:pb-12 space-y-6 md:space-y-8 max-w-2xl mx-auto">
      <header className="mb-6 md:mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-[var(--color-navy)] tracking-tight">Profile</h1>
      </header>

      <Card className="shadow-lg border-white">
        <CardContent className="p-6 md:p-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-[var(--color-byte-orange)] shadow-inner border-4 border-white">
            <UserIcon className="w-10 h-10 md:w-12 md:h-12" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[var(--color-navy)] mb-2 tracking-tight">{user?.full_name || 'Student Name'}</h2>
          <p className="text-gray-500 font-medium mb-8 text-sm md:text-base">{user?.phone_number || '+91 XXXX XXXX'}</p>
          
          <div className="w-full space-y-4 max-w-md mx-auto text-left">
            <div className="bg-gray-50 p-4 md:p-5 rounded-2xl border border-gray-100 hover:border-orange-100 transition-colors">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">College</span>
              <span className="font-semibold text-lg text-[var(--color-navy)]">{user?.college || 'Not set'}</span>
            </div>
            
            {user?.full_name === 'Admin Demo' && (
              <div className="bg-orange-50 p-4 md:p-5 rounded-2xl border border-orange-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Role</span>
                <span className="font-semibold text-lg text-[var(--color-byte-orange)]">Administrator</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="max-w-md mx-auto pt-4 md:pt-8">
        <Button 
          variant="secondary" 
          className="w-full h-14 text-red-500 border-2 border-red-100 bg-white hover:bg-red-50 hover:border-red-200 font-bold text-lg active:scale-95 transition-all shadow-sm"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Log out
        </Button>
      </div>
    </div>
  );
}
