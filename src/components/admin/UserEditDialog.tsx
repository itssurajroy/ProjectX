
'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirestore, updateDocumentNonBlocking } from "@/firebase";
import { UserProfile } from "@/lib/types/user";
import { doc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserEditDialogProps {
    user: UserProfile & { id: string };
    isOpen: boolean;
    onClose: () => void;
}

export default function UserEditDialog({ user, isOpen, onClose }: UserEditDialogProps) {
    const firestore = useFirestore();
    const [role, setRole] = useState(user.role);
    const [status, setStatus] = useState(user.status || 'active');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setRole(user.role);
        setStatus(user.status || 'active');
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        const toastId = toast.loading("Saving changes...");
        try {
            const userRef = doc(firestore, 'users', user.id);
            updateDocumentNonBlocking(userRef, { role, status });
            toast.success("User updated successfully", { id: toastId });
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update user.", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User: {user.displayName}</DialogTitle>
                    <DialogDescription>{user.email}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <Select value={role} onValueChange={(value) => setRole(value as any)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="moderator">Moderator</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                                <SelectItem value="banned">Banned</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
