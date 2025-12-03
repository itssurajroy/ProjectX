
// src/lib/seed.ts
import { initializeAdminFirebase } from '@/firebase/server-admin';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// This is a server-side script to seed the database.
// To run it, you would typically use a command like: `npm run seed`

async function seedDatabase() {
  console.log('Initializing admin Firebase...');
  const { firestore } = initializeAdminFirebase();
  console.log('Firestore initialized.');

  try {
    console.log('Seeding admin role...');

    // =================================================================
    // IMPORTANT: REPLACE THIS UID WITH THE FIREBASE UID OF YOUR ADMIN
    // =================================================================
    // You can find the UID in the Firebase Console under:
    // Authentication > Users > User UID column
    const adminUID = 'REPLACE_WITH_YOUR_FIREBASE_UID';

    if (adminUID === 'REPLACE_WITH_YOUR_FIREBASE_UID') {
      console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.error('!!! ERROR: Please replace the placeholder UID in src/lib/seed.ts !!!');
      console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      process.exit(1);
    }


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
