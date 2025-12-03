// src/app/admin/page.tsx
import { AdminLayout } from "@/components/admin/AdminLayout";
import Dashboard from "@/components/admin/tabs/Dashboard";

export default function AdminDashboard() {
  return (
    <AdminLayout current="dashboard">
      <Dashboard />
    </AdminLayout>
  );
}
