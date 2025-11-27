import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    // Fallback for safety, though this should not happen with correct data.
    return {
      id: 'fallback',
      description: 'A fallback image',
      imageUrl: 'https://picsum.photos/seed/fallback/600/400',
      imageHint: 'abstract',
    };
  }
  return image;
};

export type Media = {
  id: string;
  title: string;
  description: string;
  image: ImagePlaceholder;
  year: number;
  genres: string[];
  type: 'SUB' | 'DUB' | 'RAW';
  episodes: number;
  status: 'Airing' | 'Finished' | 'Upcoming';
  studio: string;
  rating: number;
  views: number;
  updatedAt: Date;
};

export const mediaItems: Media[] = [
  {
    id: 'cyber-odyssey',
    title: 'Cyber Odyssey',
    description: 'In a dystopian future, a group of rebels fight against a tyrannical AI.',
    image: getImage('media-1'),
    year: 2024,
    genres: ['Sci-Fi', 'Action', 'Cyberpunk'],
    type: 'DUB',
    episodes: 12,
    status: 'Airing',
    studio: 'Studio Nova',
    rating: 8.9,
    views: 1500000,
    updatedAt: new Date('2024-07-20T10:00:00Z'),
  },
  {
    id: 'arcane-chronicles',
    title: 'Arcane Chronicles',
    description: 'A young mage uncovers ancient secrets that could change the world.',
    image: getImage('media-2'),
    year: 2023,
    genres: ['Fantasy', 'Magic', 'Adventure'],
    type: 'SUB',
    episodes: 24,
    status: 'Finished',
    studio: 'Mystic Forge',
    rating: 9.5,
    views: 3200000,
    updatedAt: new Date('2023-12-15T10:00:00Z'),
  },
  {
    id: 'blade-of-the-ronin',
    title: 'Blade of the Ronin',
    description: 'A masterless samurai seeks redemption in a land torn by war.',
    image: getImage('media-3'),
    year: 2024,
    genres: ['Action', 'Samurai', 'Historical'],
    type: 'SUB',
    episodes: 13,
    status: 'Airing',
    studio: 'Kensei Pictures',
    rating: 9.2,
    views: 2100000,
    updatedAt: new Date('2024-07-18T10:00:00Z'),
  },
  {
    id: 'case-closed-files',
    title: 'Case Closed Files',
    description: 'A brilliant high school detective solves impossible crimes.',
    image: getImage('media-4'),
    year: 2022,
    genres: ['Mystery', 'Detective', 'Thriller'],
    type: 'DUB',
    episodes: 50,
    status: 'Finished',
    studio: 'Logic Works',
    rating: 8.5,
    views: 1800000,
    updatedAt: new Date('2022-09-01T10:00:00Z'),
  },
  {
    id: 'mech-friends',
    title: 'Mech & Friends',
    description: 'A cheerful robot and its human companion go on adventures.',
    image: getImage('media-5'),
    year: 2025,
    genres: ['Sci-Fi', 'Slice of Life', 'Mecha'],
    type: 'RAW',
    episodes: 1,
    status: 'Upcoming',
    studio: 'Gearhead Animations',
    rating: 0,
    views: 50000,
    updatedAt: new Date('2025-01-01T10:00:00Z'),
  },
  {
    id: 'kaiju-rampage',
    title: 'Kaiju Rampage',
    description: 'Humanity\'s last hope against giant monsters is a new generation of pilots.',
    image: getImage('media-6'),
    year: 2024,
    genres: ['Action', 'Mecha', 'Sci-Fi'],
    type: 'SUB',
    episodes: 8,
    status: 'Airing',
    studio: 'Titan Studios',
    rating: 8.7,
    views: 1900000,
    updatedAt: new Date('2024-07-21T10:00:00Z'),
  },
  {
    id: 'star-drifter',
    title: 'Star Drifter',
    description: 'An explorer charts unknown galaxies, encountering strange new worlds and civilizations.',
    image: getImage('media-7'),
    year: 2021,
    genres: ['Sci-Fi', 'Adventure', 'Space Opera'],
    type: 'DUB',
    episodes: 26,
    status: 'Finished',
    studio: 'Galaxy Films',
    rating: 9.1,
    views: 2500000,
    updatedAt: new Date('2021-06-30T10:00:00Z'),
  },
  {
    id: 'the-valiant-knight',
    title: 'The Valiant Knight',
    description: 'A noble knight protects his kingdom from dragons and dark sorcerers.',
    image: getImage('media-8'),
    year: 2023,
    genres: ['Fantasy', 'Action', 'Medieval'],
    type: 'SUB',
    episodes: 12,
    status: 'Finished',
    studio: 'Silver Shield',
    rating: 8.4,
    views: 1200000,
    updatedAt: new Date('2023-03-25T10:00:00Z'),
  },
   {
    id: 'shadow-assassin',
    title: 'Shadow Assassin',
    description: 'A ninja clan operates in the shadows to maintain balance in a feudal world.',
    image: getImage('media-9'),
    year: 2024,
    genres: ['Action', 'Ninja', 'Stealth'],
    type: 'SUB',
    episodes: 9,
    status: 'Airing',
    studio: 'Shinobi Arts',
    rating: 9.0,
    views: 1750000,
    updatedAt: new Date('2024-07-22T10:00:00Z'),
  },
  {
    id: 'ocean-emperor',
    title: 'Ocean Emperor',
    description: 'A charismatic pirate captain searches for the legendary treasure that will make him king of the seas.',
    image: getImage('media-10'),
    year: 2020,
    genres: ['Adventure', 'Pirates', 'Fantasy'],
    type: 'DUB',
    episodes: 100,
    status: 'Finished',
    studio: 'Blue Horizon',
    rating: 9.8,
    views: 5400000,
    updatedAt: new Date('2020-12-31T10:00:00Z'),
  },
];


