
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

interface AdminFirebaseSdks {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
}

// IMPORTANT: This is a server-only function.
// It initializes the Firebase app using the provided config, ensuring it's a singleton on the server.
export function initializeAdminFirebase(): AdminFirebaseSdks {
  if (getApps().some(app => app.name === 'admin-app')) {
    const adminApp = getApp('admin-app');
    return {
      firebaseApp: adminApp,
      firestore: getFirestore(adminApp),
    };
  }

  const adminApp = initializeApp(firebaseConfig, 'admin-app');

  return {
    firebaseApp: adminApp,
    firestore: getFirestore(adminApp),
  };
}
