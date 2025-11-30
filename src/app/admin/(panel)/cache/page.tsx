
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RefreshCw, Trash2, Database } from "lucide-react";

const cacheStats = [
  { label: 'Cache Hits', value: '1.2M' },
  { label: 'Cache Misses', value: '4,512' },
  { label: 'Total Cached Items', value: '5,432' },
  { label: 'Cache Size', value: '2.8 GB' },
];

export default function CachePage() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cacheStats.map(stat => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                             <Database className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Global Cache Control</CardTitle>
                    <CardDescription>Actions taken here affect the entire site.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                    <Button variant="destructive"><Trash2 className="w-4 h-4 mr-2"/> Clear All API Cache</Button>
                    <Button variant="destructive" ><Trash2 className="w-4 h-4 mr-2"/> Clear Vercel Edge Cache</Button>
                </CardContent>
            </Card>
            
             <Card>
                <CardHeader>
                    <CardTitle>Manage Single Anime Cache</CardTitle>
                    <CardDescription>Force refresh the cache for a specific anime.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                     <Input placeholder="Anime ID (e.g., one-piece-100)" />
                    <Button><RefreshCw className="w-4 h-4 mr-2"/> Force Refresh</Button>
                </CardContent>
            </Card>
        </div>
    )
}
