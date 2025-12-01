'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { MoreHorizontal, FileDown, Search, UserCheck, UserX } from 'lucide-react';
import { initializeFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { useDebounce } from 'use-debounce';

const { firestore } = initializeFirebase();

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'moderator' | 'user' | 'premium' | 'banned';
  joined: any;
  lastLogin: any;
  watchTime: string;
}

const roleColors: Record<User['role'], string> = {
  admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  moderator: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  user: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  premium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  banned: 'bg-stone-500/20 text-stone-400 border-stone-500/30',
};

const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  useEffect(() => {
    setLoading(true);
    let q = query(collection(firestore, 'users'), orderBy('joined', 'desc'));
    
    if (debouncedSearchTerm) {
      // This is a simple search. For complex searches, you might need a third-party service like Algolia.
      // We will filter client-side for this demonstration.
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData: User[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!debouncedSearchTerm) return users;
    return users.filter(user => 
        user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [users, debouncedSearchTerm]);


  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription className="mt-1">
                {filteredUsers.length.toLocaleString()} users found.
            </CardDescription>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by email, name, UID..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button variant="outline" className="hidden sm:flex">
                <FileDown className="w-4 h-4 mr-2" /> Export CSV
            </Button>
          </div>
        </div>
        {selectedUsers.length > 0 && (
            <motion.div 
              initial={{opacity: 0, y: -10}} 
              animate={{opacity: 1, y: 0}}
              className="bg-muted/50 border border-border rounded-lg p-2 mt-4 flex items-center gap-2"
            >
                <p className="text-sm font-medium">{selectedUsers.length} selected</p>
                <Button variant="outline" size="sm"><UserX className="w-4 h-4 mr-2"/>Ban</Button>
                <Button variant="outline" size="sm"><UserCheck className="w-4 h-4 mr-2"/>Make Premium</Button>
            </motion.div>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                    <Checkbox 
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                    />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                <TableHead className="hidden md:table-cell">Watch Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({length: 10}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell colSpan={7} className="p-4">
                            <div className="h-6 bg-muted/50 rounded animate-pulse" />
                        </TableCell>
                    </TableRow>
                ))
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id} data-state={selectedUsers.includes(user.id) ? 'selected' : ''}>
                    <TableCell>
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleSelectUser(user.id)}
                        />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.name || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className={roleColors[user.role]}>{user.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDate(user.joined)}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDate(user.lastLogin)}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.watchTime || '0h 0m'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem>Impersonate</DropdownMenuItem>
                          <DropdownMenuItem className="text-yellow-500">Warn User</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Ban User</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
