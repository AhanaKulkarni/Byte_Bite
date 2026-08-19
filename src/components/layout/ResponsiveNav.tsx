'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, ShoppingCart, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export function ResponsiveNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Orders', href: '/orders', icon: ShoppingBag },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  // Don't show on admin or auth routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/auth')) {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  };

  return (
    <>
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white/80 backdrop-blur-md border-t border-gray-200 safe-area-bottom">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
              >
                <Icon 
                  className={cn(
                    "w-6 h-6 mb-1 transition-colors", 
                    isActive ? "text-[var(--color-byte-orange)]" : "text-gray-500 group-hover:text-[var(--color-byte-orange)]"
                  )} 
                />
                <span className={cn(
                  "text-[10px]",
                  isActive ? "text-[var(--color-byte-orange)] font-semibold" : "text-gray-500 group-hover:text-[var(--color-byte-orange)]"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50 p-6">
        <div className="mb-10">
          <h1 className="text-2xl font-black text-[var(--color-navy)]">Byte & Bite</h1>
          <p className="text-sm font-medium text-[var(--color-byte-orange)]">Campus Café</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-[var(--color-navy)] text-white shadow-md shadow-blue-900/10" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-[var(--color-navy)]"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-[var(--color-byte-orange)]" : "text-gray-400 group-hover:text-[var(--color-byte-orange)]")} />
                <span className="font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-gray-100 pt-6">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full text-left rounded-xl transition-all duration-200 text-gray-500 hover:bg-red-50 hover:text-red-600 group"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            <span className="font-semibold group-hover:text-red-600 transition-colors">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
