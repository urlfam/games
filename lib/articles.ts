export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  publishDate: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
}

export const ARTICLES_DATA: Article[] = [
  {
    id: '1',
    slug: 'accueillir-le-nouvel-an-avec-puzzio',
    title: 'Accueillir le Nouvel An avec Puzzio : Nouveaux Jeux, Nouveaux Défis !',
    excerpt: 'Découvrez ce qui attend la communauté Puzzio en 2026. Une année riche en puzzles, en compétitions et en surprises.',
    content: `
      <h2>Une Année 2026 Prometteuse pour les Amateurs de Puzzles</h2>
      <p>L'année 2026 s'annonce passionnante pour toute l'équipe de Puzzio et ses joueurs. Nous avons travaillé sans relâche pour vous proposer une expérience de jeu encore plus immersive et divertissante.</p>
      
      <h3>De Nouveaux Jeux Chaque Semaine</h3>
      <p>Notre engagement reste le même : vous offrir les meilleurs jeux de puzzle gratuits, accessibles directement depuis votre navigateur. Attendez-vous à voir arriver des titres innovants, mêlant logique pure et graphismes soignés.</p>
      
      <h3>Des Tournois Communautaires</h3>
      <p>Cette année, nous mettrons l'accent sur la compétition amicale. Préparez-vous à défier vos amis et à grimper dans les classements mondiaux grâce à nos nouveaux systèmes de tournois.</p>

      <p>Restez connectés, et bon jeu à tous sur Puzzio !</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070',
    category: 'Annonces',
    tags: ['Puzzio', '2026', 'Nouveautés', 'Communauté'],
    publishDate: '2026-01-01T10:00:00Z',
    author: {
      name: 'L\'Équipe Puzzio',
      bio: 'L\'équipe officielle de développement et d\'animation de Puzzio.',
      avatar: 'https://github.com/shadcn.png',
    },
  },
  {
    id: '2',
    slug: 'top-10-jeux-logique-2025',
    title: 'Top 10 des Meilleurs Jeux de Logique de 2025',
    excerpt: 'Retour sur les jeux qui ont marqué l\'année passée. Avez-vous réussi à tous les terminer ?',
    content: `
      <h2>Le Meilleur du Puzzle en 2025</h2>
      <p>2025 a été une année charnière pour le genre du puzzle game. Des mécaniques innovantes aux directions artistiques audacieuses, voici notre sélection des jeux incontournables.</p>
      
      <p>Si vous les avez manqués, il n'est pas trop tard pour vous y mettre !</p>
      
      <ul>
        <li><strong>1. Quantum Shift :</strong> Une aventure quantique où chaque mouvement compte.</li>
        <li><strong>2. Block Masters :</strong> Le classique revisité avec une touche moderne.</li>
        <li><strong>3. Logic City :</strong> Construisez votre ville en résolvant des énigmes d'urbanisme.</li>
        // ... (suite de l'article)
      </ul>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1614036634955-457914d104dd?auto=format&fit=crop&q=80&w=2070',
    category: 'Rétrospective',
    tags: ['Top 10', '2025', 'Logique', 'Sélection'],
    publishDate: '2025-12-28T14:30:00Z',
    author: {
      name: 'Alex Gamer',
      bio: 'Passionné de jeux indépendants et de casse-têtes complexes.',
      avatar: 'https://github.com/shadcn.png',
    },
  },
  {
    id: '3',
    slug: 'impact-puzzles-cerveau',
    title: 'Pourquoi les Puzzles sont Bons pour votre Cerveau',
    excerpt: 'Des études scientifiques confirment les bienfaits des jeux de logique sur la plasticité cérébrale et la mémoire.',
    content: `
      <h2>Gymnastique Cérébrale : Plus qu'un Jeu</h2>
      <p>On dit souvent que le cerveau est comme un muscle : il faut l'entraîner. Les jeux de puzzle sont parfaits pour cela.</p>
      
      <h3>Amélioration de la Mémoire</h3>
      <p>Jouer régulièrement à des jeux comme le Sudoku ou des jeux de paires sollicite la mémoire à court terme, renforçant ainsi les connexions neuronales.</p>
      
      <h3>Réduction du Stress</h3>
      <p>La concentration requise pour résoudre un puzzle permet de se détacher des soucis quotidiens, offrant un véritable moment de méditation active.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=2070',
    category: 'Santé & Bien-être',
    tags: ['Cerveau', 'Science', 'Santé', 'Mémoire'],
    publishDate: '2025-11-15T09:15:00Z',
    author: {
      name: 'Dr. Sarah Logic',
      bio: 'Neuropsychologue et amatrice de jeux vidéo cognitifs.',
      avatar: 'https://github.com/shadcn.png',
    },
  },
];
