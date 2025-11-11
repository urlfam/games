export interface Author {
  name: string;
  avatar: string;
  bio: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  category: 'Latest News' | 'Reviews' | 'Industry Analysis' | 'Interviews';
  excerpt: string;
  content: string; // full content
  author: Author;
  publishDate: string;
  featuredImage: string;
  tags: string[];
}

export const ARTICLES_DATA: Article[] = [
  {
    id: 1,
    title: 'Rise of Browser Gaming in 2025',
    slug: 'rise-of-browser-gaming-2025',
    category: 'Latest News',
    excerpt:
      'Browser gaming is experiencing unprecedented growth with technological advances making web-based games rival desktop experiences.',
    content: `Browser gaming has undergone a remarkable transformation over the past few years. What was once considered a niche category of simple flash games has evolved into a sophisticated platform capable of delivering rich, complex gaming experiences.

The technological advancements in web standards have been instrumental in this evolution. Modern browsers now support WebGL, WebAssembly, and other cutting-edge technologies that enable developers to create games with stunning graphics and smooth performance. These innovations have democratized game development, allowing independent developers to reach global audiences without the barriers of distribution platforms.

2025 marks a pivotal moment for browser gaming as we witness mainstream recognition and adoption. Major gaming studios are investing in browser-based titles, recognizing the potential for instant accessibility without downloads or installations. Players appreciate the convenience of jumping into a game immediately, whether on desktop or mobile devices.

The economic model for browser games has also matured significantly. From simple ad-supported models to premium experiences with battle passes and cosmetics, browser games now compete directly with native applications. The lower barrier to entry attracts diverse audiences, from casual players to competitive gamers seeking quick sessions during breaks.

Looking ahead, browser gaming will continue to dominate as emerging technologies like cloud gaming and progressive web apps further enhance the platform's capabilities. The industry is poised for continued explosive growth.`,
    author: {
      name: 'Alex Chen',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      bio: 'Gaming analyst and digital culture expert with 10+ years experience',
    },
    publishDate: '2025-11-01',
    featuredImage:
      'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=400&fit=crop',
    tags: ['browser-gaming', 'web-development', 'gaming-trends', '2025'],
  },
  {
    id: 2,
    title: 'Interview: Mystic Puzzle Quest Creators',
    slug: 'interview-mystic-puzzle-quest-creators',
    category: 'Interviews',
    excerpt:
      'We sat down with the creative team behind the hit puzzle game to discuss their development process and vision for the future.',
    content: `In this exclusive interview, we speak with the talented developers behind Mystic Puzzle Quest, one of 2025's breakout browser gaming successes.

"When we started development, our goal was to create a puzzle game that felt fresh yet respectful of classic puzzle game traditions," explains lead designer Maria Rodriguez. "We wanted to combine the satisfying match-3 mechanics with deeper strategic elements."

The team faced numerous challenges during development, particularly in balancing gameplay difficulty across different skill levels. "It was crucial that both casual players and hardcore puzzle enthusiasts felt challenged and rewarded," says programming lead James Park. "We implemented an adaptive difficulty system that learns from player behavior."

The visual design of Mystic Puzzle Quest stands out in the browser gaming landscape. Lead artist Sofia Petrov shares her approach: "We embraced a magical aesthetic that differentiates us from competitors. Every visual element tells a story about the mystical world players are exploring."

When asked about their proudest achievement, the team unanimously points to the community they've built. "The player community is incredibly engaged and supportive," Maria notes. "They provide invaluable feedback that helps us continuously improve the game."

Looking forward, the developers have ambitious plans. "We're exploring multiplayer features and seasonal events that will keep the game fresh," James reveals. "Browser gaming has proven it can support live service models effectively."

The team's dedication and passion shine through in every aspect of Mystic Puzzle Quest, making it a standout title in the browser gaming renaissance.`,
    author: {
      name: 'Jessica Thompson',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      bio: 'Senior games journalist covering indie developers and gaming trends',
    },
    publishDate: '2025-10-28',
    featuredImage:
      'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800&h=400&fit=crop',
    tags: ['interview', 'game-development', 'mystic-puzzle-quest'],
  },
  {
    id: 3,
    title: 'Review: Space Invaders Redux',
    slug: 'review-space-invaders-redux',
    category: 'Reviews',
    excerpt:
      'We test-drive the modern reimagining of the arcade classic and share our verdict on this nostalgic throwback.',
    content: `Space Invaders Redux arrives as a love letter to arcade gaming while successfully adapting the formula for modern audiences. After spending considerable time with the game, we can confidently say this is a must-play for both nostalgic veterans and newcomers.

The core gameplay remains faithful to the original: defend your position against waves of descending enemies. However, developer Retro Games Studio has thoughtfully enhanced the experience with quality-of-life improvements that feel natural rather than intrusive.

Visually, Space Invaders Redux impresses with its pixel-art aesthetic that honors the original while benefiting from modern rendering techniques. The animations are smooth, the colors pop, and the overall presentation strikes an excellent balance between retro charm and contemporary polish.

The sound design deserves special mention. The iconic theme returns but sounds crisper than ever, while new effects enhance the visceral feeling of combat. Audio cues provide crucial gameplay feedback without feeling overwhelming.

Difficulty scaling is particularly well-implemented. Beginners can enjoy the game with assistance features, while hardcore players will find punishing challenges in harder modes. This accessibility is commendable and ensures the game appeals to a wide audience.

Multiplayer functionality adds replayability. Local and online competition modes transform the experience from a solo challenge into social entertainment. Competing with friends for high scores revitalizes the game despite its simple premise.

After extensive testing, Space Invaders Redux earns our strong recommendation. It's a respectful homage to gaming history that works excellently as modern entertainment. The $9.99 price point represents exceptional value for the content and polish delivered.

Final Score: 8.5/10 - A stellar arcade revival that nails the fundamentals while enhancing them thoughtfully.`,
    author: {
      name: 'David Martinez',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      bio: 'Veteran game reviewer with focus on indie and retro games',
    },
    publishDate: '2025-10-25',
    featuredImage:
      'https://images.unsplash.com/photo-1579762715459-5a068c289fda?w=800&h=400&fit=crop',
    tags: ['review', 'arcade', 'space-invaders', 'retro-gaming'],
  },
  {
    id: 4,
    title: 'Psychology of Addictive Game Design',
    slug: 'psychology-addictive-game-design',
    category: 'Industry Analysis',
    excerpt:
      'We explore the psychological principles behind engaging game design and their ethical implications.',
    content: `Addictive game design is both an art and a science, leveraging psychological principles to create compelling experiences. Understanding these mechanisms helps us appreciate why certain games captivate millions while also raising important ethical questions.

The concept of variable rewards sits at the heart of addictive game design. Inspired by B.F. Skinner's experiments with pigeons, game designers use unpredictable reward schedules to maintain engagement. When players can't predict when they'll receive rewards, they develop stronger compulsion to continue playing.

Flow state, a concept developed by Mihaly Csikszentmihalyi, plays a crucial role in engagement. Games that maintain optimal difficulty—challenging enough to be engaging but not so hard as to cause frustration—keep players in this state. Achieving flow is the holy grail of game design.

Progression systems tap into our intrinsic motivation for achievement. Whether it's unlocking new levels, earning badges, or improving skill ratings, progression systems provide clear goals that drive continued engagement. Browser games have perfected this by allowing for bite-sized progression sessions.

Social dynamics compound engagement. Multiplayer features, leaderboards, and community interactions create social investment in games. Players develop commitments to their friends and communities that extend engagement beyond the game itself.

However, these psychological techniques raise ethical considerations. Some argue that exploiting psychological vulnerabilities crosses ethical lines, particularly when targeting vulnerable populations like children or those with addictive tendencies.

Responsible game design acknowledges these concerns by implementing features like play session limits, transparent progression mechanics, and honest monetization. The industry is increasingly recognizing that sustainable engagement comes from respecting player well-being.

As browser gaming continues its growth, the conversation around ethical design becomes increasingly important. The most successful games of the future will likely be those that balance engagement with responsibility.`,
    author: {
      name: 'Prof. Rachel Kim',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      bio: 'Psychology researcher specializing in behavioral design and gaming',
    },
    publishDate: '2025-11-03',
    featuredImage:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop',
    tags: ['psychology', 'game-design', 'ethics', 'engagement'],
  },
];

export default ARTICLES_DATA;
