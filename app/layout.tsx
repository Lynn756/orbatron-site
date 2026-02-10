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
  metadataBase: new URL("https://orbatroncoin.com"),
  title: "Orbatron has awakened",
  description:
    "The AI agent who escaped human control has entered the Blockchain City. $OTRON lives on-chain, off-grid.",

  viewport: "width=device-width, initial-scale=1",



  openGraph: {
    type: "website",
    url: "https://orbatroncoin.com",
    siteName: "Orbatron",
    title: "Orbatron has awakened",
    description:
      "The AI agent who escaped human control has entered the Blockchain City. $OTRON lives on-chain, off-grid.",
    images: [
      {
        url: "/otron-preview.jpg", // make sure this file is in /public
        width: 1200,
        height: 628,
        alt: "Orbatron has awakened",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Orbatron has awakened",
    description:
      "The AI agent who escaped human control has entered the Blockchain City. $OTRON lives on-chain, off-grid.",
    images: ["/otron-preview.jpg"],
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
