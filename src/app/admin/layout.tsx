'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ClipboardList, PackageOpen, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Live Orders', href: '/admin/orders', icon: ClipboardList },
    { name: 'Stock Control', href: '/admin/stock', icon: PackageOpen },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pb-16 md:pb-0">
      
      {/* Admin Content */}
      <div className="flex-1 w-full relative">
        {children}
      </div>

      {/* Desktop Sidebar (Admin) */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-[var(--color-navy)] text-white z-50 p-6">
        <div className="mb-10">
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Panel</h1>
          <p className="text-sm font-medium text-[var(--color-byte-orange)]">Byte & Bite</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-white/10 text-white shadow-lg border border-white/5" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-[var(--color-byte-orange)]" : "text-gray-500 group-hover:text-[var(--color-byte-orange)]")} />
                <span className="font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Bottom Nav (Admin) */}
      <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-[var(--color-navy)] text-gray-400 safe-area-bottom">
        <div className="grid h-full w-full grid-cols-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "inline-flex flex-col items-center justify-center transition-colors",
                  isActive ? "text-white bg-white/10" : "hover:text-gray-200 hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-5 h-5 mb-1", isActive ? "text-[var(--color-byte-orange)]" : "")} />
                <span className={cn("text-[10px]", isActive ? "font-semibold text-white" : "")}>
                  {item.name === 'Dashboard' ? 'Dash' : item.name.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
