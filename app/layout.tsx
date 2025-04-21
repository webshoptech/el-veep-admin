import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper"; // ✅ Import the client wrapper
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

// 👇 Define metadata from environment variables
export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "My App",
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Welcome to my app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
         <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
