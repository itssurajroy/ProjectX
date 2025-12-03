// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Lexend, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import { Toaster as ShadToaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { Suspense } from "react";
import Loading from "./loading";
import { FirebaseClientProvider } from "@/firebase";
import { Analytics } from "@vercel/analytics/react";

const fontSans = Lexend({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["300", "400", "500", "600", "700"],
});

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ProjectX - Watch Your Favorite Shows",
  description: "A modern streaming platform for all your favorite shows.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body
        className={cn(
          "min-h-screen w-full bg-black text-white antialiased overflow-x-hidden",
          "font-sans", // default font
          fontSans.variable,
          fontDisplay.variable
        )}
      >
        <div className="flex flex-col min-h-screen">
          <Suspense fallback={<Loading />}>
            <Providers>
              <FirebaseClientProvider>
                <NotificationProvider>
                  <main className="flex-1 flex flex-col">{children}</main>
                  <ShadToaster />
                </NotificationProvider>
              </FirebaseClientProvider>
            </Providers>
          </Suspense>
          <Analytics />
        </div>
      </body>
    </html>
  );
}
