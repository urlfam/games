'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showFooter = !pathname.startsWith('/play');
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <Header />
        {children}
        {showFooter && <Footer />}
      </body>
    </html>
  );
}
