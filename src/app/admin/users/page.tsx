
'use client';
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import PermissionGuard from "@/components/admin/PermissionGuard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  
  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const banUser = async (userId: string) => {
    await updateDoc(doc(db, "users", userId), { banned: true });
    toast.success("User has been banned.");
  };

  const deleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to permanently delete this user?")) {
      await deleteDoc(doc(db, "users", userId));
      toast.success("User deleted.");
    }
  };

  return (
    <PermissionGuard permission="manage_users">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-display">User Management</h1>
        
        <div className="bg-card rounded-lg border border-border p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.photoURL} />
                        <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.displayName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{user.role || 'user'}</Badge></TableCell>
                   <TableCell>
                    <Badge variant={user.banned ? 'destructive' : 'default'}>{user.banned ? 'Banned' : 'Active'}</Badge>
                  </TableCell>
                  <TableCell>{user.createdAt?.toDate().toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <PermissionGuard permission="ban_users">
                          <DropdownMenuItem onClick={() => banUser(user.id)} className="text-destructive">
                            Ban User
                          </DropdownMenuItem>
                        </PermissionGuard>
                        <PermissionGuard permission="delete_users">
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => deleteUser(user.id)} className="text-destructive">
                            Delete User
                          </DropdownMenuItem>
                        </PermissionGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </PermissionGuard>
  );
}
