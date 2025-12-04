
'use client';
import { useState, useEffect }from 'react';
import { AdminLayout } from "@/components/admin/AdminLayout";
import PermissionGuard from "@/components/admin/PermissionGuard";
import { RolePermissions, Permission } from '@/lib/permissions';
import { useFirestore } from '@/firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type RolesData = {
    [key: string]: {
        permissions: Permission[];
        priority: number;
    }
}

const permissionGroups: { category: string, permissions: Permission[] }[] = [
    { category: 'Users', permissions: ['view_users', 'edit_users', 'ban_users', 'delete_users'] },
    { category: 'Content', permissions: ['add_anime', 'edit_anime', 'delete_anime', 'manage_episodes'] },
    { category: 'Moderation', permissions: ['moderate_comments', 'handle_reports', 'create_announcements'] },
    { category: 'Security', permissions: ['manage_sessions', 'edit_permissions', 'view_audit_log'] },
    { category: 'System', permissions: ['edit_site_settings', 'manage_staff', 'view_analytics'] },
    { category: 'God Mode', permissions: ['all'] },
];

const allPermissions = permissionGroups.flatMap(g => g.permissions);


export default function PermissionManagerPage() {
    return (
        <PermissionGuard permission="edit_permissions">
            <PermissionManager />
        </PermissionGuard>
    )
}

function PermissionManager() {
  const firestore = useFirestore();
  const [roles, setRoles] = useState<RolesData>({});
  const [selectedRole, setSelectedRole] = useState<string>('admin');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!firestore) return;
    setIsLoading(true);
    const rolesRef = collection(firestore, 'roles');
    const unsub = onSnapshot(rolesRef, (snapshot) => {
        const rolesData: RolesData = {};
        snapshot.forEach(doc => {
            rolesData[doc.id] = doc.data() as RolesData[string];
        });
        setRoles(rolesData);
        setIsLoading(false);
    });

    return () => unsub();
  }, [firestore]);

  const handlePermissionChange = (role: string, permission: Permission) => {
    setRoles(prevRoles => {
        const newRoles = JSON.parse(JSON.stringify(prevRoles));
        const currentPermissions = newRoles[role]?.permissions || [];
        if(currentPermissions.includes(permission)) {
            newRoles[role].permissions = currentPermissions.filter((p: Permission) => p !== permission);
        } else {
            newRoles[role].permissions.push(permission);
        }
        return newRoles;
    });
  }

  const handleSave = async () => {
    if (!firestore) return;
    setIsSaving(true);
    const toastId = toast.loading('Saving permissions...');
    try {
        const batch = Object.entries(roles).map(([roleId, data]) => {
            const roleRef = doc(firestore, 'roles', roleId);
            return setDoc(roleRef, data);
        });
        await Promise.all(batch);
        toast.success('Permissions saved successfully!', { id: toastId });
    } catch (error) {
        console.error("Error saving permissions:", error);
        toast.error('Failed to save permissions.', { id: toastId });
    } finally {
        setIsSaving(false);
    }
  }
  
  const roleNames = Object.keys(roles).sort((a,b) => (roles[a].priority || 99) - (roles[b].priority || 99));

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                 <h1 className="text-2xl font-bold font-display">Permissions Matrix</h1>
                 <p className="text-muted-foreground">Manage roles and their capabilities across the site.</p>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
                Save Changes
            </Button>
        </div>

        {isLoading ? (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        ) : (
             <Card>
                <CardContent className="p-0">
                    <div className="flex divide-x divide-border">
                        <div className="w-48 p-4">
                            <h3 className="font-bold mb-4">Roles</h3>
                            <div className="flex flex-col gap-1">
                                {roleNames.map(role => (
                                    <button 
                                        key={role}
                                        onClick={() => setSelectedRole(role)}
                                        className={cn("text-left capitalize px-3 py-2 rounded-md text-sm font-medium transition-colors", selectedRole === role ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1">
                             <ScrollArea className="h-[70vh]">
                                <div className="p-6 space-y-6">
                                    {permissionGroups.map(group => (
                                        <div key={group.category}>
                                            <h4 className="font-bold mb-3 capitalize">{group.category}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {group.permissions.map(permission => (
                                                    <div key={permission} className="flex items-center space-x-2 p-2 rounded-md bg-muted/50">
                                                        <Checkbox
                                                            id={`${selectedRole}-${permission}`}
                                                            checked={roles[selectedRole]?.permissions.includes(permission) || roles[selectedRole]?.permissions.includes('all')}
                                                            disabled={roles[selectedRole]?.permissions.includes('all') && permission !== 'all'}
                                                            onCheckedChange={() => handlePermissionChange(selectedRole, permission)}
                                                        />
                                                        <label
                                                            htmlFor={`${selectedRole}-${permission}`}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {permission.replace(/_/g, ' ')}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}

    </div>
  );
}
