
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function UsersPage() {
  return (
    <AdminLayout current="users">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Users Management</h1>
        <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          <input placeholder="Search users..." className="w-full px-6 py-4 bg-gray-800 rounded-xl" />
          <div className="mt-6 space-y-4">
            {["user123", "gojofan69", "nezukoqueen"].map(u => (
              <div key={u} className="flex items-center justify-between p-6 bg-gray-800/50 rounded-xl">
                <div>
                  <p className="font-bold">{u}</p>
                  <p className="text-gray-400">Level 42 • 12,750 XP</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-yellow-600 rounded-lg">Warn</button>
                  <button className="px-4 py-2 bg-red-600 rounded-lg">Ban</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
