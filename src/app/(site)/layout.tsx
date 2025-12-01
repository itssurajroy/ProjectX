
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import BackToTopButton from "@/components/common/BackToTopButton";
import FloatingDiscordButton from "@/components/common/FloatingDiscordButton";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
      <MobileBottomNav />
      <BackToTopButton />
      <FloatingDiscordButton />
    </div>
  );
}
