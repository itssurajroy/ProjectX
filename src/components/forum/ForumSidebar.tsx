
// This is a placeholder file for the forum sidebar.
// You can add content here like recent threads, top users, etc.
export default function ForumSidebar() {
    return (
        <div className="w-80 hidden md:block">
            <div className="bg-card/50 p-4 rounded-lg border border-border/50">
                <h3 className="font-bold text-lg mb-4">Community Stats</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Threads:</span>
                        <span className="font-semibold">23,789</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Replies:</span>
                        <span className="font-semibold">1,452,102</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Online:</span>
                        <span className="font-semibold text-green-400">1,247</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
