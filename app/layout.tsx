import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Nunito } from 'next/font/google';
import './globals.css';
import HeaderServer from '@/components/HeaderServer';
import ConditionalFooter from '@/components/ConditionalFooter';
import { SidebarProvider } from '@/components/SidebarContext';
import CategorySidebarServer from '@/components/CategorySidebarServer';
import PlayMainContent from '@/components/PlayMainContent';
import NextTopLoader from 'nextjs-toploader';

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
  keywords: [
    'free games',
    'online games',
    'browser games',
    'puzzle games',
    'action games',
    'html5 games',
    'play in browser',
  ],
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'VOTRE_CODE_DE_VALIDATION_ICI', // ⚠️ Remplacez ceci par le code donné par Google Search Console
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://puzzio.io',
    siteName: 'Puzzio.io',
    title: 'Puzzio.io - Free Online Games',
    description:
      'Discover and play thousands of free online games directly in your browser.',
    images: [
      {
        url: 'https://puzzio.io/puzzio.webp',
        width: 1200,
        height: 630,
        alt: 'Puzzio.io - Free Online Games',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Puzzio.io - Free Online Games',
    description:
      'Play thousands of free online games instantly. No downloads required.',
    images: ['https://puzzio.io/puzzio.webp'],
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
  const headersList = headers();
  // We use a header set in middleware to detect the route without client-side hooks
  // This helps us isolate the Admin panel visually from the public site layout
  const pathname = headersList.get('x-pathname') || '';
  const isAdmin = pathname.startsWith('/admin');

  // Schema definitions...
  const websiteSchema = {
    // ... same schema as before
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

  if (isAdmin) {
    return (
      <html lang="en" className={nunito.className}>
        <body>
          <NextTopLoader color="#9333ea" showSpinner={false} />
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={nunito.className}>
      <head>
        {/* Preconnect to Cloudinary CDN for faster image loading */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Preconnect to CrazyGames for faster game loading */}
        <link rel="preconnect" href="https://imgs.crazygames.com" />
        <link rel="dns-prefetch" href="https://imgs.crazygames.com" />

        {/* Preload Hero Image (Throne Tactics) for LCP optimization */}
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/dlygtl5qb/image/upload/w_640/f_auto,q_auto/v1766934008/throne-tactics-free-online-pvp-deck-building-game.png"
          // @ts-ignore
          fetchpriority="high"
          imageSizes="(max-width: 640px) 100vw, 640px"
        />

        {/* Dynamic Preconnect to Supabase */}
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <>
            <link
              rel="preconnect"
              href={process.env.NEXT_PUBLIC_SUPABASE_URL}
            />
            <link
              rel="dns-prefetch"
              href={process.env.NEXT_PUBLIC_SUPABASE_URL}
            />
          </>
        )}

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
