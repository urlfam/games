import HomePage from '@/app/page';
import { Metadata } from 'next';

// ISR: Regenerate this page every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Trending Games - Most Popular Free Online Games on Puzzio',
  description:
    'Play the most popular and trending games on Puzzio.io. See what everyone is playing right now. Updated daily with the hottest free online games.',
  alternates: {
    canonical: 'https://puzzio.io/trending',
  },
  openGraph: {
    title: 'Trending Games - Puzzio',
    description:
      'Play the most popular and trending games on Puzzio.io. See what everyone is playing right now.',
    url: 'https://puzzio.io/trending',
    type: 'website',
  },
};

export default function TrendingPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const newSearchParams = { ...searchParams, category: 'trending' };

  return <HomePage searchParams={newSearchParams} />;
}
