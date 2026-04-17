import type { Metadata } from "next";
import { FirebaseProvider } from "../lib/firebase-context";
import "./globals.css";

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME || 'AI Chat'}`,
  description: "AI-Powered Database Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
