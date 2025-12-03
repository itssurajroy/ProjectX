// src/lib/adminRoles.ts
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "firebase/auth";

export type AdminRole = "superadmin" | "admin" | "moderator" | "viewer" | null;

export async function getUserRole(uid: string): Promise<AdminRole> {
  try {
    const docSnap = await getDoc(doc(db, "adminRoles", uid));
    if (docSnap.exists()) {
      return docSnap.data().role as AdminRole;
    }
    return null;
  } catch {
    return null;
  }
}

export function checkPermission(role: AdminRole | null, required: AdminRole): boolean {
  if (!role) return false;
  const hierarchy = ["viewer", "moderator", "admin", "superadmin"];
  return hierarchy.indexOf(role) >= hierarchy.indexOf(required);
}
