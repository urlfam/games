'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/lib/games';
import cloudinaryLoader from '@/lib/cloudinaryLoader';
import { Play } from 'lucide-react';
import { useState } from 'react';

interface MobileTrendingSectionProps {
  games: Game[];
}

export default function MobileTrendingSection({ games }: MobileTrendingSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  
  // Need at least 1 main game and some secondary games
  if (!games || games.length === 0) return null;

  const mainGame = games[0];
  const secondaryGames = games.slice(1, 7); // Max 6 small cards

  return (
    <section className="mb-8 md:hidden">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <span className="text-yellow-400">✨</span> Top picks for you
        </h2>
      </div>

      <div className="space-y-4">
        {/* Main Hero Card */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg group">
          {/* Background Image/Video */}
          <Link href={`/game/${mainGame.slug}`} className="block w-full h-full relative">
            <Image
              loader={mainGame.image_url?.includes('res.cloudinary.com') ? cloudinaryLoader : undefined}
              src={mainGame.image_url}
              alt={mainGame.title}
              fill
              className={`object-cover transition-opacity duration-300 ${
                isVideoReady ? 'opacity-0' : 'opacity-100'
              }`}
            />
            
           {/* Video Preview on Hover/Touch - Simulating the desktop preview behavior but for mobile hero */}
           {/* Note: Autoplay on mobile strictly requires interaction usually, but muted playsInline works often */}
           {mainGame.video_url && (
              <video
                src={`/previews/${mainGame.slug}.mp4`}
                poster={mainGame.image_url}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover -z-10"
                onLoadedData={() => setIsVideoReady(true)}
              />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

            {/* Content Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
              <div className="flex items-center gap-3">
                {/* Small Icon */}
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 shadow-md flex-shrink-0 relative bg-slate-800">
                    <Image
                        loader={mainGame.mobile_1x1_url?.includes('res.cloudinary.com') ? cloudinaryLoader : undefined}
                        src={mainGame.mobile_1x1_url || mainGame.image_url} // Fallback to main image if 1x1 missing
                        alt={`${mainGame.title} Icon`}
                        fill
                        className="object-cover"
                    />
                </div>
                
                <div className="flex flex-col">
                  <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 shadow-black drop-shadow-md">
                    {mainGame.title}
                  </h3>
                  <span className="text-gray-300 text-sm">
                    {mainGame.category}
                  </span>
                </div>
              </div>

              {/* Play Button */}
              <button className="bg-purple-600 text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg shadow-purple-900/50 flex items-center gap-1 pointer-events-auto">
                Play
              </button>
            </div>
          </Link>
        </div>

        {/* Grid of Small Cards */}
        <div className="grid grid-cols-3 gap-3">
          {secondaryGames.map((game) => (
            <Link 
              key={game.id} 
              href={`/game/${game.slug}`}
              className="flex flex-col gap-2 group"
            >
              <div className="aspect-square relative rounded-xl overflow-hidden bg-slate-800 shadow-md">
                <Image
                  loader={game.mobile_1x1_url?.includes('res.cloudinary.com') ? cloudinaryLoader : undefined}
                  src={game.mobile_1x1_url || game.image_url} // Fallback logic handled in rendering
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-gray-200 text-xs font-medium text-center line-clamp-1">
                {game.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
