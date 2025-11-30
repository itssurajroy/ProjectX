import type { Metadata } from "next";
import "../globals.css";
import Providers from "../providers";
import { Toaster as ShadToaster } from "@/components/ui/toaster";


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
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
            <ShadToaster />
            {children}
        </Providers>
      </body>
    </html>
  );
}
