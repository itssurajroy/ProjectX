'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

/**
 * A client-side component that listens for globally emitted 'permission-error' events.
 * When an event is caught, it throws the error. In a Next.js development environment,
 * this will display a detailed error overlay, making it much easier to debug
 * Firestore Security Rule violations. This component should be placed high
 * in the component tree, such as within your main layout or a global provider.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: Error) => {
      // Throwing the error here will cause it to be caught by Next.js's
      // development error overlay, which is exactly what we want for debugging.
      throw error;
    };

    errorEmitter.on('permission-error', handleError);

    // Clean up the listener when the component unmounts.
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // This component does not render anything to the DOM.
  return null;
}
