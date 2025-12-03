// src/app/admin/comments/page.tsx
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function CommentsPage() {
  const comments = [
    { id: "c1", user: "LoverBoy99", anime: "Oshi no Ko", text: "Aqua is the GOAT", reports: 2 },
    { id: "c2", user: "ToxicKid", anime: "One Piece", text: "Zoro > Luffy trash", reports: 47 },
  ];

  return (
    <AdminLayout current="comments">
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">Comment Moderation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-2xl">
            <p className="text-5xl font-bold">12,847</p>
            <p className="text-xl opacity-90">Total Comments Today</p>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-orange-600 p-8 rounded-2xl">
            <p className="text-5xl font-bold">89</p>
            <p className="text-xl opacity-90">Flagged for Review</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-8 rounded-2xl">
            <p className="text-5xl font-bold">99.2%</p>
            <p className="text-xl opacity-90">Clean Comments</p>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8">
          <h2 className="text-2xl font-bold mb-6">Recent Comments</h2>
          {comments.map(c => (
            <div key={c.id} className="p-6 bg-gray-800/30 rounded-xl mb-4 flex justify-between items-start">
              <div>
                <p className="font-bold text-purple-400">{c.user}</p>
                <p className="text-gray-300 mt-1">In: <span className="text-pink-400">{c.anime}</span></p>
                <p className="mt-3 text-lg">"{c.text}"</p>
              </div>
              <div className="flex flex-col gap-3">
                {c.reports > 0 && <span className="px-4 py-2 bg-red-900/50 text-red-400 rounded-lg">Reported {c.reports}x</span>}
                <div className="flex gap-3">
                  <button className="px-5 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">Hide</button>
                  <button className="px-5 py-2 bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
