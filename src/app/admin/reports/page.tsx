'use client';
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function ReportsPage() {
  const reports = Array(17).fill(null).map((_, i) => ({
    id: i,
    user: "TrollLord" + i,
    reason: i % 3 === 0 ? "Spam" : i % 2 === 0 ? "Harassment" : "Spoiler",
    comment: "Luffy dies in chapter 1128",
    anime: "One Piece",
    time: "2 hours ago"
  }));

  return (
    <AdminLayout current="reports">
      <div className="space-y-10">
        <h1 className="text-6xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Reports Center • 17 Active
        </h1>

        <div className="space-y-6">
          {reports.map(r => (
            <div key={r.id} className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/40 rounded-3xl p-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-3xl font-bold text-red-400">Report #{r.id + 1} • {r.reason}</p>
                  <p className="text-xl text-gray-300 mt-4">User: <span className="text-pink-400">{r.user}</span></p>
                  <p className="text-xl text-gray-300">Anime: <span className="text-purple-400">{r.anime}</span></p>
                  <div className="mt-6 p-6 bg-black/50 rounded-2xl border border-red-500/50">
                    <p className="text-2xl italic">"{r.comment}"</p>
                  </div>
                  <p className="text-gray-500 mt-4">{r.time}</p>
                </div>
                <div className="flex flex-col gap-5">
                  <button className="px-10 py-5 bg-red-600 rounded-2xl text-xl font-bold hover:bg-red-700">BAN USER</button>
                  <button className="px-10 py-5 bg-yellow-600 rounded-2xl text-xl font-bold hover:bg-yellow-700">WARN + DELETE</button>
                  <button className="px-10 py-5 bg-gray-700 rounded-2xl text-xl font-bold hover:bg-gray-600">Dismiss</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
