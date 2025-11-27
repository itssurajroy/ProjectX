
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
