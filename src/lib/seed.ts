
// src/lib/seed.ts
import 'dotenv/config';
import { adminAuth, adminDb } from './firebaseAdmin';

const ADMIN_EMAIL = 'admin@projectx.com';

async function grantAdminRole() {
  console.log(`Attempting to grant admin role to: ${ADMIN_EMAIL}`);

  try {
    // 1. Get the user by email from Firebase Auth
    const user = await adminAuth.getUserByEmail(ADMIN_EMAIL);
    
    // 2. Set custom claim for role-based access control
    await adminAuth.setCustomUserClaims(user.uid, { role: 'admin' });
    
    // 3. Update the user's document in Firestore
    const userRef = adminDb.collection('users').doc(user.uid);
    await userRef.update({ role: 'admin' });

    console.log(`✅ Success! ${ADMIN_EMAIL} has been granted admin privileges.`);
    console.log("Please log out and log back in for the changes to take effect.");

  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ Error: User with email ${ADMIN_EMAIL} not found.`);
      console.error("Please sign up with this email address in the application first.");
    } else {
      console.error('❌ An unexpected error occurred:');
      console.error(error);
    }
  }
}

grantAdminRole();
