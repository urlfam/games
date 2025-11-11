export interface Game {
  id: number;
  title: string;
  slug: string;
  category: 'puzzle' | 'action' | 'strategy' | 'arcade' | 'adventure';
  thumbnail: string;
  gameUrl: string;
  description: string;
  longDescription: string;
  popularity: number;
}

export const GAMES_DATA: Game[] = [
  {
    id: 1,
    title: 'Mystic Puzzle Quest',
    slug: 'mystic-puzzle-quest',
    category: 'puzzle',
    thumbnail:
      'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&h=300&fit=crop',
    gameUrl: 'https://www.crazygames.com/embed/2048',
    description: 'Solve challenging puzzles in a mystical world',
    longDescription: `Embark on an enchanting journey through Mystic Puzzle Quest, where ancient mysteries await your solving skills. This captivating puzzle game combines classic match-3 mechanics with innovative power-ups and magical elements that will keep you engaged for hours.

Navigate through beautifully crafted levels, each presenting unique challenges that test your strategic thinking and pattern recognition. Collect mystical artifacts, unlock special abilities, and discover hidden treasures as you progress through increasingly complex puzzles.

Perfect for both casual players and puzzle enthusiasts, Mystic Puzzle Quest offers intuitive gameplay that's easy to learn but challenging to master. With regular updates bringing new levels and features, there's always something fresh to discover in this magical puzzle adventure.`,
    popularity: 95,
  },
  {
    id: 2,
    title: 'Space Invaders Redux',
    slug: 'space-invaders-redux',
    category: 'action',
    thumbnail:
      'https://images.unsplash.com/photo-1579762715459-5a068c289fda?w=400&h=300&fit=crop',
    gameUrl: 'https://www.crazygames.com/embed/space-invaders',
    description: 'Classic arcade action in space',
    longDescription: `Experience the legendary arcade classic reimagined for modern gamers. Space Invaders Redux brings the timeless gameplay you remember with stunning visual upgrades, smooth controls, and exciting new features.

Defend Earth from waves of alien invaders in this action-packed shooter that defined the arcade generation. Use your laser cannon to blast through endless waves of enemies, dodge incoming fire, and rack up high scores. The simple yet addictive gameplay makes it perfect for quick sessions or extended play.

Features include multiple difficulty levels, power-up systems, and global leaderboards to compete with players worldwide. Whether you're a veteran player reliving nostalgia or discovering this classic for the first time, Space Invaders Redux delivers pure arcade entertainment.`,
    popularity: 88,
  },
  {
    id: 3,
    title: 'Chess Masters',
    slug: 'chess-masters',
    category: 'strategy',
    thumbnail:
      'https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=400&h=300&fit=crop',
    gameUrl: 'https://www.crazygames.com/embed/chess',
    description: 'Strategic chess gameplay',
    longDescription: `Master the ancient game of kings with Chess Masters, featuring advanced AI opponents and comprehensive tutorials for players of all skill levels. Whether you're learning the basics or honing advanced strategies, this is your complete chess platform.

Play against sophisticated AI with adjustable difficulty levels, from beginner-friendly to grandmaster challenge. The intelligent chess engine provides hints and move suggestions, making it an excellent learning tool. Practice opening strategies, endgame tactics, and everything in between.

Features include move history analysis, position evaluation, and the ability to save and review your games. The clean, elegant interface keeps the focus on strategic gameplay while providing all the tools you need to improve your chess skills.`,
    popularity: 92,
  },
  {
    id: 4,
    title: 'Tetris Evolution',
    slug: 'tetris-evolution',
    category: 'puzzle',
    thumbnail:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
    gameUrl: 'https://www.crazygames.com/embed/tetris',
    description: 'Modern take on classic Tetris',
    longDescription: `The legendary puzzle game returns with enhanced graphics, smoother gameplay, and exciting new modes. Tetris Evolution preserves the perfect simplicity of the original while adding modern touches that make it more engaging than ever.

Stack falling blocks to create complete lines and clear the board in this timeless puzzle challenge. The intuitive controls feel natural whether you're playing on desktop or mobile. Watch as the pace gradually increases, testing your reflexes and spatial reasoning skills.

With multiple game modes including Marathon, Sprint, and Ultra, there's always a new challenge to tackle. Compete for high scores, unlock achievements, and experience why Tetris remains one of the most beloved games of all time. Simple to understand, impossible to master.`,
    popularity: 97,
  },
  {
    id: 5,
    title: 'Racing Thunder',
    slug: 'racing-thunder',
    category: 'arcade',
    thumbnail:
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=300&fit=crop',
    gameUrl: 'https://www.crazygames.com/embed/racing',
    description: 'High-speed racing action',
    longDescription: `Feel the adrenaline rush of high-speed racing in Racing Thunder, where precision driving meets arcade excitement. Navigate challenging tracks, avoid obstacles, and push your vehicle to its limits in this fast-paced racing experience.

Choose from a variety of powerful vehicles, each with unique handling characteristics. Master drift techniques, find the perfect racing line, and use nitro boosts strategically to gain an edge over the competition. Dynamic weather and time-of-day changes keep every race feeling fresh.

With multiple tracks ranging from city streets to mountain passes, Racing Thunder offers diverse racing environments that test different driving skills. Collect coins to unlock new vehicles and upgrades. Perfect for quick racing sessions or extended championship runs.`,
    popularity: 85,
  },
  {
    id: 6,
    title: 'Dungeon Explorer',
    slug: 'dungeon-explorer',
    category: 'adventure',
    thumbnail:
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop',
    gameUrl: 'https://www.crazygames.com/embed/dungeon',
    description: 'Explore mysterious dungeons',
    longDescription: `Venture into the depths of mysterious dungeons filled with treasures, traps, and formidable monsters. Dungeon Explorer combines classic roguelike elements with accessible gameplay, creating an adventure that's both challenging and rewarding.

Explore procedurally generated dungeons where no two runs are the same. Collect powerful weapons, magical artifacts, and valuable loot as you delve deeper into the underground labyrinth. Strategic resource management and tactical combat decisions are key to survival.

Each character class offers unique abilities and playstyles, encouraging multiple playthroughs to master different approaches. Permanent upgrades provide a sense of progression even after defeat. With its perfect blend of exploration, combat, and character development, Dungeon Explorer offers endless replayability for adventure enthusiasts.`,
    popularity: 90,
  },
];

export const GAME_CATEGORIES = [
  'all',
  'puzzle',
  'action',
  'strategy',
  'arcade',
  'adventure',
] as const;
export const ARTICLE_CATEGORIES = [
  'All',
  'Latest News',
  'Reviews',
  'Industry Analysis',
  'Interviews',
] as const;
