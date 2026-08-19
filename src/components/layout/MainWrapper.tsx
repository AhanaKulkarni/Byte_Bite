'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If we are on an auth route, we DO NOT want the md:pl-64 padding.
  const isAuthRoute = pathname?.startsWith('/auth');

  return (
    <main 
      className={cn(
        "flex-1 min-h-screen relative bg-[var(--color-cream)] pb-16 md:pb-0 w-full",
        !isAuthRoute && "md:pl-64"
      )}
    >
      {children}
    </main>
  );
}
