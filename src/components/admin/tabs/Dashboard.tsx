// src/components/admin/tabs/Dashboard.tsx
'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useFirestore } from "@/firebase";

export default function Dashboard() {
  const firestore = useFirestore();
  const [stats, setStats] = useState({
    totalUsers: 12847,
    activeToday: 892,
    viewsThisWeek: 287000,
    revenue: 0,
    serverCost: 892,
    profitMargin: 0
  });

  // Example of how you might fetch real data
  // useEffect(() => {
  //   if (!firestore) return;
  //   const usersQuery = query(collection(firestore, "users"));
  //   const unsub = onSnapshot(usersQuery, (snap) => {
  //     setStats(prev => ({...prev, totalUsers: snap.size}));
  //   });
  //   return unsub;
  // }, [firestore]);

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
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[
          { label: "Total Users", value: stats.totalUsers.toLocaleString(), change: "+18%", color: "from-cyan-500 to-blue-600" },
          { label: "Active Today", value: stats.activeToday.toLocaleString(), change: "+12%", color: "from-green-500 to-emerald-600" },
          { label: "Views This Week", value: (stats.viewsThisWeek / 1000000).toFixed(1) + "M", change: "+42%", color: "from-purple-500 to-pink-600" },
          { label: "Revenue", value: "$" + stats.revenue, change: "+0%", color: "from-yellow-500 to-orange-600" },
          { label: "Server Cost", value: "$" + stats.serverCost, change: "-3%", color: "from-red-500 to-rose-600" },
          { label: "Profit Margin", value: stats.profitMargin + "%", change: "+5%", color: "from-orange-500 to-red-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              <span className={`text-sm font-bold ${stat.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {stat.value}
            </p>
            <div className="mt-6 h-3 bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`} style={{ width: "78%" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Clear All Cache", "Force Revalidate All", "Toggle Maintenance", "Send Notification"].map((action) => (
            <button key={action} className="px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:scale-105 transition transform shadow-xl">
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30">
          <h2 className="text-3xl font-bold mb-8">User Growth (7 Days)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#333" />
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #444" }} />
              <Line type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={4} dot={{ fill: "#a855f7" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30">
          <h2 className="text-3xl font-bold mb-8">Top 10 Most Watched</h2>
          <div className="space-y-6">
            {topAnime.map((anime) => (
              <div key={anime.rank} className="flex items-center justify-between p-6 bg-gray-800/40 rounded-2xl hover:bg-gray-800/60 transition">
                <div className="flex items-center gap-6">
                  <span className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    #{anime.rank}
                  </span>
                  <p className="text-2xl font-bold">{anime.title}</p>
                </div>
                <p className="text-xl text-purple-400">{anime.views} views</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
