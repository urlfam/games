import { Metadata } from 'next';
import CategorySidebarServer from '@/components/CategorySidebarServer';
import PlayMainContent from '@/components/PlayMainContent';

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
  return <div className="min-h-screen bg-slate-900">{children}</div>;
}