export const heroItems = [
    {
        id: 'arcane-chronicles-hero',
        title: 'Arcane Chronicles',
        description: 'A young mage uncovers ancient secrets that could change the world. A new season is now airing!',
        image: getImage('hero-2'),
        link: '/watch/arcane-chronicles'
    },
    {
        id: 'cyber-odyssey-hero',
        title: 'Cyber Odyssey',
        description: 'In a dystopian future, a group of rebels fight against a tyrannical AI.',
        image: getImage('hero-1'),
        link: '/watch/cyber-odyssey'
    },
    {
        id: 'blade-of-the-ronin-hero',
        title: 'Blade of the Ronin',
        description: 'A masterless samurai seeks redemption in a land torn by war. New episodes weekly.',
        image: getImage('hero-3'),
        link: '/watch/blade-of-the-ronin'
    },
    {
        id: 'star-drifter-hero',
        title: 'Star Drifter',
        description: 'Explore unknown galaxies with the bravest crew in the cosmos. All seasons available now.',
        image: getImage('hero-4'),
        link: '/watch/star-drifter'
    },
    {
        id: 'kaiju-rampage-hero',
        title: 'Kaiju Rampage',
        description: 'Giant monsters are attacking! Can humanity fight back? The epic finale is here.',
        image: getImage('hero-5'),
        link: '/watch/kaiju-rampage'
    }
]

export const episodes = Array.from({ length: 24 }, (_, i) => ({
  id: `ep-${i + 1}`,
  title: `Episode ${i + 1}`,
  description: `This is the description for episode ${i + 1}.`,
  thumbnail: `https://picsum.photos/seed/ep${i + 1}/320/180`,
  duration: `${Math.floor(Math.random() * 5) + 20}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
}));

export const comments = [
    {
        id: 'comment-1',
        author: 'AnimeFan123',
        avatar: 'https://i.pravatar.cc/150?u=animefan123',
        timestamp: '2 hours ago',
        text: 'This episode was absolutely insane! The animation quality is top-tier.',
    },
    {
        id: 'comment-2',
        author: 'SakuraChan',
        avatar: 'https://i.pravatar.cc/150?u=sakurachan',
        timestamp: '1 hour ago',
        text: 'I can\'t believe what just happened! My jaw is on the floor. Anyone have theories for the next episode?',
    },
    {
        id: 'comment-3',
        author: 'GamerGod99',
        avatar: 'https://i.pravatar.cc/150?u=gamergod99',
        timestamp: '45 minutes ago',
        text: 'The fight scene at 15:30 was choreographed perfectly. Studio Nova is killing it this season.',
    },
    {
        id: 'comment-4',
        author: 'WeebWizard',
        avatar: 'https://i.pravatar.cc/150?u=weebwizard',
        timestamp: '15 minutes ago',
        text: 'Is anyone else getting major vibes from their older series? Love the easter eggs!',
    }
];

export const genres = [
  'Action', 'Adventure', 'Comedy', 'Cyberpunk', 'Detective', 'Drama', 'Fantasy', 'Historical', 
  'Magic', 'Mecha', 'Mystery', 'Ninja', 'Pirates', 'Romance', 'Samurai', 'Sci-Fi', 
  'Slice of Life', 'Space Opera', 'Sports', 'Supernatural', 'Thriller'
];

export const years = Array.from({ length: 15 }, (_, i) => String(new Date().getFullYear() - i));

export const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];

export const types = ['SUB', 'DUB', 'RAW'];

export const statuses = ['Airing', 'Finished', 'Upcoming'];

export const studios = [
  'Studio Nova', 'Mystic Forge', 'Kensei Pictures', 'Logic Works', 
  'Gearhead Animations', 'Titan Studios', 'Galaxy Films', 'Silver Shield', 
  'Shinobi Arts', 'Blue Horizon'
];

export const sortOptions = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'latest', label: 'Latest' },
];
