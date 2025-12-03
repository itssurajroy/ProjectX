import { AdminLayout } from "@/components/admin/AdminLayout";
export default function CachePage() {
  return (
    <AdminLayout current="cache">
      <div className="text-center py-32">
        <h1 className="text-7xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-12">
          Cache Control Panel
        </h1>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="bg-gray-900/60 rounded-3xl p-12 border border-orange-500/40">
            <p className="text-3xl text-gray-300 mb-8">Current Cache Size: 47.8 GB</p>
            <button className="px-20 py-10 text-4xl font-black bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl hover:scale-110 transition shadow-2xl">
              CLEAR ALL CACHE NOW
            </button>
            <p className="text-xl text-gray-500 mt-8">Last cleared: 47 minutes ago</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
