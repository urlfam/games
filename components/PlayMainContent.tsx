'use client';

import { useSidebar } from '@/components/SidebarContext';
import { ReactNode } from 'react';

export default function PlayMainContent({ children }: { children: ReactNode }) {
  const { isSidebarOpen } = useSidebar();

  return (
    <main 
      className={`transition-all duration-300 ${
        isSidebarOpen ? 'md:pl-16' : 'pl-0'
      }`}
    >
      {children}
    </main>
  );
}
