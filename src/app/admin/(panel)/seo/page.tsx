
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function SEOPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Global SEO Settings</CardTitle>
                    <CardDescription>Manage global meta tags and SEO configuration for the entire site.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Site Name</Label>
                        <Input defaultValue="ProjectX" />
                    </div>
                    <div className="space-y-2">
                        <Label>Meta Title Template</Label>
                        <Input defaultValue="%s | ProjectX" />
                        <p className="text-xs text-muted-foreground">Use %s as a placeholder for the page title.</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Global Meta Description</Label>
                        <Textarea defaultValue="ProjectX - A modern streaming platform for all your favorite shows." />
                    </div>
                    <div className="space-y-2">
                        <Label>Global Meta Keywords</Label>
                        <Input defaultValue="anime, watch anime, free anime, anime online, english sub, english dub" />
                         <p className="text-xs text-muted-foreground">Comma-separated keywords.</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Favicon URL</Label>
                        <Input placeholder="/favicon.ico" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Robots.txt</CardTitle>
                    <CardDescription>Manage the `robots.txt` file to control web crawler access.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        rows={10}
                        defaultValue={`User-agent: *\nAllow: /\n\nSitemap: https://yoursite.com/sitemap.xml`}
                        className="font-mono"
                    />
                </CardContent>
            </Card>
             <Card>
                 <CardHeader>
                    <CardTitle>Sitemap Generation</CardTitle>
                    <CardDescription>Control how and when the sitemap is generated.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <Button>Generate Sitemap Now</Button>
                    <p className="text-sm text-muted-foreground">Last generated: 2 hours ago</p>
                </CardContent>
            </Card>
            <div className="flex justify-end">
                <Button>Save SEO Settings</Button>
            </div>
        </div>
    )
}
