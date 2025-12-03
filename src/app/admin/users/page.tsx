
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function UsersPage() {
  const users = [
    { id: "1", name: "GojoSatoru", email: "gojo@jjk.com", level: 89, xp: 45210, status: "active" },
    { id: "2", name: "NezukoBestGirl", email: "nezuko@demon.com", level: 67, xp: 32100, status: "warned" },
    { id: "3", name: "Spammer123", email: "spam@bot.net", level: 1, xp: 10, status: "banned" },
  ];

  return (
    <AdminLayout current="users">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Users Management</h1>
          <button className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition">
            Export CSV
          </button>
        </div>

        <div className="bg-gray-900/50 rounded-2xl border border-gray-800">
          <div className="p-6 border-b border-gray-800">
            <input type="text" placeholder="Search by name, email, UID..." className="w-full px-6 py-4 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          <div className="divide-y divide-gray-800">
            {users.map(user => (
              <div key={user.id} className="p-6 flex items-center justify-between hover:bg-gray-800/30 transition">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl font-bold">
                    {user.name[0]}
                  </div>
                  <div>
                    <p className="text-xl font-bold">{user.name}</p>
                    <p className="text-gray-400">{user.email}</p>
                    <p className="text-sm text-purple-400">Level {user.level} • {user.xp.toLocaleString()} XP</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    user.status === "active" ? "bg-green-900/50 text-green-400" :
                    user.status === "warned" ? "bg-yellow-900/50 text-yellow-400" :
                    "bg-red-900/50 text-red-400"
                  }`}>
                    {user.status.toUpperCase()}
                  </span>
                  <button className="px-5 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700">Warn</button>
                  <button className="px-5 py-2 bg-red-600 rounded-lg hover:bg-red-700">Ban</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
