'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCollection } from "@/firebase/client/useCollection";
import { UserProfile } from "@/lib/types/user";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function AdminUsersPage() {
    const { data: users, loading, error } = useCollection<UserProfile>('users');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

    const filteredUsers = users?.filter(user => 
        (user.displayName && user.displayName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">View, edit roles, and manage all users.</p>
            </div>

            <div className="flex justify-between items-center">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by email or username..." 
                        className="pl-10" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

             <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b">
                                    <th className="p-4 text-left font-semibold">Username</th>
                                    <th className="p-4 text-left font-semibold">Email</th>
                                    <th className="p-4 text-left font-semibold">Role</th>
                                    <th className="p-4 text-left font-semibold">Created At</th>
                                    <th className="p-4 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center p-8">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={5} className="p-8">
                                            <ErrorDisplay title="Failed to load users" description={error.message} isCompact />
                                        </td>
                                    </tr>
                                ) : filteredUsers && filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                    <tr key={user.email} className="border-b last:border-b-0">
                                        <td className="p-4 font-medium">{user.displayName}</td>
                                        <td className="p-4 text-muted-foreground">{user.email}</td>
                                        <td className="p-4">
                                            <Badge variant={user.role === 'admin' ? 'default' : user.role === 'moderator' ? 'secondary' : 'outline'}>{user.role}</Badge>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{user.createdAt?.toDate().toLocaleDateString() || 'N/A'}</td>
                                        <td className="p-4">
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </td>
                                    </tr>
                                ))) : (
                                     <tr>
                                        <td colSpan={5} className="text-center p-8 text-muted-foreground">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
