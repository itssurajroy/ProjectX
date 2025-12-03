'use client';
import { AdminLayout } from "@/components/admin/AdminLayout";
import PermissionGuard from "@/components/admin/PermissionGuard";

export default function PermissionManager() {
  return (
    <PermissionGuard permission="promote_admins">
      <AdminLayout>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-7xl font-black text-center mb-20 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
            ADMIN PERMISSION MATRIX
          </h1>
          
          <div className="bg-black/80 rounded-3xl p-12 border border-red-600">
            <p className="text-3xl text-center text-red-400 mb-10">
              Only SUPERADMIN can access this page
            </p>
            <div className="space-y-8">
              {["user-abc123", "user-xyz789"].map(uid => (
                <div key={uid} className="bg-gray-900/60 rounded-2xl p-8 border border-purple-500">
                  <p className="text-2xl font-bold mb-6">User: {uid}</p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      "ban_users", "delete_comments", "clear_cache",
                      "edit_site_settings", "create_announcements", "promote_admins"
                    ].map(perm => (
                      <label key={perm} className="flex items-center gap-4 text-xl">
                        <input type="checkbox" className="w-8 h-8" />
                        <span className="text-purple-400">{perm}</span>
                      </label>
                    ))}
                  </div>
                  <button className="mt-8 px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-2xl font-bold">
                    SAVE PERMISSIONS
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    </PermissionGuard>
  );
}
