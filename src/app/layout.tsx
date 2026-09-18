import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ResponsiveNav } from '@/components/layout/ResponsiveNav';
import { MainWrapper } from '@/components/layout/MainWrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Byte & Bite - Campus Snack Café',
  description: 'Order your favorite snacks from Byte & Bite and Cafe 101 seamlessly.',
  manifest: '/manifest.json',
  themeColor: '#F28C18',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

import { CartProvider } from '@/lib/CartContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 flex flex-col md:flex-row`}
      >
        <CartProvider>
          <ResponsiveNav />
          <MainWrapper>
            {children}
          </MainWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
