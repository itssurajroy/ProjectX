import { AdminLayout } from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

export default function SuperAdminPanel() {
  return (
    <ProtectedRoute requiredRole="superadmin">
      <AdminLayout>
        <div className="space-y-10">
          <h1 className="text-7xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            SUPERADMIN CONTROL PANEL
          </h1>
          <div className="grid gap-8">
            <button className="px-20 py-16 text-4xl font-black bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl hover:scale-105 transition">
              DELETE ENTIRE DATABASE
            </button>
            <button className="px-20 py-16 text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl hover:scale-105 transition">
              PROMOTE USER TO ADMIN
            </button>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
