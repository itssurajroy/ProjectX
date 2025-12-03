// src/app/admin/announcements/page.tsx
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AnnouncementsPage() {
  return (
    <AdminLayout current="announcements">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Announcements (5 Active)</h1>
          <button className="px-6 py-3 bg-purple-600 rounded-xl">+ New Announcement</button>
        </div>

        <div className="grid gap-6">
          {["Server Maintenance Tonight", "New Domain: projectx.to", "1MEGA GIVEAWAY"].map((title, i) => (
            <div key={i} className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/30">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">{title}</h3>
                <span className="ml-auto px-4 py-2 bg-green-900/50 text-green-400 rounded-lg">LIVE</span>
              </div>
              <p className="mt-4 text-gray-300">Shown to all users • Started 3h ago</p>
              <div className="mt-6 flex gap-4">
                <button className="px-5 py-2 bg-gray-700 rounded-lg">Edit</button>
                <button className="px-5 py-2 bg-red-600 rounded-lg">End Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
