'use client';

import { usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import { SidebarProvider } from '@/components/SidebarContext';
import PlayMainContent from '@/components/PlayMainContent';
import React from 'react';

export default function ClientLayout({
  children,
  header,
  sidebar,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      <NextTopLoader
        color="#9333ea"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #9333ea,0 0 5px #9333ea"
      />
      
      {isAdmin ? (
         children 
      ) : (
        <SidebarProvider>
          {header}
          {sidebar}
          <PlayMainContent>{children}</PlayMainContent>
        </SidebarProvider>
      )}
    </>
  );
}
