import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Puzzio.io - Play Free Games & Gaming News',
    template: '%s | Puzzio.io',
  },
  description:
    'The ultimate destination for free browser games and gaming industry news, reviews, and analysis.',
  keywords: [
    'games',
    'browser games',
    'free games',
    'gaming news',
    'game reviews',
  ],
  authors: [{ name: 'Puzzio.io Team' }],
  creator: 'Puzzio.io',
  publisher: 'Puzzio.io',
  metadataBase: new URL('https://puzzio.io'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://puzzio.io',
    siteName: 'Puzzio.io',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Puzzio.io - Gaming Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@puzzio_io',
    creator: '@puzzio_io',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
