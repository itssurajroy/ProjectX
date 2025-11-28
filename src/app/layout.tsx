
import type { Metadata } from "next";
import { Lexend, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import Navbar from "@/components/layout/header";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";
import ScrollToTopButton from "@/components/layout/scroll-to-top";
import { Toaster } from "react-hot-toast";
import Splash from "@/components/Splash";
import { Balancer as BalancerProvider } from 'react-wrap-balancer'
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
              <ScrollToTopButton />
              </SidebarProvider>
              </BalancerProvider>
            </Providers>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
