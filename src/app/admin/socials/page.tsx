'use client';
import { AdminLayout } from "@/components/admin/AdminLayout";
export default function SocialsPage() {
  return (
    <AdminLayout current="socials">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-6xl font-black text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Social Links Manager
        </h1>
        {[
          { platform: "Discord", link: "discord.gg/projectx", members: "48,291" },
          { platform: "Twitter/X", link: "@ProjectXAnime", members: "127K" },
          { platform: "Reddit", link: "r/ProjectX", members: "89K" },
        ].map(s => (
          <div key={s.platform} className="bg-gray-900/60 rounded-3xl p-10 border border-cyan-500/30">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-4xl font-bold">{s.platform}</p>
                <p className="text-2xl text-cyan-400 mt-4">{s.link}</p>
                <p className="text-xl text-gray-400">{s.members} members</p>
              </div>
              <button className="px-10 py-5 bg-cyan-600 rounded-2xl text-xl font-bold hover:bg-cyan-500">
                UPDATE LINK
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
