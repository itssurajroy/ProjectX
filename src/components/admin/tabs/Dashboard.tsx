'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Dashboard() {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(q, (snap) => {
      setUserCount(snap.size);
    });
    return unsub;
  }, []);
  
  const stats = [
    { label: "Users Online", value: "892", change: "+12%", color: "from-blue-500 to-cyan-500" },
    { label: "Active Streams", value: "1,204", change: "+3%", color: "from-purple-500 to-pink-500" },
    { label: "Today's Revenue", value: "$4,821", change: "+28%", color: "from-green-500 to-emerald-500" },
    { label: "New Users (24h)", value: userCount.toLocaleString(), change: "+18%", color: "from-orange-500 to-amber-500" },
  ];

  const chartData = [
    { day: "Mon", users: 2100 }, { day: "Tue", users: 2400 }, { day: "Wed", users: 2200 },
    { day: "Thu", users: 2800 }, { day: "Fri", users: 3200 }, { day: "Sat", users: 3800 },
    { day: "Sun", users: 4100 }
  ];

  const topAnime = [
    { rank: 1, title: "One Piece", views: "487,291" },
    { rank: 2, title: "Jujutsu Kaisen", views: "382,104" },
    { rank: 3, title: "Demon Slayer", views: "298,771" },
    { rank: 4, title: "Attack on Titan", views: "276,550" },
    { rank: 5, title: "Solo Leveling", views: "241,893" },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-6 border border-border shadow-lg">
            <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold font-display mt-1">{stat.value}</p>
            <div className="flex items-center text-sm mt-2">
              <span className="text-green-500 font-semibold">{stat.change}</span>
              <span className="text-muted-foreground ml-1">vs yesterday</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border shadow-lg">
          <h2 className="text-xl font-bold font-display mb-4">User Growth (7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{ 
                    background: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem"
                }} 
              />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-lg">
          <h2 className="text-xl font-bold font-display mb-4">Top Anime This Week</h2>
          <div className="space-y-4">
            {topAnime.map((anime) => (
              <div key={anime.rank} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground w-6 text-center">#{anime.rank}</span>
                  <p className="font-medium text-sm">{anime.title}</p>
                </div>
                <p className="text-sm font-semibold text-primary">{anime.views}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
