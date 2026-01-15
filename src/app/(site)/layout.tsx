
'use client';
import BackToTopButton from "@/components/common/BackToTopButton";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { usePathname } from "next/navigation";


export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isWatchPage = /^\/watch\/[^/]+$/.test(pathname);
  const isW2GRoom = /^\/watch2gether\/[^/]+$/.test(pathname);
  
  const showHeader = !isWatchPage && !isW2GRoom;
  const showFooter = !isWatchPage && !isW2GRoom;
  const showMobileNav = !isWatchPage && !isW2GRoom;

  return (
    <div className="flex flex-col min-h-screen w-full">
      {showHeader && <Header />}
      <main className={`flex-grow ${showHeader ? 'pt-16' : ''}`}>
        {children}
      </main>
      {showFooter && <Footer />}
      {showMobileNav && <MobileBottomNav />}
      <BackToTopButton />
    </div>
  );
}
