
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProjectX Admin",
  description: "Admin panel for ProjectX",
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
