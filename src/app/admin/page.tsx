
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { AlertTriangle, Bell, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardStats from "@/components/admin/DashboardStats";

const userGrowthData = [
  { date: '7d ago', users: 120 }, { date: '6d ago', users: 150 }, { date: '5d ago', users: 130 },
  { date: '4d ago', users: 180 }, { date: '3d ago', users: 210 }, { date: '2d ago', users: 250 },
  { date: 'yesterday', users: 230 }, { date: 'today', users: 280 },
];

const topWatchedData = [
  { name: 'Anime A', watchCount: 4000 }, { name: 'Anime B', watchCount: 3000 }, { name: 'Anime C', watchCount: 2000 },
  { name: 'Anime D', watchCount: 2780 }, { name: 'Anime E', watchCount: 1890 },
];

const quickActions = [
    { label: "Clear All Cache", icon: Trash2 },
    { label: "Force Revalidate All", icon: RefreshCw },
    { label: "Toggle Maintenance", icon: AlertTriangle },
    { label: "Send Notification", icon: Bell }
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <DashboardStats />

       <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {quickActions.map(action => (
                     <Button key={action.label} variant="outline">
                        <action.icon className="w-4 h-4 mr-2"/>
                        {action.label}
                    </Button>
                ))}
            </CardContent>
        </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Most Watched</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-2">
                {topWatchedData.map((item, index) => (
                    <div key={item.name} className="flex justify-between items-center text-sm">
                        <span className="font-medium">#{index+1} {item.name}</span>
                        <span className="text-muted-foreground">{item.watchCount.toLocaleString()} views</span>
                    </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
