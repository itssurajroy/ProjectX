
import type { Metadata, Viewport } from "next";
import { Lexend, Space_Grotesk } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import Providers from "../providers";
import Header from "@/components/layout/header";
import { Toaster as ShadToaster } from "@/components/ui/toaster";
import Footer from "@/components/layout/footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import BackToTopButton from "@/components/common/BackToTopButton";
import FloatingDiscordButton from "@/components/common/FloatingDiscordButton";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { Suspense } from 'react';
import Loading from '../loading';

const fontSans = Lexend({ 
  subsets: ["latin"],
  variable: '--font-primary',
});

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: "ProjectX - Watch Your Favorite Shows",
  description: "A modern streaming platform for all your favorite shows.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0f0f17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full w-full m-0 p-0" suppressHydrationWarning>
       <head>
         <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
       </head>
      <body className={cn("h-full w-full min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden", fontSans.variable, fontDisplay.variable)}>
        <Suspense fallback={<Loading />}>
          <Providers>
            <NotificationProvider>
              <ShadToaster />
              <div className="flex flex-col min-h-screen w-full">
                <Header />
                <main className="flex-grow pt-16">{children}</main>
                <Footer />
              </div>
              <MobileBottomNav />
              <BackToTopButton />
              <FloatingDiscordButton />
            </NotificationProvider>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
