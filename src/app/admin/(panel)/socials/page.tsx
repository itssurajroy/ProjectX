
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Plus, Twitter, Send, Youtube, Instagram, Facebook, Twitch } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";

const socialIcons = {
    Twitter: <Twitter className="w-4 h-4" />,
    Send: <Send className="w-4 h-4" />,
    Youtube: <Youtube className="w-4 h-4" />,
    Instagram: <Instagram className="w-4 h-4" />,
    Facebook: <Facebook className="w-4 h-4" />,
    Twitch: <Twitch className="w-4 h-4" />,
};

type SocialIconName = keyof typeof socialIcons;

interface SocialLink {
    id: string;
    name: string;
    url: string;
    icon: SocialIconName;
}

const initialSocials: SocialLink[] = [
    { id: '1', name: 'Discord', url: 'https://discord.gg/nHwCpPx9yy', icon: 'Send' },
    { id: '2', name: 'Twitter', url: 'https://x.com', icon: 'Twitter' },
];

export default function SocialsPage() {
    const [socials, setSocials] = useState<SocialLink[]>(initialSocials);

    // In a real implementation, these would interact with a Firestore backend.
    const handleAddSocial = () => {
        alert("This is a demo. Add functionality not implemented.");
    };

    const handleDeleteSocial = (id: string) => {
        alert(`This is a demo. Delete functionality for ID ${id} not implemented.`);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Social Link</CardTitle>
                    <CardDescription>Add a new social media link to be displayed on the site.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="social-name">Name</Label>
                            <Input id="social-name" placeholder="e.g., Discord" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="social-url">URL</Label>
                            <Input id="social-url" placeholder="https://discord.gg/..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Icon</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an icon" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(socialIcons).map((iconName) => (
                                        <SelectItem key={iconName} value={iconName}>
                                            <div className="flex items-center gap-2">
                                                {socialIcons[iconName as SocialIconName]}
                                                {iconName}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleAddSocial}>
                        <Plus className="w-4 h-4 mr-2" /> Add Social
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Social Links</CardTitle>
                    <CardDescription>Edit or delete existing social media links.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Icon</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>URL</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {socials.map((social) => (
                                <TableRow key={social.id}>
                                    <TableCell>{socialIcons[social.icon]}</TableCell>
                                    <TableCell className="font-medium">{social.name}</TableCell>
                                    <TableCell>
                                        <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                            {social.url}
                                        </a>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteSocial(social.id)} className="text-destructive">
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
