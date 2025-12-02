
'use client';

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import BackToTopButton from "@/components/common/BackToTopButton";
import { usePathname } from "next/navigation";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Don't render header/footer for watch2gether rooms, but do for the lobby
  const isW2GRoom = /^\/watch2gether\/[^/]+$/.test(pathname);

  if (isW2GRoom) {
    return <main>{children}</main>;
  }


  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
      <MobileBottomNav />
      <BackToTopButton />
    </div>
  );
}
