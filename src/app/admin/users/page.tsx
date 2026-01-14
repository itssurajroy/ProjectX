'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const placeholderUsers = [
    { id: '1', email: 'shadowslayer@test.com', username: 'ShadowSlayer_27', role: 'user', createdAt: '2024-05-01' },
    { id: '2', email: 'goddess@test.com', username: 'AnimeGoddess', role: 'moderator', createdAt: '2024-04-15' },
    { id: '3', email: 'admin@projectx.com', username: 'Admin', role: 'admin', createdAt: '2024-01-01' },
    { id: '4', email: 'dreamer@test.com', username: 'IsekaiDreamer', role: 'user', createdAt: '2024-05-10' },
];

export default function AdminUsersPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">View, edit roles, and manage all users.</p>
            </div>

            <div className="flex justify-between items-center">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search by email or username..." className="pl-10" />
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
                                {placeholderUsers.map(user => (
                                    <tr key={user.id} className="border-b last:border-b-0">
                                        <td className="p-4 font-medium">{user.username}</td>
                                        <td className="p-4 text-muted-foreground">{user.email}</td>
                                        <td className="p-4">
                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{user.createdAt}</td>
                                        <td className="p-4">
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
