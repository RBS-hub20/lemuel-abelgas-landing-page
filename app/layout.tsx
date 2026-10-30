import type { Metadata, Viewport } from "next";
import { Gloock, Instrument_Sans, Nothing_You_Could_Do } from "next/font/google";
import "./globals.css";

const display = Gloock({ subsets: ["latin"], weight: "400", variable: "--font-gloock" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });
const hand = Nothing_You_Could_Do({ subsets: ["latin"], weight: "400", variable: "--font-script" });

export const metadata: Metadata = {
  title: "Lemuel Abelgas | Trading, Entrepreneur, Community Builder",
  description:
    "Nice to meet you! I'm Lemuel Abelgas: from Cebu City to building businesses, teaching entrepreneurs, and a new chapter in trading.",
};

export const viewport: Viewport = { themeColor: "#0E1218" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
