import {
  Home,
  Clock,
  Sparkles,
  Flame,
  Sword,
  Compass,
  Dumbbell,
  Crosshair,
  Spade,
  PersonStanding,
  MousePointer2,
  Car,
  Gem,
  Trophy,
  Ghost,
  Circle,
  Castle,
  PanelLeft,
  Music,
  Palette,
  Gamepad2,
  Users,
  UsersRound,
  Target,
  Bike,
  type LucideIcon,
} from 'lucide-react';

/**
 * Maps category names/slugs to their corresponding Lucide React icons.
 * This allows dynamic icon assignment for any category.
 */
export const categoryIconMap: Record<string, LucideIcon> = {
  // Special categories
  all: Home,
  home: Home,
  'recently-played': Clock,
  recent: Clock,
  new: Sparkles,
  trending: Flame,
  popular: Flame,
  'popular-games': Flame,
  updated: Sparkles,
  originals: Gamepad2,
  multiplayer: Users,
  '2-player': UsersRound,
  '2player': UsersRound,

  // Game categories (lowercase with hyphens)
  action: Sword,
  adventure: Compass,
  basketball: Dumbbell,
  pool: Circle,
  billard: Circle,
  card: Spade,
  cards: Spade,
  casual: PersonStanding,
  clicker: MousePointer2,
  driving: Car,
  conduite: Car,
  car: Car,
  'tower-defense': Castle,
  'defense-de-tour': Castle,
  escape: PanelLeft,
  evasion: PanelLeft,
  flash: Music,
  soccer: Trophy,
  football: Trophy,
  sports: Trophy,
  horror: Ghost,
  horreur: Ghost,
  io: Circle,
  '.io': Circle,
  mahjong: Palette,
  shooting: Crosshair,
  tir: Crosshair,
  puzzle: Gem,
  racing: Car,
  strategy: Target,
  strategie: Target,
  arcade: Gamepad2,
  rpg: Compass,
  simulation: PersonStanding,
  bike: Bike,
  velo: Bike,
};

/**
 * Gets an icon for a category. Falls back to Gamepad2 if not found.
 * @param categorySlug - The category slug (lowercase with hyphens)
 * @returns The corresponding Lucide icon component
 */
export function getCategoryIcon(categorySlug: string): LucideIcon {
  const normalizedSlug = categorySlug.toLowerCase().replace(/\s+/g, '-');
  return categoryIconMap[normalizedSlug] || Gamepad2;
}
