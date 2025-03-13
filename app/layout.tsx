import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Way Go",
  description: "Courez partagez et découvrez de nouveaux endroits",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  authors: [
    {
      name: "Arthur Sornin",
      url: "https://www.linkedin.com",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#3643BA" />
        <meta name="background-color" content="#3643BA" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-base-neue antialiased`}
      >
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}