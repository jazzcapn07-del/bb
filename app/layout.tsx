import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ChatwootWidget from "./components/ChatwootWidget";
import LiveChatButton from "./components/LiveChatButton";

const binancePlex = localFont({
  src: [
    {
      path: "../public/fonts/BinancePlex-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/BinancePlex-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/BinancePlex-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-binance-plex",
});

import { LanguageProvider } from "./context/LanguageContext";

export const metadata: Metadata = {
  title: "Binance Exchange | Account Assistance",
  description: "Binance Exchange | Account Assistance",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Binance Exchange | Account Assistance",
    description: "Binance Exchange | Account Assistance",
    images: "/og-image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={binancePlex.variable}>
      <body className="antialiased bg-[#181A21] font-sans">
        <LanguageProvider>
          {children}
          <ChatwootWidget />
          <LiveChatButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
