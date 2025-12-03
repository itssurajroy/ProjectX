
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
    console.log('Seeding admin role...');

    const adminUID = 'tuQCbp5nLIP8ZSEbsSAICAByLF42';
    const adminRolesRef = collection(firestore, 'adminRoles');
    const adminUserDocRef = doc(adminRolesRef, adminUID);

    const adminData = {
      role: 'admin',
      name: 'Admin User',
      createdAt: serverTimestamp(),
    };

    await setDoc(adminUserDocRef, adminData, { merge: true });
    
    console.log(`✅ Successfully granted 'admin' role to UID: ${adminUID}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  console.log('Database seeding complete!');
  process.exit(0);
}

seedDatabase();
