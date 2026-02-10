import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import AuthLayout from "./AuthLayout";
import { Toaster } from "react-hot-toast";
import 'react-loading-skeleton/dist/skeleton.css'  
import { APP_DESCRIPTION, APP_NAME } from "@/setting";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: APP_NAME,
    description: APP_DESCRIPTION,
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>
                <AuthLayout>{children}</AuthLayout>  
                <Toaster />
            </body>
        </html>
    );
}

