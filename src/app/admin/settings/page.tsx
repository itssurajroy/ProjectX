// src/app/admin/settings/page.tsx
import { AdminLayout } from "@/components/admin/AdminLayout";
export default function SettingsPage() {
  return (
    <AdminLayout current="settings">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Site Settings</h1>
        <div className="space-y-6">
          <div className="flex justify-between items-center p-6 bg-gray-900/50 rounded-2xl">
            <div>
              <p className="text-xl font-bold">Maintenance Mode</p>
              <p className="text-gray-400">Site will show maintenance page</p>
            </div>
            <button className="px-8 py-4 bg-red-600 rounded-xl text-xl">ENABLE</button>
          </div>
          {/* Add more settings */}
        </div>
      </div>
    </AdminLayout>
  );
}
