import { getGameBySlug } from '@/lib/games';
import { notFound } from 'next/navigation';
import GameEditor from './GameEditor';

// Ensure the page is never cached so we see latest edits
export const dynamic = 'force-dynamic';

export default async function EditGamePage({
  params,
}: {
  params: { slug: string };
}) {
  const game = await getGameBySlug(params.slug);

  if (!game) {
    notFound();
  }

  return <GameEditor game={game} />;
}
