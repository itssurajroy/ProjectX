import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/header";
import Link from "next/link";
import { Twitter, Send, MessageSquare, Heart } from "lucide-react";
import AZList from "@/components/layout/az-list-footer";
import ScrollToTopButton from "@/components/layout/scroll-to-top";
import { Toaster as ShadToaster } from "@/components/ui/toaster";
import BottomNav from "@/components/layout/bottom-nav";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import { FirebaseClientProvider } from "@/firebase";
import Splash from "@/components/Splash";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "ProjectX - Watch Your Favorite Shows",
  description: "ProjectX - A modern streaming platform for all your favorite shows.",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
       </head>
      <body className={cn("min-h-screen bg-background text-foreground font-sans antialiased", inter.className)}>
        <FirebaseClientProvider>
          <Providers>
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
              <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-center mb-2 text-muted-foreground">
                    A-Z List <span className="font-normal">Searching anime order by alphabet name A to Z.</span>
                  </h3>
                  <AZList />
                </div>

                <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left">
                     <p className="text-xs max-w-2xl mb-2">
                      ProjectX does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
                    </p>
                    <p className="text-xs">© ProjectX. All rights reserved.</p>
                  </div>
                   <div className="flex items-center justify-start md:justify-end gap-3">
                      <Link href="/request" className="text-sm hover:text-primary">Request</Link>
                      <Link href="/contact" className="text-sm hover:text-primary">Contact us</Link>
                      <div className="flex items-center gap-2">
                        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-gray-700/50 rounded-full hover:bg-primary transition-colors"><Send className="w-4 h-4" /></a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-gray-700/50 rounded-full hover:bg-primary transition-colors"><Twitter className="w-4 h-4" /></a>
                      </div>
                  </div>
                </div>

              </div>
            </footer>
            <BottomNav />
            <ScrollToTopButton />
          </Providers>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}