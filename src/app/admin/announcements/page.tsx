'use client';
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AnnouncementsPage() {
  return (
    <AdminLayout current="announcements">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-8">
            Global Announcements
          </h1>
          <button className="px-12 py-6 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl hover:scale-110 transition">
            + CREATE NEW ANNOUNCEMENT
          </button>
        </div>

        {["Server Upgrade Complete!", "New Domain: projectx.to", "1TB Giveaway Winners"].map((title, i) => (
          <div key={i} className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/50 rounded-3xl p-10">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-4xl font-bold">{title}</h3>
                <p className="text-2xl text-gray-300 mt-4">Type: Banner + Popup • Reach: 100%</p>
                <p className="text-xl text-gray-400 mt-2">Active since 3 hours ago • 48,291 views</p>
              </div>
              <div className="flex gap-6">
                <button className="px-8 py-4 bg-gray-700 rounded-2xl font-bold">EDIT</button>
                <button className="px-8 py-4 bg-red-600 rounded-2xl font-bold">END NOW</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
