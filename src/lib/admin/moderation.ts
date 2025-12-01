
'use server';
import { doc, deleteDoc, updateDoc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { handleAdminError, AdminError } from './utils';
import { initializeAdminFirebase } from '@/firebase/server-admin';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

const { firestore } = initializeAdminFirebase();

// This is a placeholder. In a real app, you'd get this from your auth state.
const mockAuth = { currentUser: { uid: 'admin-user-placeholder' } };

/**
 * Deletes a comment from Firestore.
 * @param commentPath - The full path to the comment document.
 */
export async function deleteComment(commentPath: string) {
  if (!commentPath) {
    throw new AdminError('Comment path is required.');
  }

  const commentRef = doc(firestore, commentPath);
  deleteDoc(commentRef)
    .then(() => {
      toast.success('Comment deleted.');
    })
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: commentRef.path,
            operation: 'delete',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
    });
}

/**
 * Resolves a content report.
 * This moves the report from 'active' to a 'resolved' subcollection.
 * @param reportId - The ID of the report in the 'active' collection.
 * @param resolution - A description of how the report was resolved.
 */
export async function resolveReport(reportId: string, resolution: string) {
  if (!reportId || !resolution) {
    throw new AdminError('Report ID and resolution notes are required.');
  }

  const reportRef = doc(firestore, 'admin', 'reports', 'active', reportId);
  const reportSnap = await getDoc(reportRef);

  if (!reportSnap.exists()) {
    throw new AdminError('Report not found.');
  }

  const reportData = reportSnap.data();
  const payload = {
    ...reportData,
    status: 'Resolved',
    resolvedAt: serverTimestamp(),
    resolvedBy: mockAuth.currentUser.uid,
    resolutionNotes: resolution,
  };

  // Create a new document in the 'resolved' collection
  const resolvedRef = doc(firestore, 'admin', 'reports', 'resolved', reportId);
  
  setDoc(resolvedRef, payload)
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: resolvedRef.path,
            operation: 'create',
            requestResourceData: payload,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
    });

  // Delete the original report from 'active'
  deleteDoc(reportRef)
      .catch((serverError) => {
          const permissionError = new FirestorePermissionError({
              path: reportRef.path,
              operation: 'delete',
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
      });

  toast.success('Report has been resolved.');
}
