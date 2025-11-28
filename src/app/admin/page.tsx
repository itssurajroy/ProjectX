
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, Clapperboard, AlertTriangle } from "lucide-react";

const adminStats = [
  { title: "Total Users", value: "12,345", icon: Users },
  { title: "Episodes Added (24h)", value: "152", icon: Clapperboard },
  { title: "Active Streams", value: "2,401", icon: BarChart },
  { title: "Open Reports", value: "17", icon: AlertTriangle },
];

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Admin tools for managing users, episodes, and reports would appear here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
