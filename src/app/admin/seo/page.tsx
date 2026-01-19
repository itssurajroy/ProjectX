
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Globe, Link as LinkIcon, PlusCircle, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDoc, useFirestore, setDocumentNonBlocking, useCollection, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';

interface SeoTemplates {
    animeTitle: string;
    animeDesc: string;
    watchTitle: string;
    watchDesc: string;
    searchTitle: string;
    searchDesc: string;
    moviesTitle: string;
    moviesDesc: string;
    tvTitle: string;
    tvDesc: string;
}

interface RobotsTxt {
    content: string;
}

interface Redirect {
    id: string;
    from: string;
    to: string;
    type: 301 | 302;
}

// New AddRedirectDialog component
const AddRedirectDialog = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (redirect: Omit<Redirect, 'id'>) => void }) => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [type, setType] = useState<'301' | '302'>('301');
    const [isSaving, setIsSaving] = useState(false);

    const handleAdd = () => {
        if (!from || !to || !from.startsWith('/') || !to.startsWith('/')) {
            toast.error("Both 'From' and 'To' paths are required and must start with '/'.");
            return;
        }
        setIsSaving(true);
        onAdd({ from, to, type: Number(type) as 301 | 302 });
        // The parent component will handle closing and toast notifications
        setIsSaving(false);
        onClose();
        // Reset form
        setFrom('');
        setTo('');
        setType('301');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Redirect</DialogTitle>
                    <DialogDescription>Create a new URL redirect. Ensure paths start with a '/'.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="from-path" className="text-right">From</Label>
                        <Input id="from-path" value={from} onChange={e => setFrom(e.target.value)} className="col-span-3" placeholder="/old-path" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="to-path" className="text-right">To</Label>
                        <Input id="to-path" value={to} onChange={e => setTo(e.target.value)} className="col-span-3" placeholder="/new-path" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="redirect-type" className="text-right">Type</Label>
                        <Select value={type} onValueChange={(v) => setType(v as '301' | '302')}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="301">301 (Permanent)</SelectItem>
                                <SelectItem value="302">302 (Temporary)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleAdd} disabled={isSaving}>
                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>} Add Redirect
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function AdminSeoPage() {
    const firestore = useFirestore();
    
    // SEO Templates state and data
    const { data: seoData, loading: loadingSeo } = useDoc<SeoTemplates>('settings/seo');
    const [animeTitle, setAnimeTitle] = useState('');
    const [animeDesc, setAnimeDesc] = useState('');
    const [watchTitle, setWatchTitle] = useState('');
    const [watchDesc, setWatchDesc] = useState('');
    const [searchTitle, setSearchTitle] = useState('');
    const [searchDesc, setSearchDesc] = useState('');
    const [moviesTitle, setMoviesTitle] = useState('');
    const [moviesDesc, setMoviesDesc] = useState('');
    const [tvTitle, setTvTitle] = useState('');
    const [tvDesc, setTvDesc] = useState('');

    const [isSavingTemplates, setIsSavingTemplates] = useState(false);

    // Robots.txt state and data
    const { data: robotsData, loading: loadingRobots } = useDoc<RobotsTxt>('settings/robots');
    const [robotsContent, setRobotsContent] = useState('');
    const [isSavingRobots, setIsSavingRobots] = useState(false);

    // *** New Redirects state and data ***
    const { data: redirects, loading: loadingRedirects } = useCollection<Redirect>('settings_redirects');
    const [isAddRedirectOpen, setIsAddRedirectOpen] = useState(false);


    useEffect(() => {
        if (seoData) {
            setAnimeTitle(seoData.animeTitle || 'Watch {{anime_name}} Online | {{site_name}}');
            setAnimeDesc(seoData.animeDesc || 'Stream all episodes of {{anime_name}} in HD quality with English subtitles. Best place to watch anime online for free.');
            setWatchTitle(seoData.watchTitle || 'Watch {{anime_name}} Episode {{episode_number}} on {{site_name}}');
            setWatchDesc(seoData.watchDesc || 'Stream episode {{episode_number}} of {{anime_name}} online for free. No ads, HD quality.');
            setSearchTitle(seoData.searchTitle || 'Search results for "{{query}}" on {{site_name}}');
            setSearchDesc(seoData.searchDesc || 'Find and watch anime similar to "{{query}}".');
            setMoviesTitle(seoData.moviesTitle || 'Watch Anime Movies Online Free | {{site_name}}');
            setMoviesDesc(seoData.moviesDesc || 'Browse our collection of the latest and greatest anime movies.');
            setTvTitle(seoData.tvTitle || 'Watch Anime Series Online Free | {{site_name}}');
            setTvDesc(seoData.tvDesc || 'Browse our collection of the latest and greatest anime TV shows.');
        }
    }, [seoData]);

    useEffect(() => {
        if (robotsData) {
            setRobotsContent(robotsData.content || `User-agent: *\nAllow: /\n\nDisallow: /admin\nDisallow: /watch2gether`);
        }
    }, [robotsData]);

    const handleSaveTemplates = () => {
        setIsSavingTemplates(true);
        const toastId = toast.loading("Saving templates...");
        const settingsRef = doc(firestore, 'settings', 'seo');
        const dataToSave: SeoTemplates = {
            animeTitle, animeDesc, watchTitle, watchDesc,
            searchTitle, searchDesc, moviesTitle, moviesDesc,
            tvTitle, tvDesc
        };
        setDocumentNonBlocking(settingsRef, dataToSave, { merge: true });
        toast.success("Templates saved!", { id: toastId });
        setIsSavingTemplates(false);
    };

    const handleSaveRobots = () => {
        setIsSavingRobots(true);
        const toastId = toast.loading("Saving robots.txt...");
        const settingsRef = doc(firestore, 'settings', 'robots');
        setDocumentNonBlocking(settingsRef, { content: robotsContent }, { merge: true });
        toast.success("robots.txt saved!", { id: toastId });
        setIsSavingRobots(false);
    }
    
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

    const handleAddRedirect = (redirect: Omit<Redirect, 'id'>) => {
        const toastId = toast.loading("Adding redirect...");
        const redirectsCol = collection(firestore, 'settings_redirects');
        addDocumentNonBlocking(redirectsCol, redirect)
            .then(() => toast.success("Redirect added!", { id: toastId }))
            .catch(err => toast.error("Failed to add redirect.", { id: toastId }));
    };

    const handleDeleteRedirect = (redirectId: string) => {
        if (!confirm("Are you sure you want to delete this redirect? This action cannot be undone.")) return;

        const toastId = toast.loading("Deleting redirect...");
        const redirectRef = doc(firestore, 'settings_redirects', redirectId);
        deleteDocumentNonBlocking(redirectRef);
        toast.success("Redirect deleted.", { id: toastId });
    };

    const sitemapUrl = typeof window !== 'undefined' ? `${window.location.origin}/sitemap.xml` : '/sitemap.xml';

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
                        <CardDescription>{"Define default SEO titles and descriptions for different content types. Use variables like `{{anime_name}}`, `{{episode_number}}`, `{{query}}`, `{{site_name}}`."}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loadingSeo ? <div className="flex justify-center my-10"><Loader2 className="w-6 h-6 animate-spin"/></div> : (
                        <div className="space-y-6">
                            <div className="space-y-2 p-3 border rounded-lg">
                                <Label htmlFor="anime-title" className="font-semibold">Anime Page</Label>
                                <Input id="anime-title" value={animeTitle} onChange={e => setAnimeTitle(e.target.value)} placeholder="Title for Anime Detail pages..."/>
                                <Textarea id="anime-desc" value={animeDesc} onChange={e => setAnimeDesc(e.target.value)} placeholder="Description for Anime Detail pages..." />
                            </div>
                             <div className="space-y-2 p-3 border rounded-lg">
                                <Label htmlFor="watch-title" className="font-semibold">Watch Page</Label>
                                <Input id="watch-title" value={watchTitle} onChange={e => setWatchTitle(e.target.value)} placeholder="Title for Watch pages..." />
                                <Textarea id="watch-desc" value={watchDesc} onChange={e => setWatchDesc(e.target.value)} placeholder="Description for Watch pages..."/>
                            </div>
                             <div className="space-y-2 p-3 border rounded-lg">
                                <Label htmlFor="search-title" className="font-semibold">Search Page</Label>
                                <Input id="search-title" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Title for Search pages..." />
                                <Textarea id="search-desc" value={searchDesc} onChange={e => setSearchDesc(e.target.value)} placeholder="Description for Search pages..." />
                            </div>
                             <div className="space-y-2 p-3 border rounded-lg">
                                <Label htmlFor="movies-title" className="font-semibold">Movies Page</Label>
                                <Input id="movies-title" value={moviesTitle} onChange={e => setMoviesTitle(e.target.value)} placeholder="Title for Movies listing page..." />
                                <Textarea id="movies-desc" value={moviesDesc} onChange={e => setMoviesDesc(e.target.value)} placeholder="Description for Movies listing page..." />
                            </div>
                             <div className="space-y-2 p-3 border rounded-lg">
                                <Label htmlFor="tv-title" className="font-semibold">TV Shows Page</Label>
                                <Input id="tv-title" value={tvTitle} onChange={e => setTvTitle(e.target.value)} placeholder="Title for TV Shows listing page..." />
                                <Textarea id="tv-desc" value={tvDesc} onChange={e => setTvDesc(e.target.value)} placeholder="Description for TV Shows listing page..."/>
                            </div>
                        </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button className="ml-auto" onClick={handleSaveTemplates} disabled={isSavingTemplates || loadingSeo}>
                            {isSavingTemplates && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                            Save All Templates
                        </Button>
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
                             {sitemapUrl}
                           </Link>
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                               navigator.clipboard.writeText(sitemapUrl);
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
                           {loadingRobots ? <div className="flex justify-center my-10"><Loader2 className="w-6 h-6 animate-spin"/></div> : (
                             <Textarea 
                                rows={6} 
                                value={robotsContent}
                                onChange={e => setRobotsContent(e.target.value)}
                                disabled={loadingRobots}
                                placeholder="User-agent: * ..."
                                className="font-mono text-xs"
                            />
                           )}
                           <p className="text-xs text-muted-foreground mt-2">The sitemap URL will be automatically appended.</p>
                        </CardContent>
                        <CardFooter>
                           <Button className="ml-auto" onClick={handleSaveRobots} disabled={isSavingRobots || loadingRobots}>
                             {isSavingRobots && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                             Save Robots.txt
                           </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Redirect Manager</CardTitle>
                        <Button size="sm" className="gap-2" onClick={() => setIsAddRedirectOpen(true)}>
                            <PlusCircle className="w-4 h-4"/> Add Redirect
                        </Button>
                    </div>
                    <CardDescription>Manage URL redirects to prevent broken links.</CardDescription>
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
                            {loadingRedirects ? (
                                <TableRow><TableCell colSpan={4} className="text-center p-8"><Loader2 className="w-6 h-6 animate-spin mx-auto"/></TableCell></TableRow>
                            ) : redirects && redirects.length > 0 ? (
                                redirects.map(redirect => (
                                    <TableRow key={redirect.id}>
                                        <TableCell className="font-mono text-sm">{redirect.from}</TableCell>
                                        <TableCell className="font-mono text-sm">{redirect.to}</TableCell>
                                        <TableCell>{redirect.type}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteRedirect(redirect.id)}>
                                                <Trash2 className="w-4 h-4"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={4} className="text-center p-8 text-muted-foreground">No redirects configured.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AddRedirectDialog isOpen={isAddRedirectOpen} onClose={() => setIsAddRedirectOpen(false)} onAdd={handleAddRedirect} />
        </div>
    );
}
