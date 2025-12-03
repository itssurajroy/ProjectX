
import { AdminLayout } from "@/components/admin/AdminLayout";
import Dashboard from "@/components/admin/Dashboard";

export default function AdminDashboard() {
  return (
    <AdminLayout current="dashboard">
      <Dashboard />
    </AdminLayout>
  );
}
