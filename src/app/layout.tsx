import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

// export const dynamic = 'auto' // default 
//  'auto' | 'force-dynamic' | 'error' | 'force-static'


// export const revalidate = false
// 	false | 0 | number


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('bg-background min-h-screen font-sans antialiased', inter.variable)}>{children}</body>
    </html>
  );
}
