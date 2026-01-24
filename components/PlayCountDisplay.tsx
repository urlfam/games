'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface PlayCountDisplayProps {
  gameSlug: string;
  initialPlays?: number;
}

export default function PlayCountDisplay({
  gameSlug,
  initialPlays = 0,
}: PlayCountDisplayProps) {
  const [plays, setPlays] = useState(initialPlays);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch fresh play count from database (bypasses ISR cache)
    const fetchPlayCount = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('game_stats')
          .select('plays')
          .eq('game_slug', gameSlug)
          .single();

        if (data) {
          setPlays(data.plays || 0);
        }
      } catch (e) {
        console.error('[PlayCountDisplay] Error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayCount();
  }, [gameSlug]);

  return (
    <span className="text-white font-semibold">
      {loading ? (
        <span className="opacity-50">{plays > 0 ? plays.toLocaleString() : 'New'}</span>
      ) : (
        <>{plays > 0 ? plays.toLocaleString() : 'New'}</>
      )}
    </span>
  );
}
