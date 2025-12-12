
'use client';

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import BackToTopButton from "@/components/common/BackToTopButton";
import { usePathname } from "next/navigation";
import ChangelogPopup from "@/components/ChangelogPopup";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Don't render header/footer for watch2gether rooms or dashboard pages
  const isW2GRoom = /^\/watch2gether\/[^/]+$/.test(pathname);
  const isDashboard = pathname.startsWith('/dashboard');

  if (isW2GRoom) {
    return <main>{children}</main>;
  }

  // Only the dashboard layout should handle dashboard pages
  if (isDashboard) {
      return null;
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
      <MobileBottomNav />
      <BackToTopButton />
      <ChangelogPopup />
    </div>
  );
}
