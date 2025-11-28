import type { Metadata } from "next";
import { Lexend, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import Navbar from "@/components/layout/header";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";
import Link from "next/link";
import { Twitter, Send, MessageSquare, Heart } from "lucide-react";
import AZList from "@/components/layout/az-list-footer";
import ScrollToTopButton from "@/components/layout/scroll-to-top";
import { Toaster } from "react-hot-toast";
import Splash from "@/components/Splash";
import { Balancer as BalancerProvider } from 'react-wrap-balancer'
import BottomNav from "@/components/layout/bottom-nav";
import { Toaster as ShadToaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase";
import { SidebarProvider } from "@/components/ui/sidebar";

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
  themeColor: "#0f0f17",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
       <head>
         <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
       </head>
      <body className={cn("min-h-screen bg-background text-foreground font-sans antialiased", fontSans.variable, fontDisplay.variable)}>
        <FirebaseClientProvider>
            <Providers>
            <BalancerProvider>
            <SidebarProvider>
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
              <footer className="bg-[#100f14] text-gray-400 mt-12 border-t border-border/40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-gray-800 pb-8 mb-8">
                    <div>
                      <Link href="/" className="text-3xl font-bold text-glow font-display">
                        <span className="text-primary">Project</span>
                        <span className="text-white">X</span>
                      </Link>
                    </div>
                    <div className="flex items-center justify-start md:justify-end gap-3">
                      <p className="text-sm mr-4 hidden sm:block">Join now 👇</p>
                      <a href="/community" className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition-colors"><MessageSquare className="w-5 h-5" /></a>
                      <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition-colors"><Send className="w-5 h-5" /></a>
                      <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition-colors"><Twitter className="w-5 h-5" /></a>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <AZList />
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-6">
                    <Link href="/terms" className="hover:text-primary">Terms of service</Link>
                    <Link href="/dmca" className="hover:text-primary">DMCA</Link>
                    <Link href="/contact" className="hover:text-primary">Contact</Link>
                    <Link href="/support" className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300">
                        <Heart className="w-4 h-4" /> Support Us
                    </Link>
                  </div>

                  <p className="text-xs max-w-2xl mb-6">
                    ProjectX does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
                  </p>

                  <p className="text-xs">© ProjectX. All rights reserved. This is a fictional service.</p>
                </div>
              </footer>
              <BottomNav />
              <ScrollToTopButton />
              </SidebarProvider>
              </BalancerProvider>
            </Providers>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
