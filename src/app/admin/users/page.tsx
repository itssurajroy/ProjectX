

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const users = [
  { id: 'usr_1', email: 'dev@example.com', name: 'Super Admin', role: 'admin', joined: '2023-01-15', lastLogin: '2024-07-20', watchTime: '152h 30m' },
  { id: 'usr_2', email: 'mod@example.com', name: 'Mod Squad', role: 'moderator', joined: '2023-02-20', lastLogin: '2024-07-20', watchTime: '98h 15m' },
  { id: 'usr_3', email: 'user1@example.com', name: 'John Doe', role: 'user', joined: '2023-03-01', lastLogin: '2024-07-19', watchTime: '45h 5m' },
  { id: 'usr_4', email: 'user2@example.com', name: 'Jane Smith', role: 'user', joined: '2023-03-05', lastLogin: '2024-07-18', watchTime: '210h 45m' },
  { id: 'usr_5', email: 'user3@example.com', name: 'Inactive User', role: 'user', joined: '2023-04-10', lastLogin: '2024-05-01', watchTime: '12h' },
];

const roleColors: {[key: string]: string} = {
    admin: 'bg-red-500/20 text-red-400 border-red-500/30',
    moderator: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    user: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};

export default function UsersPage() {
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle>User Management</CardTitle>
                        <p className="text-muted-foreground text-sm mt-1">Search, filter, and manage all users.</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Input placeholder="Search by email, UID, name..." className="w-full md:w-64" />
                        <Button variant="outline" className="hidden sm:flex"><FileDown className="w-4 h-4 mr-2" /> Export CSV</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead className="hidden md:table-cell">Role</TableHead>
                                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                                <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                                <TableHead className="hidden md:table-cell">Watch Time</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge className={roleColors[user.role]}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">{user.joined}</TableCell>
                                    <TableCell className="hidden lg:table-cell">{user.lastLogin}</TableCell>
                                    <TableCell className="hidden md:table-cell">{user.watchTime}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-4 h-4"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Change Role</DropdownMenuItem>
                                                <DropdownMenuItem className="text-yellow-500">Ban User</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
