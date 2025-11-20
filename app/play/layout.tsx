import { Metadata } from 'next';

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
  return <>{children}</>;
}
