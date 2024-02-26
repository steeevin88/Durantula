import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Friends of Hoover Durant Public Library",
  description: "Application for planning events for Friends of Hoover Durant Public Library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={`bg-gray-300 {inter.className}`}>
          <Navbar loggedIn/>
          {children}
        </body>
      </UserProvider>
    </html>
  );
}
