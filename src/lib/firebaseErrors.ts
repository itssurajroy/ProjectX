
export const firebaseErrorMessages: Record<string, string> = {
  // Email/Password
  "auth/invalid-email": "Invalid email address.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/email-already-in-use": "This email is already registered.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/requires-recent-login": "Please re-login to perform this action.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/account-exists-with-different-credential": "An account already exists with this email.",

  // Google / OAuth
  "auth/popup-closed-by-user": "Login popup was closed. Please try again.",
  "auth/popup-blocked": "Popup blocked. Allow popups for this site.",
  "auth/operation-not-allowed": "This sign-in method is disabled.",
  "auth/cancelled-popup-request": "Login cancelled.",

  // Network & General
  "auth/network-request-failed": "No internet connection.",
  "auth/internal-error": "Something went wrong. Try again.",
  "auth/invalid-credential": "Invalid login credentials.",

  // Default fallback
  "default": "An unexpected error occurred. Please try again."
};

export function getFirebaseErrorMessage(code: string): string {
  return firebaseErrorMessages[code] || firebaseErrorMessages["default"];
}
