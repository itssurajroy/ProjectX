
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Globe, Link, PlusCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const mockRedirects = [
    { id: 1, from: '/old-anime-link', to: '/anime/new-anime-slug', type: 301 },
    { id: 2, from: '/promo/2023-event', to: '/events/2024-convention', type: 302 },
];

export default function AdminSeoPage() {
    
    const handleRegenerateSitemap = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Regenerating sitemap...',
                success: 'Sitemap regeneration initiated successfully!',
                error: 'Failed to regenerate sitemap.',
            }
        );
    }

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold">SEO Management</h1>
                <p className="text-muted-foreground">Control metadata templates, sitemaps, and redirects.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Metadata Templates</CardTitle>
                        <CardDescription>Define default SEO titles and descriptions for different content types.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="anime-title">Anime Page Title Template</Label>
                            <Input id="anime-title" placeholder="e.g., Watch {{anime_name}} Online | {{site_name}}" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="anime-desc">Anime Page Description Template</Label>
                            <Textarea id="anime-desc" placeholder="e.g., Stream all episodes of {{anime_name}} in HD quality..." />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="ml-auto">Save Templates</Button>
                    </CardFooter>
                </Card>

                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Sitemap</CardTitle>
                            <CardDescription>Manage your XML sitemap for search engine crawlers.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center gap-2">
                           <Globe className="w-4 h-4 text-muted-foreground"/>
                           <Link href="/sitemap.xml" target="_blank" className="text-sm font-medium hover:underline text-primary">
                             /sitemap.xml
                           </Link>
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                               navigator.clipboard.writeText(`${window.location.origin}/sitemap.xml`);
                               toast.success('Sitemap URL copied!');
                           }}><Copy className="w-4 h-4"/></Button>
                        </CardContent>
                        <CardFooter>
                             <Button variant="outline" onClick={handleRegenerateSitemap}>Regenerate Sitemap</Button>
                        </CardFooter>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Robots.txt</CardTitle>
                            <CardDescription>Edit the rules for web crawlers.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Textarea rows={6} defaultValue={`User-agent: *\nAllow: /\n\nDisallow: /admin\nDisallow: /watch2gether\n\nSitemap: ${typeof window !== 'undefined' ? window.location.origin : ''}/sitemap.xml`} />
                        </CardContent>
                        <CardFooter>
                           <Button className="ml-auto">Save Robots.txt</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Redirect Manager</CardTitle>
                    <div className="flex justify-between items-center">
                         <CardDescription>Manage URL redirects to prevent broken links.</CardDescription>
                         <Button size="sm" className="gap-2"><PlusCircle className="w-4 h-4"/> Add Redirect</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>From Path</TableHead>
                                <TableHead>To Path</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockRedirects.map(redirect => (
                                <TableRow key={redirect.id}>
                                    <TableCell className="font-mono text-sm">{redirect.from}</TableCell>
                                    <TableCell className="font-mono text-sm">{redirect.to}</TableCell>
                                    <TableCell>{redirect.type}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4"/></Button>
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
