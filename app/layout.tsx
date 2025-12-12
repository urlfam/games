import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import ConditionalFooter from '@/components/ConditionalFooter';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://puzzio.io'), // Remplacez par votre domaine
  title: {
    default: 'Puzzio.io - Free Online Games',
    template: '%s | Puzzio.io',
  },
  description:
    'Discover and play thousands of free online games. Puzzio.io offers a wide variety of puzzles, action, strategy, and arcade games to play in your browser.',
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Puzzio.io',
    url: 'https://puzzio.io',
    description:
      'Free online games platform featuring puzzles, action, strategy and arcade games',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://puzzio.io/play?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Puzzio.io',
      logo: {
        '@type': 'ImageObject',
        url: 'https://puzzio.io/logo.png', // Assurez-vous que ce logo existe
        width: 600,
        height: 60,
      },
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Puzzio.io',
    url: 'https://puzzio.io',
    logo: {
      '@type': 'ImageObject',
      url: 'https://puzzio.io/logo.png', // Assurez-vous que ce logo existe
      width: 600,
      height: 60,
    },
    sameAs: [
      // "https://twitter.com/puzzio",
      // "https://facebook.com/puzzio",
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@puzzio.io',
      url: 'https://puzzio.io/contact',
    },
  };

  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Preconnect to Cloudinary CDN for faster image loading */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Preconnect to CrazyGames for faster game loading */}
        <link rel="preconnect" href="https://imgs.crazygames.com" />
        <link rel="dns-prefetch" href="https://imgs.crazygames.com" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
