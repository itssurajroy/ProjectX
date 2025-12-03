
import ProtectedAdmin from "@/components/admin/ProtectedAdmin";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedAdmin>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedAdmin>
  );
}
