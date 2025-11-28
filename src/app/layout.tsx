import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ScrollToTopButton from "@/components/layout/scroll-to-top";
import { Toaster as ShadToaster } from "@/components/ui/toaster";
import BottomNav from "@/components/layout/bottom-nav";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import { FirebaseClientProvider } from "@/firebase";
import Splash from "@/components/Splash";
import { Balancer as BalancerProvider } from 'react-wrap-balancer'


const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "ProjectX - Watch Your Favorite Shows",
  description: "A modern streaming platform for all your favorite shows.",
};

export const viewport: Viewport = {
  themeColor: '#0f0f17',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background text-foreground font-sans antialiased", inter.variable)}>
        <FirebaseClientProvider>
          <Providers>
            <BalancerProvider>
              <Splash />
              <ShadToaster />
              <Toaster position="bottom-center" toastOptions={{
                style: {
                  background: '#333',
                  color: '#fff',
                }
              }}/>
              <Navbar />
              <main className="pb-20 md:pb-0">{children}</main>
              <Footer />
              <BottomNav />
              <ScrollToTopButton />
            </BalancerProvider>
          </Providers>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
