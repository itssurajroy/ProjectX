
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function ReportsPage() {
  return (
    <AdminLayout current="reports">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Reports (17)</h1>
          <button className="px-6 py-3 bg-green-600 rounded-xl hover:bg-green-700">Mark All Resolved</button>
        </div>

        <div className="space-y-4">
          {Array(17).fill(null).map((_, i) => (
            <div key={i} className="bg-gray-900/50 border border-red-500/30 rounded-2xl p-6 flex justify-between items-center">
              <div>
                <p className="font-bold text-red-400">User "TrollKing" reported for spam</p>
                <p className="text-gray-400 mt-1">In One Piece Episode 1128 • 2 hours ago</p>
                <p className="mt-3 text-lg">"oda is dead lol"</p>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-yellow-600 rounded-xl">Warn User</button>
                <button className="px-6 py-3 bg-red-600 rounded-xl">Ban + Delete</button>
                <button className="px-6 py-3 bg-gray-700 rounded-xl">Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
