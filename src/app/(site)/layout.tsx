
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

  const isAnimeDetailsPage = /^\/anime\/[^/]+$/.test(pathname);
  const isW2GRoom = /^\/watch2gether\/[^/]+$/.test(pathname);
  const isDashboard = pathname.startsWith('/dashboard');

  if (isW2GRoom) {
    return <main>{children}</main>;
  }

  if (isDashboard) {
      return null;
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {!isAnimeDetailsPage && <Header />}
      <main className={`flex-grow ${!isAnimeDetailsPage && 'pt-16'}`}>{children}</main>
      <Footer />
      <MobileBottomNav />
      <BackToTopButton />
      <ChangelogPopup />
    </div>
  );
}
