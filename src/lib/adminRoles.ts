// src/lib/adminRoles.ts
import { firestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { RolePermissions, Permission } from "./permissions";

export type AdminRole = "superadmin" | "admin" | "moderator" | "viewer" | null;

export async function getUserRole(uid: string): Promise<AdminRole> {
  try {
    const docSnap = await getDoc(doc(firestore, "adminRoles", uid));
    if (docSnap.exists()) {
      return docSnap.data().role as AdminRole;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getUserPermissions(uid: string): Promise<Permission[]> {
  try {
    const docSnap = await getDoc(doc(firestore, "adminRoles", uid));
    if (!docSnap.exists()) return [];

    const data = docSnap.data();
    
    // Custom permissions override role template
    if (data.customPermissions && Array.isArray(data.customPermissions)) {
      return data.customPermissions as Permission[];
    }

    // Fallback to role template
    const role = data.role as string;
    return RolePermissions[role] || [];
  } catch {
    return [];
  }
}

export async function hasPermission(uid: string, permission: Permission): Promise<boolean> {
  const perms = await getUserPermissions(uid);
  
  if (perms.includes("all")) return true;
  if (perms.includes(permission)) return true;
  
  return false;
}


export function checkPermission(role: AdminRole | null, required: AdminRole): boolean {
  if (!role) return false;
  const hierarchy = ["viewer", "moderator", "admin", "superadmin"];
  return hierarchy.indexOf(role) >= hierarchy.indexOf(required);
}
