
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const logs = [
  { id: 1, type: 'override_create', user: 'admin@example.com', message: 'Created override for anime: one-piece-100', timestamp: '2024-07-20 10:05:14' },
  { id: 2, type: 'user_ban', user: 'admin@example.com', message: 'Banned user: spammer@example.com', timestamp: '2024-07-20 10:02:31' },
  { id: 3, type: 'report_resolve', user: 'mod@example.com', message: 'Resolved report #rep_3', timestamp: '2024-07-20 09:55:02' },
  { id: 4, type: 'cache_clear', user: 'admin@example.com', message: 'Cleared all API cache', timestamp: '2024-07-20 09:45:10' },
];

const logTypeColors: {[key: string]: string} = {
    override_create: 'bg-blue-500/20 text-blue-300',
    user_ban: 'bg-red-500/20 text-red-400',
    report_resolve: 'bg-green-500/20 text-green-400',
    cache_clear: 'bg-yellow-500/20 text-yellow-400'
};

export default function LogsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>A real-time stream of administrative actions.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="font-mono text-sm space-y-2">
                    {logs.map(log => (
                        <div key={log.id} className="flex flex-col sm:flex-row sm:items-center gap-x-4 p-2 rounded-md hover:bg-muted/50">
                            <span className="text-muted-foreground">{log.timestamp}</span>
                            <Badge className={logTypeColors[log.type]}>{log.type}</Badge>
                            <span className="font-semibold">{log.user}:</span>
                            <span>{log.message}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
