
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AnnouncementsPage() {
  return (
    <AdminLayout current="announcements">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Announcements</h1>
        <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          <p className="text-xl text-gray-300">Full control panel for announcements</p>
          {/* Add your content here */}
        </div>
      </div>
    </AdminLayout>
  );
}
