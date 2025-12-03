import { AdminLayout } from "@/components/admin/AdminLayout";
export default function RequestsPage() {
  return (
    <AdminLayout current="requests">
      <div className="space-y-10">
        <h1 className="text-6xl font-black text-center bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Anime Requests • 42 Pending
        </h1>
        <div className="grid gap-8">
          {["Wind Breaker Season 2", "Blue Lock S2", "Kaiju No. 8"].map((title, i) => (
            <div key={i} className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-green-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-4xl font-bold">{title}</p>
                  <p className="text-2xl text-gray-400 mt-4">Requested by 892 users • Top #3 this week</p>
                </div>
                <button className="px-12 py-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl text-2xl font-bold hover:scale-110 transition">
                  ADD TO SITE NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
