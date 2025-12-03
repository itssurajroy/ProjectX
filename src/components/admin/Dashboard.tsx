
'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { title: "Total Users", value: "0", change: "+18%", color: "from-cyan-500 to-blue-500" },
  { title: "Active Today", value: "0", change: "+12%", color: "from-green-500 to-emerald-500" },
  { title: "Views This Week", value: "0.0M", change: "+42%", color: "from-purple-500 to-pink-500" },
  { title: "Revenue", value: "$0", change: "+0%", color: "from-yellow-500 to-orange-500" },
  { title: "Server Cost", value: "$892", change: "-3%", color: "from-red-500 to-rose-500" },
  { title: "Profit Margin", value: "0%", change: "+5%", color: "from-orange-500 to-red-500" },
];

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
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-gray-900/50 backdrop-blur rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm">{stat.title}</h3>
              <span className={`text-sm font-bold ${stat.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full`} style={{ width: "75%" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-6 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Clear All Cache", "Force Revalidate All", "Toggle Maintenance", "Send Notification"].map((action) => (
            <button key={action} className="px-6 py-4 bg-gray-800 hover:bg-purple-900/50 rounded-xl transition">
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold mb-6">User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #444" }} />
              <Line type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold mb-6">Top 10 Most Watched</h2>
          <div className="space-y-4">
            {topAnime.map((anime) => (
              <div key={anime.rank} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-purple-400">#{anime.rank}</span>
                  <span className="font-medium">{anime.title}</span>
                </div>
                <span className="text-gray-400">{anime.views} views</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
