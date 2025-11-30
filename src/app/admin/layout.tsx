
import type { Metadata } from "next";
import "../globals.css";
import Providers from "../providers";
import { Toaster as ShadToaster } from "@/components/ui/toaster";
import { Lexend, Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const fontSans = Lexend({ 
  subsets: ["latin"],
  variable: '--font-primary',
});

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: "ProjectX Admin",
  description: "Admin panel for ProjectX",
};

export default function AdminRootLayout({
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
        <Providers>
            <ShadToaster />
            {children}
        </Providers>
      </body>
    </html>
  );
}
