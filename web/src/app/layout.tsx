import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FXLayer } from "@/components/FXLayer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NovaNews",
  description: "Futuristic news + blog social platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-dvh`}>
        {/* Background layers */}
        <div className="fixed inset-0 bg-grid opacity-30" />
        <div className="fixed inset-0 bg-gradient-to-b from-indigo-900/20 via-black to-black" />
        <FXLayer />

        {/* Page container */}
        <div className="relative mx-auto w-full max-w-6xl px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}