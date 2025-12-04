// src/components/admin/Dashboard.tsx
'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import DashboardStats from "./DashboardStats";

const chartData = [
  { day: "7d ago", users: 70 },
  { day: "6d ago", users: 140 },
  { day: "5d ago", users: 110 },
  { day: "4d ago", users: 180 },
  { day: "3d ago", users: 210 },
  { day: "2d ago", users: 240 },
  { day: "yesterday", users: 260 },
  { day: "today", users: 280 },
];

const topAnime = [
  { rank: 1, title: "Anime A", views: "4,000" },
  { rank: 2, title: "Anime B", views: "3,000" },
  { rank: 3, title: "Anime C", views: "2,000" },
  { rank: 4, title: "Anime D", views: "2,780" },
  { rank: 5, title: "Anime E", views: "1,890" },
];

export default function Dashboard() {
  const firestore = useFirestore();
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    if(!firestore) return;
    const q = query(collection(firestore, "users"));
    const unsub = onSnapshot(q, (snap) => {
      setUserCount(snap.size);
    });
    return unsub;
  }, [firestore]);


  return (
    <div className="space-y-8">
      
      <DashboardStats />

      {/* Quick Actions */}
      <div className="bg-card/50 backdrop-blur rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Clear All Cache", "Force Revalidate All", "Toggle Maintenance", "Send Notification"].map((action) => (
            <button key={action} className="px-6 py-4 bg-muted hover:bg-primary/20 rounded-xl transition">
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-card/50 backdrop-blur rounded-2xl p-6 border border-border">
          <h2 className="text-xl font-bold mb-6">User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card/50 backdrop-blur rounded-2xl p-6 border border-border">
          <h2 className="text-xl font-bold mb-6">Top 10 Most Watched</h2>
          <div className="space-y-4">
            {topAnime.map((anime) => (
              <div key={anime.rank} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-muted-foreground">#{anime.rank}</span>
                  <span className="font-medium">{anime.title}</span>
                </div>
                <span className="text-muted-foreground">{anime.views} views</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
