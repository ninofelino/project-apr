import type { Metadata } from "next";
import { FirebaseProvider } from "../lib/firebase-context";
import "./globals.css";
import Link from 'next/link';
import { ShoppingCart, Package, History, LayoutDashboard } from 'lucide-react';

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME || 'UMKM POS'}`,
  description: "Point of Sale & Inventory Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <FirebaseProvider>
          <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <LayoutDashboard className="w-6 h-6 text-blue-600" />
                  UMKM POS
                </h1>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  Kasir
                </Link>
                <Link href="/inventory" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                  <Package className="w-5 h-5" />
                  Inventori
                </Link>
                <Link href="/history" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                  <History className="w-5 h-5" />
                  Riwayat
                </Link>
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <Link href="/chat" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium">
                    <LayoutDashboard className="w-4 h-4 opacity-70" />
                    AI Assistant
                  </Link>
                </div>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-50 relative">
              {children}
            </main>
          </div>
        </FirebaseProvider>
      </body>
    </html>
  );
}
