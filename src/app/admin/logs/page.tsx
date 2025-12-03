'use client';
import { AdminLayout } from "@/components/admin/AdminLayout";
export default function LogsPage() {
  const logs = [
    "Banned user TrollKing999 • IP blocked",
    "Cleared entire CDN cache • 47.8GB freed",
    "Started global announcement: New Domain Live",
    "Added anime: Wind Breaker S2",
    "Deleted 127 spam comments",
  ];

  return (
    <AdminLayout current="logs">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-7xl font-black text-center mb-20 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Admin Action Logs
        </h1>
        <div className="space-y-8">
          {logs.map((log, i) => (
            <div key={i} className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-cyan-500/30 hover:border-cyan-400 transition">
              <p className="text-3xl font-medium text-cyan-300">{log}</p>
              <p className="text-xl text-gray-500 mt-4">{new Date().toLocaleTimeString()} • {new Date().toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
