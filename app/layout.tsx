import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Orbatron — Official Site",
  description: "Orbatron has been awakened. Mobile-first site.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    title: "Orbatron — Official Site",
    description: "Orbatron has been awakened. Mobile-first site.",
    url: "https://orbatroncoin.com",
    siteName: "Orbatron",
    images: ["/Orbatron.png"], // make sure Orbatron.png is in /public
  },
  twitter: {
    card: "summary_large_image",
    title: "Orbatron — Official Site",
    description: "Orbatron has been awakened. Mobile-first site.",
    images: ["/Orbatron.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
