
// src/app/layout.tsx
'use client';

import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import { Toaster as ShadToaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import Loading from "./loading";
import { Analytics } from "@vercel/analytics/react";
import { FirebaseProvider } from "@/firebase/client/provider";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import BackToTopButton from "@/components/common/BackToTopButton";
import ChangelogPopup from "@/components/ChangelogPopup";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["300", "400", "500", "600", "700"],
});

const fontDisplay = Poppins({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800"],
});

// Metadata and Viewport are not used in a client component, but we keep them for static analysis
// export const metadata: Metadata = {
//   title: "ProjectX - Watch Your Favorite Shows",
//   description: "A modern streaming platform for all your favorite shows.",
//   manifest: "/manifest.json",
//   icons: {
//     icon: "/favicon.ico",
//   },
// };

// export const viewport: Viewport = {
//   themeColor: "#000000",
//   width: "device-width",
//   initialScale: 1,
//   maximumScale: 1,
// };

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isWatchPage = /^\/watch\/[^/]+$/.test(pathname);
  const isW2GRoom = /^\/watch2gether\/[^/]+$/.test(pathname);
  const isLoginPage = pathname === '/login';
  const isAdminPage = pathname.startsWith('/admin');

  const showHeader = !isWatchPage && !isW2GRoom && !isLoginPage && !isAdminPage;
  const showFooter = !isWatchPage && !isW2GRoom && !isLoginPage && !isAdminPage;
  const showMobileNav = !isWatchPage && !isW2GRoom && !isLoginPage && !isAdminPage;

  if (isW2GRoom || isLoginPage || isAdminPage) {
    return <main>{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {showHeader && <Header />}
      <main className={`flex-grow ${showHeader ? 'pt-16' : ''}`}>
        {children}
      </main>
      {showFooter && <Footer />}
      {showMobileNav && <MobileBottomNav />}
      <BackToTopButton />
      <ChangelogPopup />
    </div>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
        <link rel="manifest" href="/manifest.json" />
        <title>ProjectX - Watch Your Favorite Shows</title>
        <meta name="description" content="A modern streaming platform for all your favorite shows." />
      </head>

      <body
        suppressHydrationWarning={true}
        className={cn(
          "min-h-screen w-full bg-background text-foreground antialiased overflow-x-hidden",
          "font-sans", // default font
          fontSans.variable,
          fontDisplay.variable
        )}
      >
        <Suspense fallback={<Loading />}>
          <Providers>
            <FirebaseProvider>
              <NotificationProvider>
                <RootLayoutContent>
                  {children}
                </RootLayoutContent>
                <ShadToaster />
              </NotificationProvider>
            </FirebaseProvider>
          </Providers>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
