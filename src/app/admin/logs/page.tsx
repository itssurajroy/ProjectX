// src/app/admin/logs/page.tsx
import { AdminLayout } from "@/components/admin/AdminLayout";
export default function LogsPage() {
  return (
    <AdminLayout current="logs">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Admin Logs</h1>
        <div className="bg-gray-900/50 rounded-2xl p-8">
          <p className="text-2xl text-gray-300">You banned user "TrollKing" — 5 minutes ago</p>
          <p className="text-2xl text-gray-300">You cleared cache — 2 hours ago</p>
        </div>
      </div>
    </AdminLayout>
  );
}
