import { Metadata } from 'next';
import CategorySidebar from '@/components/CategorySidebar';

export const metadata: Metadata = {
  title: 'Play Free Online Games',
  description:
    'Browse and play thousands of free online games. Puzzle, action, strategy and arcade games.',
  alternates: {
    canonical: '/play',
  },
};

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900">
      <CategorySidebar />
      <main className="pl-16 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
