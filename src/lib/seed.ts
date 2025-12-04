// src/lib/seed.ts
import { initializeFirebase } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// This is a server-side script to seed the database.
// To run it, you would typically use a command like: `npm run seed`

async function seedDatabase() {
  console.log('Initializing admin Firebase...');
  const { firestore } = initializeFirebase();
  console.log('Firestore initialized.');

  try {
    console.log('Seeding superadmin role...');

    // =================================================================
    // UID for surajrai1204@gmail.com has been set.
    // =================================================================
    const adminUID = 'tuQCbp5nLIP8ZSEbsSAICAByLF42';

    if (adminUID === 'REPLACE_WITH_YOUR_FIREBASE_UID') {
      console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.error('!!! ERROR: Please replace the placeholder UID in src/lib/seed.ts !!!');
      console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      process.exit(1);
    }


    const adminRolesRef = collection(firestore, 'adminRoles');
    const adminUserDocRef = doc(adminRolesRef, adminUID);

    const adminData = {
      role: 'superadmin',
      name: 'Suraj Rai',
      createdAt: serverTimestamp(),
    };

    await setDoc(adminUserDocRef, adminData, { merge: true });
    
    console.log(`✅ Successfully granted 'superadmin' role to UID: ${adminUID}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  console.log('Database seeding complete!');
  process.exit(0);
}

seedDatabase();
