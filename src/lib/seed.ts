
// src/lib/seed.ts
import { initializeAdminFirebase } from '@/firebase/server-admin';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// This is a server-side script to seed the database.
// To run it, you would typically use a command like: `npx tsx src/lib/seed.ts`

async function seedDatabase() {
  console.log('Initializing admin Firebase...');
  const { firestore } = initializeAdminFirebase();
  console.log('Firestore initialized.');

  try {
    console.log('Seeding comments for One Piece...');

    // Path: /comments/one-piece-100/general/messages/{messageId}
    const messagesRef = collection(firestore, 'comments', 'one-piece-100', 'general');

    const sampleMessage = {
      animeId: 'one-piece-100',
      episodeId: null,
      userId: 'system-seed',
      username: 'Captain Gol D. Roger',
      userAvatar: 'https://i.pravatar.cc/150?u=goldroger',
      text: 'Wealth, fame, power... I found everything this world has to offer. My treasure? It\'s yours if you can find it... I left it all in one piece!',
      parentId: null,
      spoiler: false,
      likes: [],
      timestamp: serverTimestamp(),
      rank: 'Pirate King',
    };

    // We'll set a document with a specific ID to make it easy to find and prevent duplicates on re-runs.
    const messageDocRef = doc(messagesRef, 'initial-message');
    await setDoc(messageDocRef, sampleMessage);
    
    console.log('✅ Successfully seeded one comment for One Piece.');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  console.log('Database seeding complete!');
  process.exit(0);
}

seedDatabase();
