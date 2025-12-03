
import { AdminLayout } from "@/components/admin/AdminLayout";
export default function CachePage() {
  return (
    <AdminLayout current="cache">
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold mb-8">Cache Control</h1>
        <button className="px-10 py-6 text-2xl bg-red-600 rounded-2xl hover:bg-red-700">CLEAR ALL CACHE NOW</button>
        <p className="mt-6 text-gray-400">Last cleared: 2 hours ago</p>
      </div>
    </AdminLayout>
  );
}
