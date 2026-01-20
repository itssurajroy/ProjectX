'use client';
import BackToTopButton from "@/components/common/BackToTopButton";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { usePathname } from "next/navigation";
import AnnouncementBanner from "@/components/layout/AnnouncementBanner";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // The watch page should be immersive, so we hide some UI elements.
  const isWatchPage = /^\/watch\/[^/]+$/.test(pathname);
  const isW2GRoom = /^\/watch2gether\/[^/]+$/.test(pathname);
  
  // Header is now always shown.
  const showHeader = true;
  const showFooter = !isWatchPage && !isW2GRoom;
  const showMobileNav = !isWatchPage && !isW2GRoom;

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className={`flex-grow pt-16`}>
        {children}
      </main>
      {showFooter && <Footer />}
      {showMobileNav && <MobileBottomNav />}
      <BackToTopButton />
    </div>
  );
}
