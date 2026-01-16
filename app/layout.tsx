import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import HeaderServer from '@/components/HeaderServer';
import ConditionalFooter from '@/components/ConditionalFooter';
import { SidebarProvider } from '@/components/SidebarContext';
import CategorySidebarServer from '@/components/CategorySidebarServer';
import PlayMainContent from '@/components/PlayMainContent';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700', '800', '900'],
});

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        urlTemplate: 'https://puzzio.io/?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Puzzio.io',
      logo: {
        '@type': 'ImageObject',
        url: 'https://puzzio.io/puzzio.webp', // Updated logo
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
      url: 'https://puzzio.io/puzzio.webp', // Updated logo
      width: 600,
      height: 60,
    },
    sameAs: [
      'https://twitter.com/puzzio',
      'https://facebook.com/puzzio',
      'https://instagram.com/puzzio',
      'https://youtube.com/puzzio',
      'https://discord.gg/puzzio',
      'https://pinterest.com/puzzio',
      'https://reddit.com/r/puzzio',
      'https://tiktok.com/@puzzio',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@puzzio.io',
      url: 'https://puzzio.io/contact',
    },
  };

  return (
    <html lang="en" className={nunito.className}>
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
        <SidebarProvider>
          <HeaderServer />
          <CategorySidebarServer />
          <PlayMainContent>{children}</PlayMainContent>
          {/* <ConditionalFooter /> - Hidden as per request */}
        </SidebarProvider>
      </body>
    </html>
  );
}
