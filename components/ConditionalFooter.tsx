'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const showFooter = !pathname.startsWith('/game');

  return <>{showFooter && <Footer />}</>;
}
