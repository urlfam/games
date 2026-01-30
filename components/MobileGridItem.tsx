'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Game, MinimalGame } from '@/lib/games';
import cloudinaryLoader from '@/lib/cloudinaryLoader';
import { isCloudinaryImage } from '@/lib/imageUtils';

interface MobileGridItemProps {
  game: Game | MinimalGame;
  className?: string;
  imgClassName?: string;
}

export default function MobileGridItem({ game, className = '', imgClassName = '' }: MobileGridItemProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Link 
      href={`/game/${game.slug}`}
      className={`flex flex-col gap-2 group ${className}`}
    >
      <div className="aspect-square relative rounded-xl overflow-hidden bg-slate-800 shadow-md">
        {/* Spinner */}
        {!isLoaded && (
             <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-5 h-5 border-2 border-slate-600 border-t-purple-400 rounded-full animate-spin"></div>
             </div>
        )}
        <Image
          loader={isCloudinaryImage(game.mobile_1x1_url || game.image_url) ? cloudinaryLoader : undefined}
          src={game.mobile_1x1_url || game.image_url}
          alt={game.title}
          fill
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
          sizes="(max-width: 480px) 33vw, 150px"
          onLoad={() => setIsLoaded(true)}
          className={`object-cover transition-transform duration-300 group-hover:scale-110 ${!isLoaded ? 'opacity-0' : 'opacity-100'} ${imgClassName}`}
        />
      </div>
      <span className="text-gray-200 text-xs font-medium text-center line-clamp-1 px-1">
        {game.title}
      </span>
    </Link>
  );
}
